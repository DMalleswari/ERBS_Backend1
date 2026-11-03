import { Prisma } from "@prisma/client";
import { prisma, rethrowPrismaError } from "../../infrastructure/database";
import type { BookingListQuery } from "./bookings.schema";
import type { BookingRecord } from "./bookings.types";

export type BookingFilters = {
  skip: number;
  take: number;
  userId?: string;
  resourceId?: string;
  status?: BookingRecord["status"];
  sortBy: BookingListQuery["sortBy"];
  order: BookingListQuery["order"];
};

export class PrismaBookingRepository {
  async create(input: {
    userId: string;
    resourceId: string;
    startTime: Date;
    endTime: Date;
  }): Promise<BookingRecord> {
    return prisma.booking.create({ data: input });
  }

  async list(filters: BookingFilters): Promise<{ items: BookingRecord[]; total: number }> {
    const where: Prisma.BookingWhereInput = {
      ...(filters.userId ? { userId: filters.userId } : {}),
      ...(filters.resourceId ? { resourceId: filters.resourceId } : {}),
      ...(filters.status ? { status: filters.status } : {}),
    };
    const orderBy: Prisma.BookingOrderByWithRelationInput = { [filters.sortBy]: filters.order };
    const [items, total] = await prisma.$transaction([
      prisma.booking.findMany({ where, skip: filters.skip, take: filters.take, orderBy }),
      prisma.booking.count({ where }),
    ]);
    return { items, total };
  }

  async findById(id: string): Promise<BookingRecord | null> {
    return prisma.booking.findUnique({ where: { id } });
  }

  async findOverlapping(resourceId: string, startTime: Date, endTime: Date): Promise<BookingRecord[]> {
    return prisma.booking.findMany({
      where: {
        resourceId,
        status: "ACTIVE",
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
      orderBy: { startTime: "asc" },
    });
  }

  async cancel(id: string): Promise<BookingRecord> {
    try {
      return await prisma.booking.update({
        where: { id },
        data: { status: "CANCELLED" },
      });
    } catch (error) {
      rethrowPrismaError(error);
    }
  }

  async countAll(): Promise<number> {
    return prisma.booking.count();
  }

  async countOverlappingRange(startTime: Date, endTime: Date): Promise<number> {
    return prisma.booking.count({
      where: {
        status: "ACTIVE",
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    });
  }
}
