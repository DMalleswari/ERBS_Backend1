import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { AppError } from "../shared/errors";
import { formatZodError } from "../shared/validators/zod";

type RequestSchemas = {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
};

function parseSection(schema: ZodType, value: unknown, label: string): unknown {
  const result = schema.safeParse(value);
  if (!result.success) {
    throw new AppError(`${label} validation failed`, 400, formatZodError(result.error));
  }
  return result.data;
}

function replaceRequestValue(req: Request, key: "query" | "params", value: unknown): void {
  Object.defineProperty(req, key, {
    value,
    writable: true,
    configurable: true,
    enumerable: true,
  });
}

export function validate(schemas: RequestSchemas) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        req.body = parseSection(schemas.body, req.body, "Body");
      }
      if (schemas.query) {
        replaceRequestValue(req, "query", parseSection(schemas.query, req.query, "Query"));
      }
      if (schemas.params) {
        replaceRequestValue(req, "params", parseSection(schemas.params, req.params, "Params"));
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
