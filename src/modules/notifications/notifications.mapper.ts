import type { NotificationDto, NotificationRecord } from "./notifications.types";

export function toNotificationDto(notification: NotificationRecord): NotificationDto {
  return {
    id: notification.id,
    userId: notification.userId,
    title: notification.title,
    message: notification.message,
    isRead: notification.isRead,
    createdAt: notification.createdAt.toISOString(),
  };
}
