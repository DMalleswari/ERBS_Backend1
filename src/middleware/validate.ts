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

export function validate(schemas: RequestSchemas) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        req.body = parseSection(schemas.body, req.body, "Body");
      }
      if (schemas.query) {
        req.query = parseSection(schemas.query, req.query, "Query") as Request["query"];
      }
      if (schemas.params) {
        req.params = parseSection(schemas.params, req.params, "Params") as Request["params"];
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
