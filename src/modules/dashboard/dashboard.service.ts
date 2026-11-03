import { PrismaDashboardRepository } from "./dashboard.repository";

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

function istDayRange(now = new Date()): { start: Date; end: Date } {
  const ist = new Date(now.getTime() + IST_OFFSET_MS);
  const startUtcMs = Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate()) - IST_OFFSET_MS;
  return {
    start: new Date(startUtcMs),
    end: new Date(startUtcMs + 24 * 60 * 60 * 1000),
  };
}

export class DashboardService {
  constructor(private readonly dashboard = new PrismaDashboardRepository()) {}

  async summary() {
    const day = istDayRange();
    return this.dashboard.summary(day.start, day.end);
  }
}

export const dashboardService = new DashboardService();
