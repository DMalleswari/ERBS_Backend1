import type { Response } from "express";
import type { PageMeta } from "../utils";

export function sendData(res: Response, data: unknown, statusCode = 200): void {
  res.status(statusCode).json({
    success: true,
    data,
  });
}

export function sendMessage(res: Response, message: string, statusCode = 200): void {
  res.status(statusCode).json({
    success: true,
    message,
  });
}

export function sendPage(res: Response, data: unknown, meta: PageMeta): void {
  res.status(200).json({
    success: true,
    data,
    meta,
  });
}
