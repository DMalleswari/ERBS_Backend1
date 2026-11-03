import { AppError } from "../../shared/errors";
import { pageMeta, pageSkip } from "../../shared/utils";
import { auditLogService } from "../audit-logs/audit-logs.service";
import { PrismaResourceTypeRepository } from "../resource-types/resource-types.repository";
import { toResourceDto } from "./resources.mapper";
import { PrismaResourceRepository } from "./resources.repository";
import type { CreateResourceInput, ResourceListQuery, UpdateResourceInput } from "./resources.schema";

export class ResourceService {
  constructor(
    private readonly resources = new PrismaResourceRepository(),
    private readonly types = new PrismaResourceTypeRepository(),
  ) {}

  async create(input: CreateResourceInput, actorId: string) {
    const type = await this.types.findById(input.resourceTypeId);
    if (!type || !type.isActive) {
      throw new AppError("Resource type not found", 404);
    }
    const created = await this.resources.create(input);
    await auditLogService.record({
      actorId,
      action: "RESOURCE_CREATED",
      entity: "Resource",
      entityId: created.id,
    });
    return toResourceDto(created);
  }

  async list(query: ResourceListQuery) {
    const { items, total } = await this.resources.list({
      skip: pageSkip(query.page, query.limit),
      take: query.limit,
      sortBy: query.sortBy,
      order: query.order,
      ...(query.search ? { search: query.search } : {}),
      ...(query.resourceTypeId ? { resourceTypeId: query.resourceTypeId } : {}),
      ...(query.location ? { location: query.location } : {}),
      ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
    });
    return { items: items.map(toResourceDto), meta: pageMeta(query.page, query.limit, total) };
  }

  async getById(id: string) {
    const resource = await this.resources.findById(id);
    if (!resource) {
      throw new AppError("Resource not found", 404);
    }
    return toResourceDto(resource);
  }

  async update(id: string, input: UpdateResourceInput, actorId: string) {
    await this.getById(id);
    if (input.resourceTypeId) {
      const type = await this.types.findById(input.resourceTypeId);
      if (!type || !type.isActive) {
        throw new AppError("Resource type not found", 404);
      }
    }
    const updated = await this.resources.update(id, input);
    await auditLogService.record({
      actorId,
      action: "RESOURCE_UPDATED",
      entity: "Resource",
      entityId: id,
    });
    return toResourceDto(updated);
  }

  async remove(id: string, actorId: string) {
    await this.getById(id);
    const bookings = await this.resources.countBookings(id);
    if (bookings > 0) {
      throw new AppError("Resource has bookings", 409);
    }
    await this.resources.delete(id);
    await auditLogService.record({
      actorId,
      action: "RESOURCE_DELETED",
      entity: "Resource",
      entityId: id,
    });
  }
}

export const resourceService = new ResourceService();
