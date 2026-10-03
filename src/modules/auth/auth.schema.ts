import { z } from "zod";
import { passwordSchema, strongPasswordSchema } from "../../shared/validators";
import { createUserSchema } from "../users/users.schema";

export const registerSchema = createUserSchema;

export const loginSchema = z.object({
  email: z.email("email must be valid"),
  password: passwordSchema,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "currentPassword is required"),
  newPassword: strongPasswordSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
