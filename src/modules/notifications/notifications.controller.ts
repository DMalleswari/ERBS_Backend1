import type { Request, Response } from "express";
import { AppError } from "../../shared/errors";
import { sendData, sendMessage, sendPage } from "../../shared/http";
import { notificationIdParamSchema, notificationListQuerySchema } from "./notifications.schema";
import { notificationService } from "./notifications.service";

export class NotificationsController {
  async list(req: Request, res: Response): Promise<void> {
    if (!req.auth) {
      throw new AppError("Unauthorized", 401);
    }
    const query = notificationListQuerySchema.parse(req.query);
    const result = await notificationService.list(req.auth.id, query);
    sendPage(res, result.items, result.meta);
  }

  async markRead(req: Request, res: Response): Promise<void> {
    if (!req.auth) {
      throw new AppError("Unauthorized", 401);
    }
    const params = notificationIdParamSchema.parse(req.params);
    const data = await notificationService.markRead(req.auth.id, params.id);
    sendData(res, data);
  }

  async markAllRead(req: Request, res: Response): Promise<void> {
    if (!req.auth) {
      throw new AppError("Unauthorized", 401);
    }
    const updated = await notificationService.markAllRead(req.auth.id);
    sendMessage(res, `${updated} notification(s) marked as read`);
  }
}

export const notificationsController = new NotificationsController();
