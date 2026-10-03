import { Prisma } from "@prisma/client";
import { prisma, rethrowPrismaError } from "../../infrastructure/database";
import type { UpdateUserInput, UserListQuery } from "./users.schema";
import type { UserRecord } from "./users.types";

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type CreateUserData = {
  name: string;
  email: string;
  passwordHash: string;
};

export type AuthUserRecord = UserRecord & {
  passwordHash: string;
};

export type UserListFilters = {
  skip: number;
  take: number;
  search?: string;
  sortBy: UserListQuery["sortBy"];
  order: UserListQuery["order"];
};

export type UserRepository = {
  create(input: CreateUserData): Promise<UserRecord>;
  list(filters: UserListFilters): Promise<{ items: UserRecord[]; total: number }>;
  findById(id: string): Promise<UserRecord | null>;
  findByEmail(email: string): Promise<UserRecord | null>;
  findAuthById(id: string): Promise<AuthUserRecord | null>;
  findAuthByEmail(email: string): Promise<AuthUserRecord | null>;
  update(id: string, input: UpdateUserInput): Promise<UserRecord>;
  updatePassword(id: string, passwordHash: string): Promise<void>;
  delete(id: string): Promise<void>;
};

function userSearchWhere(search?: string): Prisma.UserWhereInput | undefined {
  if (!search) {
    return undefined;
  }

  return {
    OR: [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ],
  };
}

export class PrismaUserRepository implements UserRepository {
  async create(input: CreateUserData): Promise<UserRecord> {
    try {
      return await prisma.user.create({
        data: {
          name: input.name,
          email: input.email.toLowerCase(),
          passwordHash: input.passwordHash,
        },
        select: publicUserSelect,
      });
    } catch (error) {
      rethrowPrismaError(error);
    }
  }

  async list(filters: UserListFilters): Promise<{ items: UserRecord[]; total: number }> {
    const where = userSearchWhere(filters.search);
    const orderBy: Prisma.UserOrderByWithRelationInput = { [filters.sortBy]: filters.order };

    const [items, total] = await prisma.$transaction([
      prisma.user.findMany({
        ...(where ? { where } : {}),
        skip: filters.skip,
        take: filters.take,
        orderBy,
        select: publicUserSelect,
      }),
      prisma.user.count(where ? { where } : undefined),
    ]);

    return { items, total };
  }

  async findById(id: string): Promise<UserRecord | null> {
    return prisma.user.findUnique({ where: { id }, select: publicUserSelect });
  }

  async findAuthById(id: string): Promise<AuthUserRecord | null> {
    return prisma.user.findUnique({
      where: { id },
      select: { ...publicUserSelect, passwordHash: true },
    });
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: publicUserSelect,
    });
  }

  async findAuthByEmail(email: string): Promise<AuthUserRecord | null> {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { ...publicUserSelect, passwordHash: true },
    });
  }

  async update(id: string, input: UpdateUserInput): Promise<UserRecord> {
    try {
      return await prisma.user.update({
        where: { id },
        data: {
          ...(input.name !== undefined ? { name: input.name } : {}),
          ...(input.email !== undefined ? { email: input.email.toLowerCase() } : {}),
        },
        select: publicUserSelect,
      });
    } catch (error) {
      rethrowPrismaError(error);
    }
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    try {
      await prisma.user.update({
        where: { id },
        data: { passwordHash },
      });
    } catch (error) {
      rethrowPrismaError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await prisma.user.delete({ where: { id } });
    } catch (error) {
      rethrowPrismaError(error);
    }
  }
}
