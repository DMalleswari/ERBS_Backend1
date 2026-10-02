import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { env } from "../config";
import { logger } from "../infrastructure/logger";
import { AppError } from "../shared/errors";
import { formatZodError } from "../shared/validators";

type ErrorBody = {
  success: false;
  message: string;
  errors?: unknown;
};

function sendError(res: Response, statusCode: number, message: string, errors?: unknown): void {
  const body: ErrorBody = {
    success: false,
    message,
  };

  if (errors !== undefined) {
    body.errors = errors;
  }

  res.status(statusCode).json(body);
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    logger.warn(err.message, {
      statusCode: err.statusCode,
      method: req.method,
      path: req.originalUrl,
    });
    sendError(res, err.statusCode, err.message, err.details);
    return;
  }

  if (err instanceof ZodError) {
    logger.warn("Validation failed", {
      method: req.method,
      path: req.originalUrl,
    });
    sendError(res, 400, "Validation failed", formatZodError(err));
    return;
  }

  if (err instanceof SyntaxError && "status" in err && err.status === 400) {
    sendError(res, 400, "Invalid JSON body");
    return;
  }

  const message = err instanceof Error ? err.message : "Unknown error";
  logger.error("Unhandled error", {
    message,
    method: req.method,
    path: req.originalUrl,
    stack: err instanceof Error ? err.stack : undefined,
  });

  sendError(
    res,
    500,
    env.NODE_ENV === "production" ? "Internal server error" : message,
  );
}
