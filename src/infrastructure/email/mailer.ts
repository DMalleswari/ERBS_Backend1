import nodemailer from "nodemailer";
import { env } from "../../config";
import { logger } from "../logger";
import { buildPasswordResetEmail } from "./templates/password-reset";

function createTransport() {
  if (!env.SMTP_HOST) {
    return null;
  }

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE ?? env.SMTP_PORT === 465,
    auth:
      env.SMTP_USER && env.SMTP_PASS
        ? {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS,
          }
        : undefined,
    tls: {
      rejectUnauthorized: env.SMTP_TLS_REJECT_UNAUTHORIZED,
    },
  });
}

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  const { subject, text, html } = buildPasswordResetEmail(resetUrl);

  const transport = createTransport();
  if (!transport) {
    logger.warn("SMTP is not configured; password reset email logged instead", { to, resetUrl });
    return;
  }

  const from = env.SMTP_FROM || env.SMTP_USER || "noreply@erbs.local";

  try {
    await transport.sendMail({ from, to, subject, text, html });
    logger.info("Password reset email sent", { to });
  } catch (error) {
    logger.error("Failed to send password reset email", {
      to,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}
