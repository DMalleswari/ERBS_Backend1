import { Prisma } from "@prisma/client";
import { AppError } from "../../shared/errors";

export function rethrowPrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      throw new AppError("Email already exists", 409);
    }
    if (error.code === "P2025") {
      throw new AppError("User not found", 404);
    }
  }

  throw error;
}
