import { env } from "../../config";
import { PrismaHealthRepository } from "./health.repository";

export type HealthStatus = {
  status: "ok" | "degraded";
  service: string;
  database: "up" | "down";
  environment: string;
  uptime: number;
  timestamp: string;
};

export class HealthService {
  constructor(private readonly health = new PrismaHealthRepository()) {}

  async getStatus(): Promise<HealthStatus> {
    let database: HealthStatus["database"] = "up";
    try {
      await this.health.ping();
    } catch {
      database = "down";
    }

    return {
      status: database === "up" ? "ok" : "degraded",
      service: "erbs-backend",
      database,
      environment: env.NODE_ENV,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}

export const healthService = new HealthService();
