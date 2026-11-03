import { logger } from "../../infrastructure/logger";
import { pageMeta, pageSkip } from "../../shared/utils";
import { toAuditLogDto } from "./audit-logs.mapper";
import { PrismaAuditLogRepository, type CreateAuditLogData } from "./audit-logs.repository";
import type { AuditListQuery } from "./audit-logs.schema";

export class AuditLogService {
  constructor(private readonly logs = new PrismaAuditLogRepository()) {}

  async record(input: CreateAuditLogData): Promise<void> {
    const log = await this.logs.create(input);
    logger.info("audit", {
      action: log.action,
      entity: log.entity,
      entityId: log.entityId,
      actorId: log.actorId,
    });
  }

  async list(query: AuditListQuery) {
    const { items, total } = await this.logs.list({
      skip: pageSkip(query.page, query.limit),
      take: query.limit,
      sortBy: query.sortBy,
      order: query.order,
      ...(query.search ? { search: query.search } : {}),
      ...(query.action ? { action: query.action } : {}),
      ...(query.entity ? { entity: query.entity } : {}),
      ...(query.actorId ? { actorId: query.actorId } : {}),
    });
    return { items: items.map(toAuditLogDto), meta: pageMeta(query.page, query.limit, total) };
  }
}

export const auditLogService = new AuditLogService();
