import { AppError } from "../../shared/errors";
import { pageMeta, pageSkip } from "../../shared/utils";
import { auditLogService } from "../audit-logs/audit-logs.service";
import { notificationService } from "../notifications/notifications.service";
import { PrismaResourceRepository } from "../resources/resources.repository";
import { PrismaUserRepository } from "../users/users.repository";
import { toBookingDto } from "./bookings.mapper";
import { PrismaBookingRepository } from "./bookings.repository";
import type { BookingListQuery, CreateBookingInput } from "./bookings.schema";

export class BookingService {
  constructor(
    private readonly bookings = new PrismaBookingRepository(),
    private readonly resources = new PrismaResourceRepository(),
    private readonly users = new PrismaUserRepository(),
  ) {}

  async create(userId: string, input: CreateBookingInput) {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    const resource = await this.resources.findById(input.resourceId);
    if (!resource) {
      throw new AppError("Resource not found", 404);
    }
    if (!resource.isActive) {
      throw new AppError("Resource is not active", 409);
    }
    if (input.startTime >= input.endTime) {
      throw new AppError("Start time must be before end time", 400);
    }
    if (input.startTime.getTime() < Date.now()) {
      throw new AppError("Past bookings are not allowed", 400);
    }
    const overlaps = await this.bookings.findOverlapping(input.resourceId, input.startTime, input.endTime);
    if (overlaps.length > 0) {
      throw new AppError("Resource is already booked for that time", 409);
    }

    const created = await this.bookings.create({
      userId,
      resourceId: input.resourceId,
      startTime: input.startTime,
      endTime: input.endTime,
    });
    await auditLogService.record({
      actorId: userId,
      action: "BOOKING_CREATED",
      entity: "Booking",
      entityId: created.id,
    });
    await notificationService.notify({
      userId,
      title: "Booking created",
      message: `${resource.name} is booked from ${created.startTime.toISOString()} to ${created.endTime.toISOString()}.`,
    });
    return toBookingDto(created);
  }

  async getById(id: string) {
    const booking = await this.bookings.findById(id);
    if (!booking) {
      throw new AppError("Booking not found", 404);
    }
    return toBookingDto(booking);
  }

  async list(query: BookingListQuery) {
    const { items, total } = await this.bookings.list({
      skip: pageSkip(query.page, query.limit),
      take: query.limit,
      sortBy: query.sortBy,
      order: query.order,
      ...(query.userId ? { userId: query.userId } : {}),
      ...(query.resourceId ? { resourceId: query.resourceId } : {}),
      ...(query.status ? { status: query.status } : {}),
    });
    return { items: items.map(toBookingDto), meta: pageMeta(query.page, query.limit, total) };
  }

  async listForUser(userId: string, query: BookingListQuery) {
    return this.list({ ...query, userId });
  }

  async listForResource(resourceId: string, query: BookingListQuery) {
    const resource = await this.resources.findById(resourceId);
    if (!resource) {
      throw new AppError("Resource not found", 404);
    }
    return this.list({ ...query, resourceId });
  }

  async cancel(id: string, actorId: string) {
    const booking = await this.bookings.findById(id);
    if (!booking) {
      throw new AppError("Booking not found", 404);
    }
    if (booking.userId !== actorId) {
      throw new AppError("You can only cancel your own booking", 403);
    }
    if (booking.status === "CANCELLED") {
      throw new AppError("Booking is already cancelled", 409);
    }
    const cancelled = await this.bookings.cancel(id);
    await auditLogService.record({
      actorId,
      action: "BOOKING_CANCELLED",
      entity: "Booking",
      entityId: id,
    });
    await notificationService.notify({
      userId: actorId,
      title: "Booking cancelled",
      message: `Booking ${id} was cancelled.`,
    });
    return toBookingDto(cancelled);
  }
}

export const bookingService = new BookingService();
