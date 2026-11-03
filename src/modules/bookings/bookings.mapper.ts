import type { BookingDto, BookingRecord } from "./bookings.types";

export function toBookingDto(booking: BookingRecord): BookingDto {
  return {
    id: booking.id,
    userId: booking.userId,
    resourceId: booking.resourceId,
    startTime: booking.startTime.toISOString(),
    endTime: booking.endTime.toISOString(),
    status: booking.status,
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
  };
}
