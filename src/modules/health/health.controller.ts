import type { Request, Response } from "express";
import { healthService } from "./health.service";

export class HealthController {
  async check(_req: Request, res: Response): Promise<void> {
    const data = await healthService.getStatus();
    res.status(data.status === "ok" ? 200 : 503).json({
      success: data.status === "ok",
      data,
    });
  }
}

export const healthController = new HealthController();
