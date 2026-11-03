export type AuditLogRecord = {
  id: string;
  actorId: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  createdAt: Date;
};

export type AuditLogDto = {
  id: string;
  actorId: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  createdAt: string;
};
