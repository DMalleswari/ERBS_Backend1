import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { env } from "../../config";

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
  options: "-c timezone=UTC",
});

export const prisma = new PrismaClient({ adapter });
