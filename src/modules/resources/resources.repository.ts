import { Prisma } from "@prisma/client";
import { prisma, rethrowPrismaError } from "../../infrastructure/database";
import type { CreateResourceInput, ResourceListQuery, UpdateResourceInput } from "./resources.schema";
import type { ResourceRecord } from "./resources.types";

export type ResourceFilters = {
  skip: number;
  take: number;
  search?: string;
  resourceTypeId?: string;
  location?: string;
  isActive?: boolean;
  sortBy: ResourceListQuery["sortBy"];
  order: ResourceListQuery["order"];
};

export class PrismaResourceRepository {
  async create(input: CreateResourceInput): Promise<ResourceRecord> {
    try {
      return await prisma.resource.create({
        data: {
          name: input.name,
          resourceTypeId: input.resourceTypeId,
          capacity: input.capacity,
          location: input.location,
          ...(input.description !== undefined ? { description: input.description } : {}),
          ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
        },
      });
    } catch (error) {
      rethrowPrismaError(error);
    }
  }

  async list(filters: ResourceFilters): Promise<{ items: ResourceRecord[]; total: number }> {
    const where: Prisma.ResourceWhereInput = {
      ...(filters.resourceTypeId ? { resourceTypeId: filters.resourceTypeId } : {}),
      ...(filters.isActive !== undefined ? { isActive: filters.isActive } : {}),
      ...(filters.location ? { location: { contains: filters.location, mode: "insensitive" } } : {}),
      ...(filters.search
        ? {
            OR: [
              { name: { contains: filters.search, mode: "insensitive" } },
              { description: { contains: filters.search, mode: "insensitive" } },
              { location: { contains: filters.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };
    const orderBy: Prisma.ResourceOrderByWithRelationInput = { [filters.sortBy]: filters.order };
    const [items, total] = await prisma.$transaction([
      prisma.resource.findMany({ where, skip: filters.skip, take: filters.take, orderBy }),
      prisma.resource.count({ where }),
    ]);
    return { items, total };
  }

  async findById(id: string): Promise<ResourceRecord | null> {
    return prisma.resource.findUnique({ where: { id } });
  }

  async update(id: string, input: UpdateResourceInput): Promise<ResourceRecord> {
    try {
      return await prisma.resource.update({
        where: { id },
        data: {
          ...(input.name !== undefined ? { name: input.name } : {}),
          ...(input.description !== undefined ? { description: input.description } : {}),
          ...(input.resourceTypeId !== undefined ? { resourceTypeId: input.resourceTypeId } : {}),
          ...(input.capacity !== undefined ? { capacity: input.capacity } : {}),
          ...(input.location !== undefined ? { location: input.location } : {}),
          ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
        },
      });
    } catch (error) {
      rethrowPrismaError(error);
    }
  }

  async countBookings(id: string): Promise<number> {
    return prisma.booking.count({ where: { resourceId: id } });
  }

  async delete(id: string): Promise<void> {
    try {
      await prisma.resource.delete({ where: { id } });
    } catch (error) {
      rethrowPrismaError(error);
    }
  }
}
