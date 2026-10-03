import { hashPassword } from "../../infrastructure/security";
import { AppError } from "../../shared/errors";
import { pageMeta, pageSkip } from "../../shared/utils";
import { toUserDto } from "./users.mapper";
import { PrismaUserRepository, type UserRepository } from "./users.repository";
import type { CreateUserInput, UpdateUserInput, UserListQuery } from "./users.schema";
import type { UserDto, UserRecord } from "./users.types";

export class UsersService {
  constructor(private readonly users: UserRepository) {}

  async create(input: CreateUserInput): Promise<UserDto> {
    const existing = await this.users.findByEmail(input.email);
    if (existing) {
      throw new AppError("Email already exists", 409);
    }

    const passwordHash = await hashPassword(input.password);
    return toUserDto(
      await this.users.create({
        name: input.name,
        email: input.email,
        passwordHash,
      }),
    );
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

  async update(id: string, input: UpdateUserInput): Promise<UserDto> {
    await this.requireUser(id);

    if (input.email !== undefined) {
      const existing = await this.users.findByEmail(input.email);
      if (existing && existing.id !== id) {
        throw new AppError("Email already exists", 409);
      }
    }

    return toUserDto(await this.users.update(id, input));
  }

  async remove(id: string): Promise<void> {
    await this.requireUser(id);
    await this.users.delete(id);
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
