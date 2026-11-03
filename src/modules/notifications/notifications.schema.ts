import { z } from "zod";
import { paginationQuerySchema, queryBooleanSchema } from "../../shared/validators";

export const notificationListQuerySchema = paginationQuerySchema.extend({
  isRead: queryBooleanSchema,
  sortBy: z.enum(["createdAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export const notificationIdParamSchema = z.object({
  id: z.uuid("id must be a valid UUID"),
});

export type NotificationListQuery = z.infer<typeof notificationListQuerySchema>;
