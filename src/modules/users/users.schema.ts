import { z } from "zod";
import { paginationQuerySchema, strongPasswordSchema } from "../../shared/validators";

const nameSchema = z.string().trim().min(1, "name is required").max(100);
const emailSchema = z.email("email must be valid");

export const userSortFields = ["name", "email", "createdAt", "updatedAt"] as const;
export const sortOrders = ["asc", "desc"] as const;

export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: strongPasswordSchema,
});

export const userListQuerySchema = paginationQuerySchema.extend({
  search: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined)),
  sortBy: z.enum(userSortFields).default("createdAt"),
  order: z.enum(sortOrders).default("desc"),
});

export const updateUserSchema = z
  .object({
    name: nameSchema.optional(),
    email: emailSchema.optional(),
  })
  .refine((value) => value.name !== undefined || value.email !== undefined, {
    message: "At least one field is required",
  });

export const userIdParamSchema = z.object({
  id: z.uuid("id must be a valid UUID"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserListQuery = z.infer<typeof userListQuerySchema>;
