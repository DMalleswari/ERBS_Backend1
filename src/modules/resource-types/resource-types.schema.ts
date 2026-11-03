import { z } from "zod";
import { paginationQuerySchema, queryBooleanSchema } from "../../shared/validators";

const codeSchema = z
  .string()
  .trim()
  .min(2)
  .max(40)
  .regex(/^[A-Za-z0-9_]+$/, "code must contain only letters, numbers, and underscores")
  .transform((value) => value.toUpperCase());

const nameSchema = z.string().trim().min(1).max(100);

export const createResourceTypeSchema = z.object({
  code: codeSchema,
  name: nameSchema,
  description: z.string().trim().max(500).optional(),
  isActive: z.boolean().optional(),
});

export const updateResourceTypeSchema = z
  .object({
    code: codeSchema.optional(),
    name: nameSchema.optional(),
    description: z.string().trim().max(500).nullable().optional(),
    isActive: z.boolean().optional(),
  })
  .refine((value) => Object.values(value).some((item) => item !== undefined), {
    message: "At least one field is required",
  });

export const resourceTypeListQuerySchema = paginationQuerySchema.extend({
  search: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined)),
  isActive: queryBooleanSchema,
  sortBy: z.enum(["name", "code", "createdAt", "updatedAt"]).default("name"),
  order: z.enum(["asc", "desc"]).default("asc"),
});

export const resourceTypeIdParamSchema = z.object({
  id: z.uuid("id must be a valid UUID"),
});

export type CreateResourceTypeInput = z.infer<typeof createResourceTypeSchema>;
export type UpdateResourceTypeInput = z.infer<typeof updateResourceTypeSchema>;
export type ResourceTypeListQuery = z.infer<typeof resourceTypeListQuerySchema>;
