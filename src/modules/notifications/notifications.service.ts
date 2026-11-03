import { logger } from "../../infrastructure/logger";
import { AppError } from "../../shared/errors";
import { pageMeta, pageSkip } from "../../shared/utils";
import { toNotificationDto } from "./notifications.mapper";
import { PrismaNotificationRepository, type CreateNotificationData } from "./notifications.repository";
import type { NotificationListQuery } from "./notifications.schema";

export class NotificationService {
  constructor(private readonly notifications = new PrismaNotificationRepository()) {}

  async notify(input: CreateNotificationData): Promise<void> {
    const notification = await this.notifications.create(input);
    logger.info("notification", { userId: notification.userId, title: notification.title });
  }

  async list(userId: string, query: NotificationListQuery) {
    const { items, total } = await this.notifications.list({
      userId,
      skip: pageSkip(query.page, query.limit),
      take: query.limit,
      sortBy: query.sortBy,
      order: query.order,
      ...(query.isRead !== undefined ? { isRead: query.isRead } : {}),
    });
    return { items: items.map(toNotificationDto), meta: pageMeta(query.page, query.limit, total) };
  }

  async markRead(userId: string, id: string) {
    const notification = await this.notifications.findById(id);
    if (!notification || notification.userId !== userId) {
      throw new AppError("Notification not found", 404);
    }
    return toNotificationDto(await this.notifications.markRead(id));
  }

  async markAllRead(userId: string): Promise<number> {
    return this.notifications.markAllRead(userId);
  }
}

export const notificationService = new NotificationService();
