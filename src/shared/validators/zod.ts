import { z, type ZodError } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "password must be at least 8 characters")
  .max(72, "password must be at most 72 characters");

export const strongPasswordSchema = passwordSchema
  .regex(/[A-Z]/, "password must include an uppercase letter")
  .regex(/[a-z]/, "password must include a lowercase letter")
  .regex(/[0-9]/, "password must include a number")
  .regex(/[^A-Za-z0-9]/, "password must include a special character");

export const idParamSchema = z.object({
  id: z.string().trim().min(1, "id is required"),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export function formatZodError(error: ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.join(".") || "request",
    message: issue.message,
  }));
}
