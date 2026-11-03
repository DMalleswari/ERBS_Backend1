import type { Request, Response } from "express";
import { sendData } from "../../shared/http";
import { availabilityParamSchema, availabilityQuerySchema } from "./availability.schema";
import { availabilityService } from "./availability.service";

export class AvailabilityController {
  async forResource(req: Request, res: Response): Promise<void> {
    const params = availabilityParamSchema.parse(req.params);
    const query = availabilityQuerySchema.parse(req.query);
    sendData(res, await availabilityService.forResource(params.resourceId, query));
  }
}

export const availabilityController = new AvailabilityController();
