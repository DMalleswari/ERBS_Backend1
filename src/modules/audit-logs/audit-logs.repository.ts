import { Prisma } from "@prisma/client";
import { prisma } from "../../infrastructure/database";
import type { AuditAction, AuditListQuery } from "./audit-logs.schema";
import type { AuditLogRecord } from "./audit-logs.types";

export type CreateAuditLogData = {
  actorId?: string;
  action: AuditAction;
  entity: string;
  entityId?: string;
};

export type AuditLogFilters = {
  skip: number;
  take: number;
  search?: string;
  action?: AuditAction;
  entity?: string;
  actorId?: string;
  sortBy: AuditListQuery["sortBy"];
  order: AuditListQuery["order"];
};

export type AuditLogRepository = {
  create(input: CreateAuditLogData): Promise<AuditLogRecord>;
  list(filters: AuditLogFilters): Promise<{ items: AuditLogRecord[]; total: number }>;
};

export class PrismaAuditLogRepository implements AuditLogRepository {
  async create(input: CreateAuditLogData): Promise<AuditLogRecord> {
    return prisma.auditLog.create({
      data: {
        action: input.action,
        entity: input.entity,
        ...(input.actorId ? { actorId: input.actorId } : {}),
        ...(input.entityId ? { entityId: input.entityId } : {}),
      },
    });
  }

  async list(filters: AuditLogFilters): Promise<{ items: AuditLogRecord[]; total: number }> {
    const where: Prisma.AuditLogWhereInput = {
      ...(filters.action ? { action: filters.action } : {}),
      ...(filters.entity ? { entity: filters.entity } : {}),
      ...(filters.actorId ? { actorId: filters.actorId } : {}),
      ...(filters.search
        ? {
            OR: [
              { action: { contains: filters.search, mode: "insensitive" } },
              { entity: { contains: filters.search, mode: "insensitive" } },
              { entityId: { contains: filters.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };
    const orderBy: Prisma.AuditLogOrderByWithRelationInput = { [filters.sortBy]: filters.order };
    const [items, total] = await prisma.$transaction([
      prisma.auditLog.findMany({
        where,
        skip: filters.skip,
        take: filters.take,
        orderBy,
      }),
      prisma.auditLog.count({ where }),
    ]);
    return { items, total };
  }
}
