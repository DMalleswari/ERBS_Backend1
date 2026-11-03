import type { Request, Response } from "express";
import { sendPage } from "../../shared/http";
import { auditListQuerySchema } from "./audit-logs.schema";
import { auditLogService } from "./audit-logs.service";

export class AuditLogsController {
  async list(req: Request, res: Response): Promise<void> {
    const query = auditListQuerySchema.parse(req.query);
    const result = await auditLogService.list(query);
    sendPage(res, result.items, result.meta);
  }
}

export const auditLogsController = new AuditLogsController();
