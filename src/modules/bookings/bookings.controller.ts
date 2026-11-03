import type { Request, Response } from "express";
import { AppError } from "../../shared/errors";
import { sendData, sendPage } from "../../shared/http";
import {
  bookingIdParamSchema,
  bookingListQuerySchema,
  bookingResourceParamSchema,
  createBookingSchema,
} from "./bookings.schema";
import { bookingService } from "./bookings.service";

function actorId(req: Request): string {
  if (!req.auth) {
    throw new AppError("Unauthorized", 401);
  }
  return req.auth.id;
}

export class BookingsController {
  async create(req: Request, res: Response): Promise<void> {
    const body = createBookingSchema.parse(req.body);
    sendData(res, await bookingService.create(actorId(req), body), 201);
  }

  async list(req: Request, res: Response): Promise<void> {
    const query = bookingListQuerySchema.parse(req.query);
    const result = await bookingService.list(query);
    sendPage(res, result.items, result.meta);
  }

  async mine(req: Request, res: Response): Promise<void> {
    const query = bookingListQuerySchema.parse(req.query);
    const result = await bookingService.listForUser(actorId(req), query);
    sendPage(res, result.items, result.meta);
  }

  async forResource(req: Request, res: Response): Promise<void> {
    const params = bookingResourceParamSchema.parse(req.params);
    const query = bookingListQuerySchema.parse(req.query);
    const result = await bookingService.listForResource(params.resourceId, query);
    sendPage(res, result.items, result.meta);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const params = bookingIdParamSchema.parse(req.params);
    sendData(res, await bookingService.getById(params.id));
  }

  async cancel(req: Request, res: Response): Promise<void> {
    const params = bookingIdParamSchema.parse(req.params);
    sendData(res, await bookingService.cancel(params.id, actorId(req)));
  }
}

export const bookingsController = new BookingsController();
