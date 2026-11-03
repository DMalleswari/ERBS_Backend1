import { prisma } from "../../infrastructure/database";

export class PrismaDashboardRepository {
  async summary(dayStart: Date, dayEnd: Date) {
    const [totalUsers, totalResources, totalBookings, activeResources, todaysBookings] = await prisma.$transaction([
      prisma.user.count(),
      prisma.resource.count(),
      prisma.booking.count(),
      prisma.resource.count({ where: { isActive: true } }),
      prisma.booking.count({
        where: {
          status: "ACTIVE",
          startTime: { lt: dayEnd },
          endTime: { gt: dayStart },
        },
      }),
    ]);
    return { totalUsers, totalResources, totalBookings, activeResources, todaysBookings };
  }
}
