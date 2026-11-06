import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"], {
    error: "NODE_ENV must be development, test, or production",
  }),
  PORT: z.coerce.number({ error: "PORT must be a number" }).int().positive(),
  DATABASE_URL: z
    .string({ error: "DATABASE_URL is required" })
    .min(1, "DATABASE_URL is required")
    .refine(
      (value) => value.startsWith("postgresql://") || value.startsWith("postgres://"),
      "DATABASE_URL must be a PostgreSQL connection string",
    ),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
  JWT_EXPIRES_IN: z.string().min(1).default("1d"),
  CORS_ORIGIN: z.string().min(1).default("http://localhost:5173"),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  PASSWORD_RESET_EXPIRES_MINUTES: z.coerce.number().int().positive().default(30),
  SMTP_HOST: z.string().min(1).optional(),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_SECURE: z
    .union([z.enum(["true", "false"]), z.boolean()])
    .optional()
    .transform((value) => value === true || value === "true"),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  // Set false on Windows when antivirus/proxy injects a self-signed cert (dev only).
  SMTP_TLS_REJECT_UNAUTHORIZED: z
    .union([z.enum(["true", "false"]), z.boolean()])
    .optional()
    .transform((value) => {
      if (value === undefined) return true;
      return value === true || value === "true";
    }),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration. Fix .env and restart.");
  for (const issue of parsed.error.issues) {
    const field = issue.path.join(".") || "env";
    console.error(`- ${field}: ${issue.message}`);
  }
  process.exit(1);
}

export const env = parsed.data;
export type Env = z.infer<typeof envSchema>;
