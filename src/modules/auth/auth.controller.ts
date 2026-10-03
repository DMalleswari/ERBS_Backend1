import type { Request, Response } from "express";
import { sendData, sendMessage } from "../../shared/http";
import { AppError } from "../../shared/errors";
import { usersService } from "../users/users.service";
import { changePasswordSchema, loginSchema, registerSchema } from "./auth.schema";
import { authService } from "./auth.service";

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    const body = registerSchema.parse(req.body);
    const data = await authService.register(body);
    sendData(res, data, 201);
  }

  async login(req: Request, res: Response): Promise<void> {
    const body = loginSchema.parse(req.body);
    const data = await authService.login(body);
    sendData(res, data);
  }

  async me(req: Request, res: Response): Promise<void> {
    if (!req.auth) {
      throw new AppError("Unauthorized", 401);
    }
    const data = await usersService.getById(req.auth.id);
    sendData(res, data);
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    if (!req.auth) {
      throw new AppError("Unauthorized", 401);
    }
    const body = changePasswordSchema.parse(req.body);
    const message = await authService.changePassword(req.auth.id, body);
    sendMessage(res, message);
  }

  logout(_req: Request, res: Response): void {
    sendMessage(res, authService.logout());
  }
}

export const authController = new AuthController();
