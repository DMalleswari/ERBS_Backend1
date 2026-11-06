import { createHash, randomBytes } from "crypto";
import { env } from "../../config";
import { sendPasswordResetEmail } from "../../infrastructure/email";
import { hashPassword, signAccessToken, verifyPassword } from "../../infrastructure/security";
import { logger } from "../../infrastructure/logger";
import { AppError } from "../../shared/errors";
import { auditLogService } from "../audit-logs/audit-logs.service";
import { notificationService } from "../notifications/notifications.service";
import { toUserDto } from "../users/users.mapper";
import { PrismaUserRepository } from "../users/users.repository";
import { usersService } from "../users/users.service";
import type {
  ChangePasswordInput,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from "./auth.schema";
import type { UserDto } from "../users/users.types";

export type AuthResult = {
  token: string;
  user: UserDto;
};

const FORGOT_PASSWORD_MESSAGE =
  "If an account exists for that email, we've sent password reset instructions.";

function hashResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export class AuthService {
  constructor(private readonly users = new PrismaUserRepository()) {}

  async register(input: RegisterInput): Promise<AuthResult> {
    const user = await usersService.create(input);
    return {
      token: signAccessToken({ sub: user.id, email: user.email }),
      user,
    };
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const account = await this.users.findAuthByEmail(input.email);
    const passwordMatches = account ? await verifyPassword(input.password, account.passwordHash) : false;

    if (!account || !passwordMatches) {
      throw new AppError("Invalid email or password", 401);
    }

    const user = toUserDto(account);
    return {
      token: signAccessToken({ sub: user.id, email: user.email }),
      user,
    };
  }

  async changePassword(userId: string, input: ChangePasswordInput): Promise<string> {
    const account = await this.users.findAuthById(userId);
    if (!account) {
      throw new AppError("Unauthorized", 401);
    }

    const passwordMatches = await verifyPassword(input.currentPassword, account.passwordHash);
    if (!passwordMatches) {
      throw new AppError("Current password is incorrect", 401);
    }

    const passwordHash = await hashPassword(input.newPassword);
    await this.users.updatePassword(userId, passwordHash);
    await auditLogService.record({
      actorId: userId,
      action: "PASSWORD_CHANGED",
      entity: "User",
      entityId: userId,
    });
    await notificationService.notify({
      userId,
      title: "Password changed",
      message: "Your password was changed.",
    });
    return "Password changed successfully";
  }

  async forgotPassword(input: ForgotPasswordInput): Promise<string> {
    const account = await this.users.findAuthByEmail(input.email);
    if (!account) {
      return FORGOT_PASSWORD_MESSAGE;
    }

    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = hashResetToken(rawToken);
    const expiresAt = new Date(Date.now() + env.PASSWORD_RESET_EXPIRES_MINUTES * 60_000);

    await this.users.setPasswordResetToken(account.id, tokenHash, expiresAt);

    const resetUrl = `${env.FRONTEND_URL.replace(/\/$/, "")}/reset-password?token=${rawToken}`;

    try {
      await sendPasswordResetEmail(account.email, resetUrl);
    } catch (error) {
      logger.error("Password reset email delivery failed", {
        userId: account.id,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return FORGOT_PASSWORD_MESSAGE;
  }

  async resetPassword(input: ResetPasswordInput): Promise<string> {
    const tokenHash = hashResetToken(input.token);
    const account = await this.users.findByPasswordResetToken(tokenHash);

    if (!account?.passwordResetExpires || account.passwordResetExpires.getTime() < Date.now()) {
      throw new AppError("Reset link is invalid or has expired", 400);
    }

    const passwordHash = await hashPassword(input.newPassword);
    await this.users.resetPassword(account.id, passwordHash);
    await auditLogService.record({
      actorId: account.id,
      action: "PASSWORD_CHANGED",
      entity: "User",
      entityId: account.id,
    });
    await notificationService.notify({
      userId: account.id,
      title: "Password changed",
      message: "Your password was reset successfully.",
    });

    return "Password reset successfully. You can sign in with your new password.";
  }

  logout(): string {
    return "Logged out successfully";
  }
}

export const authService = new AuthService();
