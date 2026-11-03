import { z } from "zod";
import { paginationQuerySchema } from "../../shared/validators";

export const auditActions = [
  "USER_CREATED",
  "USER_UPDATED",
  "USER_DELETED",
  "PASSWORD_CHANGED",
  "RESOURCE_TYPE_CREATED",
  "RESOURCE_TYPE_UPDATED",
  "RESOURCE_TYPE_DELETED",
  "RESOURCE_CREATED",
  "RESOURCE_UPDATED",
  "RESOURCE_DELETED",
  "BOOKING_CREATED",
  "BOOKING_CANCELLED",
] as const;

export const auditListQuerySchema = paginationQuerySchema.extend({
  search: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined)),
  action: z.enum(auditActions).optional(),
  entity: z.string().trim().min(1).optional(),
  actorId: z.uuid().optional(),
  sortBy: z.enum(["createdAt", "action", "entity"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type AuditListQuery = z.infer<typeof auditListQuerySchema>;
export type AuditAction = (typeof auditActions)[number];
