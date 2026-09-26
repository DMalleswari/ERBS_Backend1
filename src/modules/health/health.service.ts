export type HealthStatus = {
  status: "ok";
  service: string;
  uptime: number;
  timestamp: string;
};

export class HealthService {
  getStatus(): HealthStatus {
    return {
      status: "ok",
      service: "erbs-backend",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}

export const healthService = new HealthService();
