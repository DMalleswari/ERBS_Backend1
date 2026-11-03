import { AppError } from "../../shared/errors";
import { pageMeta, pageSkip } from "../../shared/utils";
import { auditLogService } from "../audit-logs/audit-logs.service";
import { toResourceTypeDto } from "./resource-types.mapper";
import { PrismaResourceTypeRepository } from "./resource-types.repository";
import type { CreateResourceTypeInput, ResourceTypeListQuery, UpdateResourceTypeInput } from "./resource-types.schema";

export class ResourceTypeService {
  constructor(private readonly types = new PrismaResourceTypeRepository()) {}

  async create(input: CreateResourceTypeInput, actorId: string) {
    const created = await this.types.create(input);
    await auditLogService.record({
      actorId,
      action: "RESOURCE_TYPE_CREATED",
      entity: "ResourceType",
      entityId: created.id,
    });
    return toResourceTypeDto(created);
  }

  async list(query: ResourceTypeListQuery) {
    const { items, total } = await this.types.list({
      skip: pageSkip(query.page, query.limit),
      take: query.limit,
      sortBy: query.sortBy,
      order: query.order,
      ...(query.search ? { search: query.search } : {}),
      ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
    });
    return { items: items.map(toResourceTypeDto), meta: pageMeta(query.page, query.limit, total) };
  }

  async getById(id: string) {
    const type = await this.types.findById(id);
    if (!type) {
      throw new AppError("Resource type not found", 404);
    }
    return toResourceTypeDto(type);
  }

  async update(id: string, input: UpdateResourceTypeInput, actorId: string) {
    await this.getById(id);
    const updated = await this.types.update(id, input);
    await auditLogService.record({
      actorId,
      action: "RESOURCE_TYPE_UPDATED",
      entity: "ResourceType",
      entityId: id,
    });
    return toResourceTypeDto(updated);
  }

  async remove(id: string, actorId: string) {
    await this.getById(id);
    const inUse = await this.types.countResources(id);
    if (inUse > 0) {
      throw new AppError("Resource type is in use", 409);
    }
    await this.types.delete(id);
    await auditLogService.record({
      actorId,
      action: "RESOURCE_TYPE_DELETED",
      entity: "ResourceType",
      entityId: id,
    });
  }
}

export const resourceTypeService = new ResourceTypeService();
