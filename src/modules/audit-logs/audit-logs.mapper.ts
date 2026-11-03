import type { AuditLogDto, AuditLogRecord } from "./audit-logs.types";

export function toAuditLogDto(log: AuditLogRecord): AuditLogDto {
  return {
    id: log.id,
    actorId: log.actorId,
    action: log.action,
    entity: log.entity,
    entityId: log.entityId,
    createdAt: log.createdAt.toISOString(),
  };
}
