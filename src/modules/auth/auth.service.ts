import { hashPassword, signAccessToken, verifyPassword } from "../../infrastructure/security";
import { AppError } from "../../shared/errors";
import { toUserDto } from "../users/users.mapper";
import { PrismaUserRepository } from "../users/users.repository";
import { usersService } from "../users/users.service";
import type { ChangePasswordInput, LoginInput, RegisterInput } from "./auth.schema";
import type { UserDto } from "../users/users.types";

export type AuthResult = {
  token: string;
  user: UserDto;
};

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
    return "Password changed successfully";
  }

  logout(): string {
    return "Logged out successfully";
  }
}

export const authService = new AuthService();
