import { AppError } from "../../shared/errors";
import { PrismaBookingRepository } from "../bookings/bookings.repository";
import { PrismaResourceRepository } from "../resources/resources.repository";
import type { AvailabilityQuery } from "./availability.schema";

export type TimeSlot = {
  startTime: string;
  endTime: string;
};

export class AvailabilityService {
  constructor(
    private readonly resources = new PrismaResourceRepository(),
    private readonly bookings = new PrismaBookingRepository(),
  ) {}

  async forResource(resourceId: string, query: AvailabilityQuery) {
    const resource = await this.resources.findById(resourceId);
    if (!resource) {
      throw new AppError("Resource not found", 404);
    }

    const booked = await this.bookings.findOverlapping(resourceId, query.from, query.to);
    const bookedSlots: TimeSlot[] = booked.map((booking) => ({
      startTime: new Date(Math.max(booking.startTime.getTime(), query.from.getTime())).toISOString(),
      endTime: new Date(Math.min(booking.endTime.getTime(), query.to.getTime())).toISOString(),
    }));

    const availableSlots: TimeSlot[] = [];
    let cursor = query.from.getTime();
    const rangeEnd = query.to.getTime();
    for (const slot of bookedSlots) {
      const slotStart = new Date(slot.startTime).getTime();
      const slotEnd = new Date(slot.endTime).getTime();
      if (cursor < slotStart) {
        availableSlots.push({
          startTime: new Date(cursor).toISOString(),
          endTime: new Date(slotStart).toISOString(),
        });
      }
      if (slotEnd > cursor) {
        cursor = slotEnd;
      }
    }
    if (cursor < rangeEnd) {
      availableSlots.push({
        startTime: new Date(cursor).toISOString(),
        endTime: new Date(rangeEnd).toISOString(),
      });
    }

    return {
      resourceId,
      from: query.from.toISOString(),
      to: query.to.toISOString(),
      bookedSlots,
      availableSlots,
    };
  }
}

export const availabilityService = new AvailabilityService();
