import { Router } from "express";
import { asyncHandler, requireAuth, validate } from "../../middleware";
import { notificationsController } from "./notifications.controller";
import { notificationIdParamSchema, notificationListQuerySchema } from "./notifications.schema";

/**
 * @openapi
 * /notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: List notifications for the current user
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
 *         name: isRead
 *         schema: { type: string, enum: ["true", "false"] }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc], default: desc }
 *     responses:
 *       200:
 *         description: Paginated notifications
 *       401:
 *         description: Unauthorized
 * /notifications/read-all:
 *   post:
 *     tags: [Notifications]
 *     summary: Mark all notifications as read
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: 2 notification(s) marked as read }
 *       401:
 *         description: Unauthorized
 * /notifications/{id}/read:
 *   patch:
 *     tags: [Notifications]
 *     summary: Mark one notification as read
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       404:
 *         description: Notification not found
 *       401:
 *         description: Unauthorized
 */
const notificationRoutes = Router();

notificationRoutes.use(requireAuth);

notificationRoutes.get(
  "/",
  validate({ query: notificationListQuerySchema }),
  asyncHandler(async (req, res) => {
    await notificationsController.list(req, res);
  }),
);

notificationRoutes.post(
  "/read-all",
  asyncHandler(async (req, res) => {
    await notificationsController.markAllRead(req, res);
  }),
);

notificationRoutes.patch(
  "/:id/read",
  validate({ params: notificationIdParamSchema }),
  asyncHandler(async (req, res) => {
    await notificationsController.markRead(req, res);
  }),
);

export { notificationRoutes };
