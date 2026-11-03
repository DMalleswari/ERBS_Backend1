import { Prisma } from "@prisma/client";
import { prisma, rethrowPrismaError } from "../../infrastructure/database";
import type { NotificationListQuery } from "./notifications.schema";
import type { NotificationRecord } from "./notifications.types";

export type CreateNotificationData = {
  userId: string;
  title: string;
  message: string;
};

export type NotificationFilters = {
  userId: string;
  skip: number;
  take: number;
  isRead?: boolean;
  sortBy: NotificationListQuery["sortBy"];
  order: NotificationListQuery["order"];
};

export class PrismaNotificationRepository {
  async create(input: CreateNotificationData): Promise<NotificationRecord> {
    return prisma.notification.create({ data: input });
  }

  async list(filters: NotificationFilters): Promise<{ items: NotificationRecord[]; total: number }> {
    const where: Prisma.NotificationWhereInput = {
      userId: filters.userId,
      ...(filters.isRead !== undefined ? { isRead: filters.isRead } : {}),
    };
    const orderBy: Prisma.NotificationOrderByWithRelationInput = { [filters.sortBy]: filters.order };
    const [items, total] = await prisma.$transaction([
      prisma.notification.findMany({
        where,
        skip: filters.skip,
        take: filters.take,
        orderBy,
      }),
      prisma.notification.count({ where }),
    ]);
    return { items, total };
  }

  async findById(id: string): Promise<NotificationRecord | null> {
    return prisma.notification.findUnique({ where: { id } });
  }

  async markRead(id: string): Promise<NotificationRecord> {
    try {
      return await prisma.notification.update({
        where: { id },
        data: { isRead: true },
      });
    } catch (error) {
      rethrowPrismaError(error);
    }
  }

  async markAllRead(userId: string): Promise<number> {
    const result = await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return result.count;
  }
}
