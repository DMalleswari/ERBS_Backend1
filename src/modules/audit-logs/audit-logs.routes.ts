import { Router } from "express";
import { asyncHandler, requireAuth, validate } from "../../middleware";
import { auditLogsController } from "./audit-logs.controller";
import { auditListQuerySchema } from "./audit-logs.schema";

/**
 * @openapi
 * /audit-logs:
 *   get:
 *     tags: [AuditLogs]
 *     summary: List audit logs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: action
 *         schema: { type: string, example: BOOKING_CREATED }
 *       - in: query
 *         name: entity
 *         schema: { type: string, example: Booking }
 *       - in: query
 *         name: actorId
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [createdAt, action, entity], default: createdAt }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc], default: desc }
 *     responses:
 *       200:
 *         description: Paginated audit logs
 *       401:
 *         description: Unauthorized
 */
const auditLogRoutes = Router();

auditLogRoutes.use(requireAuth);

auditLogRoutes.get(
  "/",
  validate({ query: auditListQuerySchema }),
  asyncHandler(async (req, res) => {
    await auditLogsController.list(req, res);
  }),
);

export { auditLogRoutes };
