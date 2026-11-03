import { hashPassword } from "../../infrastructure/security";
import { AppError } from "../../shared/errors";
import { pageMeta, pageSkip } from "../../shared/utils";
import { auditLogService } from "../audit-logs/audit-logs.service";
import { toUserDto } from "./users.mapper";
import { PrismaUserRepository, type UserRepository } from "./users.repository";
import type { CreateUserInput, UpdateUserInput, UserListQuery } from "./users.schema";
import type { UserDto, UserRecord } from "./users.types";

export class UsersService {
  constructor(private readonly users: UserRepository) {}

  async create(input: CreateUserInput, actorId?: string): Promise<UserDto> {
    const existing = await this.users.findByEmail(input.email);
    if (existing) {
      throw new AppError("Email already exists", 409);
    }

    const passwordHash = await hashPassword(input.password);
    const created = await this.users.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });
    await auditLogService.record({
      actorId: actorId ?? created.id,
      action: "USER_CREATED",
      entity: "User",
      entityId: created.id,
    });
    return toUserDto(created);
  }

  async list(query: UserListQuery): Promise<{ items: UserDto[]; meta: ReturnType<typeof pageMeta> }> {
    const filters = {
      skip: pageSkip(query.page, query.limit),
      take: query.limit,
      sortBy: query.sortBy,
      order: query.order,
      ...(query.search ? { search: query.search } : {}),
    };
    const { items, total } = await this.users.list(filters);
    return {
      items: items.map(toUserDto),
      meta: pageMeta(query.page, query.limit, total),
    };
  }

  async getById(id: string): Promise<UserDto> {
    return toUserDto(await this.requireUser(id));
  }

  async update(id: string, input: UpdateUserInput, actorId: string): Promise<UserDto> {
    await this.requireUser(id);

    if (input.email !== undefined) {
      const existing = await this.users.findByEmail(input.email);
      if (existing && existing.id !== id) {
        throw new AppError("Email already exists", 409);
      }
    }

    const updated = toUserDto(await this.users.update(id, input));
    await auditLogService.record({
      actorId,
      action: "USER_UPDATED",
      entity: "User",
      entityId: id,
    });
    return updated;
  }

  async remove(id: string, actorId: string): Promise<void> {
    await this.requireUser(id);
    await this.users.delete(id);
    await auditLogService.record({
      actorId,
      action: "USER_DELETED",
      entity: "User",
      entityId: id,
    });
  }

  private async requireUser(id: string): Promise<UserRecord> {
    const user = await this.users.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }
}

export const usersService = new UsersService(new PrismaUserRepository());
