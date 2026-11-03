import { prisma } from "../../infrastructure/database";

export class PrismaHealthRepository {
  async ping(): Promise<void> {
    await prisma.$queryRaw`SELECT 1`;
  }
}
