import type { Request, Response } from "express";
import { sendData } from "../../shared/http";
import { dashboardService } from "./dashboard.service";

export class DashboardController {
  async summary(_req: Request, res: Response): Promise<void> {
    sendData(res, await dashboardService.summary());
  }
}

export const dashboardController = new DashboardController();
