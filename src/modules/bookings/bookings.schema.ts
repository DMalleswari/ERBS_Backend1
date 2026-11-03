import { z } from "zod";
import { paginationQuerySchema } from "../../shared/validators";

export const createBookingSchema = z.object({
  resourceId: z.uuid("resourceId must be a valid UUID"),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
});

export const bookingListQuerySchema = paginationQuerySchema.extend({
  userId: z.uuid().optional(),
  resourceId: z.uuid().optional(),
  status: z.enum(["ACTIVE", "CANCELLED"]).optional(),
  sortBy: z.enum(["startTime", "endTime", "createdAt", "status"]).default("startTime"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export const bookingIdParamSchema = z.object({
  id: z.uuid("id must be a valid UUID"),
});

export const bookingResourceParamSchema = z.object({
  resourceId: z.uuid("resourceId must be a valid UUID"),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type BookingListQuery = z.infer<typeof bookingListQuerySchema>;
