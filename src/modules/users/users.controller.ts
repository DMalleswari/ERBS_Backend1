import type { Request, Response } from "express";
import { AppError } from "../../shared/errors";
import { sendData, sendPage } from "../../shared/http";
import { createUserSchema, updateUserSchema, userIdParamSchema, userListQuerySchema } from "./users.schema";
import { usersService } from "./users.service";

export class UsersController {
  async create(req: Request, res: Response): Promise<void> {
    const body = createUserSchema.parse(req.body);
    const data = await usersService.create(body);
    sendData(res, data, 201);
  }

  async list(req: Request, res: Response): Promise<void> {
    const query = userListQuerySchema.parse(req.query);
    const result = await usersService.list(query);
    sendPage(res, result.items, result.meta);
  }

  async profile(req: Request, res: Response): Promise<void> {
    if (!req.auth) {
      throw new AppError("Unauthorized", 401);
    }
    const data = await usersService.getById(req.auth.id);
    sendData(res, data);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const params = userIdParamSchema.parse(req.params);
    const data = await usersService.getById(params.id);
    sendData(res, data);
  }

  async update(req: Request, res: Response): Promise<void> {
    const params = userIdParamSchema.parse(req.params);
    const body = updateUserSchema.parse(req.body);
    const data = await usersService.update(params.id, body);
    sendData(res, data);
  }

  async remove(req: Request, res: Response): Promise<void> {
    const params = userIdParamSchema.parse(req.params);
    await usersService.remove(params.id);
    res.status(204).send();
  }
}

export const usersController = new UsersController();
