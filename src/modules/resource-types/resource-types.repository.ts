import { Prisma } from "@prisma/client";
import { prisma, rethrowPrismaError } from "../../infrastructure/database";
import type { CreateResourceTypeInput, ResourceTypeListQuery, UpdateResourceTypeInput } from "./resource-types.schema";
import type { ResourceTypeRecord } from "./resource-types.types";

export type ResourceTypeFilters = {
  skip: number;
  take: number;
  search?: string;
  isActive?: boolean;
  sortBy: ResourceTypeListQuery["sortBy"];
  order: ResourceTypeListQuery["order"];
};

export class PrismaResourceTypeRepository {
  async create(input: CreateResourceTypeInput): Promise<ResourceTypeRecord> {
    try {
      return await prisma.resourceType.create({
        data: {
          code: input.code,
          name: input.name,
          ...(input.description !== undefined ? { description: input.description } : {}),
          ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
        },
      });
    } catch (error) {
      rethrowPrismaError(error);
    }
  }

  async list(filters: ResourceTypeFilters): Promise<{ items: ResourceTypeRecord[]; total: number }> {
    const where: Prisma.ResourceTypeWhereInput = {
      ...(filters.isActive !== undefined ? { isActive: filters.isActive } : {}),
      ...(filters.search
        ? {
            OR: [
              { name: { contains: filters.search, mode: "insensitive" } },
              { code: { contains: filters.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };
    const orderBy: Prisma.ResourceTypeOrderByWithRelationInput = { [filters.sortBy]: filters.order };
    const [items, total] = await prisma.$transaction([
      prisma.resourceType.findMany({ where, skip: filters.skip, take: filters.take, orderBy }),
      prisma.resourceType.count({ where }),
    ]);
    return { items, total };
  }

  async findById(id: string): Promise<ResourceTypeRecord | null> {
    return prisma.resourceType.findUnique({ where: { id } });
  }

  async update(id: string, input: UpdateResourceTypeInput): Promise<ResourceTypeRecord> {
    try {
      return await prisma.resourceType.update({
        where: { id },
        data: {
          ...(input.code !== undefined ? { code: input.code } : {}),
          ...(input.name !== undefined ? { name: input.name } : {}),
          ...(input.description !== undefined ? { description: input.description } : {}),
          ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
        },
      });
    } catch (error) {
      rethrowPrismaError(error);
    }
  }

  async countResources(id: string): Promise<number> {
    return prisma.resource.count({ where: { resourceTypeId: id } });
  }

  async delete(id: string): Promise<void> {
    try {
      await prisma.resourceType.delete({ where: { id } });
    } catch (error) {
      rethrowPrismaError(error);
    }
  }
}
