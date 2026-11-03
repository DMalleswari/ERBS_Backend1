import { Prisma } from "@prisma/client";
import { AppError } from "../../shared/errors";

export function rethrowPrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const target = Array.isArray(error.meta?.target) ? error.meta.target.join(",") : "";
      if (target.toLowerCase().includes("email")) {
        throw new AppError("Email already exists", 409);
      }
      throw new AppError("Record already exists", 409);
    }
    if (error.code === "P2003") {
      throw new AppError("Record is in use", 409);
    }
    if (error.code === "P2025") {
      throw new AppError("Record not found", 404);
    }
  }

  throw error;
}
