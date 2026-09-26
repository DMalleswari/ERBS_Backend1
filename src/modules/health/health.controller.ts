import type { Request, Response } from "express";
import { healthService } from "./health.service";

export class HealthController {
  check(_req: Request, res: Response): void {
    const data = healthService.getStatus();
    res.status(200).json({
      success: true,
      data,
    });
  }
}

export const healthController = new HealthController();
