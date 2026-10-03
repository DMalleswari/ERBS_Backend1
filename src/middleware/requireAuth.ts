import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../infrastructure/security";
import { AppError } from "../shared/errors";

export type AuthContext = {
  id: string;
  email: string;
};

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    next(new AppError("Unauthorized", 401));
    return;
  }

  try {
    const payload = verifyAccessToken(header.slice("Bearer ".length).trim());
    req.auth = { id: payload.sub, email: payload.email };
    next();
  } catch {
    next(new AppError("Unauthorized", 401));
  }
}
