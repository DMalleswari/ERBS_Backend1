import { Router } from "express";
import { asyncHandler, requireAuth, validate } from "../../middleware";
import { availabilityController } from "./availability.controller";
import { availabilityParamSchema, availabilityQuerySchema } from "./availability.schema";

/**
 * @openapi
 * /availability/resource/{resourceId}:
 *   get:
 *     tags: [Availability]
 *     summary: Booked and available slots for a resource
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: resourceId
 *         required: true
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: from
 *         required: true
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: to
 *         required: true
 *         schema: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: Booked and available slots
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     resourceId: { type: string, format: uuid }
 *                     from: { type: string, format: date-time }
 *                     to: { type: string, format: date-time }
 *                     bookedSlots:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           startTime: { type: string, format: date-time }
 *                           endTime: { type: string, format: date-time }
 *                     availableSlots:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           startTime: { type: string, format: date-time }
 *                           endTime: { type: string, format: date-time }
 *       400: { description: Invalid date range }
 *       404: { description: Resource not found }
 *       401: { description: Unauthorized }
 */
const availabilityRoutes = Router();
availabilityRoutes.use(requireAuth);

availabilityRoutes.get(
  "/resource/:resourceId",
  validate({ params: availabilityParamSchema, query: availabilityQuerySchema }),
  asyncHandler(async (req, res) => {
    await availabilityController.forResource(req, res);
  }),
);

export { availabilityRoutes };
