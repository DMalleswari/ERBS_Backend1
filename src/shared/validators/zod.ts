import { z, type ZodError } from "zod";

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
