import { Router } from "express";
import { asyncHandler } from "../../middleware";
import { healthController } from "./health.controller";

/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Health check
 *     description: Returns service status, uptime, and current timestamp.
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: ok
 *                     service:
 *                       type: string
 *                       example: erbs-backend
 *                     uptime:
 *                       type: number
 *                       example: 12.34
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-09-26T17:36:12.906Z
 */
const healthRoutes = Router();

healthRoutes.get(
  "/",
  asyncHandler(async (req, res) => {
    healthController.check(req, res);
  }),
);

export { healthRoutes };
