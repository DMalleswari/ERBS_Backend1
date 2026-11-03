import { Router } from "express";
import { asyncHandler, requireAuth } from "../../middleware";
import { dashboardController } from "./dashboard.controller";

/**
 * @openapi
 * /dashboard/summary:
 *   get:
 *     tags: [Dashboard]
 *     summary: Booking system totals
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Summary counts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsers: { type: integer, example: 12 }
 *                     totalResources: { type: integer, example: 8 }
 *                     totalBookings: { type: integer, example: 20 }
 *                     activeResources: { type: integer, example: 7 }
 *                     todaysBookings: { type: integer, example: 3 }
 *       401: { description: Unauthorized }
 */
const dashboardRoutes = Router();
dashboardRoutes.use(requireAuth);

dashboardRoutes.get(
  "/summary",
  asyncHandler(async (req, res) => {
    await dashboardController.summary(req, res);
  }),
);

export { dashboardRoutes };
