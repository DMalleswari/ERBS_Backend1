import { z } from "zod";
import { paginationQuerySchema, queryBooleanSchema } from "../../shared/validators";

const nameSchema = z.string().trim().min(1).max(120);
const locationSchema = z.string().trim().min(1).max(200);

export const createResourceSchema = z.object({
  name: nameSchema,
  description: z.string().trim().max(1000).optional(),
  resourceTypeId: z.uuid("resourceTypeId must be a valid UUID"),
  capacity: z.number().int().positive(),
  location: locationSchema,
  isActive: z.boolean().optional(),
});

export const updateResourceSchema = z
  .object({
    name: nameSchema.optional(),
    description: z.string().trim().max(1000).nullable().optional(),
    resourceTypeId: z.uuid().optional(),
    capacity: z.number().int().positive().optional(),
    location: locationSchema.optional(),
    isActive: z.boolean().optional(),
  })
  .refine((value) => Object.values(value).some((item) => item !== undefined), {
    message: "At least one field is required",
  });

export const resourceListQuerySchema = paginationQuerySchema.extend({
  search: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined)),
  resourceTypeId: z.uuid().optional(),
  location: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined)),
  isActive: queryBooleanSchema,
  sortBy: z.enum(["name", "capacity", "location", "createdAt", "updatedAt"]).default("name"),
  order: z.enum(["asc", "desc"]).default("asc"),
});

export const resourceIdParamSchema = z.object({
  id: z.uuid("id must be a valid UUID"),
});

export type CreateResourceInput = z.infer<typeof createResourceSchema>;
export type UpdateResourceInput = z.infer<typeof updateResourceSchema>;
export type ResourceListQuery = z.infer<typeof resourceListQuerySchema>;
