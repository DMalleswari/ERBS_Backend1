import { Router } from "express";
import { asyncHandler, requireAuth, validate } from "../../middleware";
import { bookingsController } from "./bookings.controller";
import {
  bookingIdParamSchema,
  bookingListQuerySchema,
  bookingResourceParamSchema,
  createBookingSchema,
} from "./bookings.schema";

/**
 * @openapi
 * /bookings:
 *   post:
 *     tags: [Bookings]
 *     summary: Create a booking for the current user
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [resourceId, startTime, endTime]
 *             properties:
 *               resourceId: { type: string, format: uuid }
 *               startTime: { type: string, format: date-time, example: "2026-10-04T04:00:00.000Z" }
 *               endTime: { type: string, format: date-time, example: "2026-10-04T05:00:00.000Z" }
 *     responses:
 *       201: { description: Booking created }
 *       400: { description: Invalid time range }
 *       409: { description: Overlap or inactive resource }
 *   get:
 *     tags: [Bookings]
 *     summary: List bookings
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: resourceId
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [ACTIVE, CANCELLED] }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [startTime, endTime, createdAt, status] }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc] }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Paginated bookings }
 * /bookings/me:
 *   get:
 *     tags: [Bookings]
 *     summary: List bookings for the current user
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Paginated bookings }
 * /bookings/resource/{resourceId}:
 *   get:
 *     tags: [Bookings]
 *     summary: List bookings for a resource
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: resourceId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Paginated bookings }
 *       404: { description: Resource not found }
 * /bookings/{id}:
 *   get:
 *     tags: [Bookings]
 *     summary: Get a booking
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Booking }
 *       404: { description: Not found }
 * /bookings/{id}/cancel:
 *   post:
 *     tags: [Bookings]
 *     summary: Cancel a booking
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Booking cancelled }
 *       403: { description: Not the booking owner }
 *       409: { description: Already cancelled }
 */
const bookingRoutes = Router();
bookingRoutes.use(requireAuth);

bookingRoutes.post("/", validate({ body: createBookingSchema }), asyncHandler(async (req, res) => {
  await bookingsController.create(req, res);
}));
bookingRoutes.get("/", validate({ query: bookingListQuerySchema }), asyncHandler(async (req, res) => {
  await bookingsController.list(req, res);
}));
bookingRoutes.get("/me", validate({ query: bookingListQuerySchema }), asyncHandler(async (req, res) => {
  await bookingsController.mine(req, res);
}));
bookingRoutes.get("/resource/:resourceId", validate({ params: bookingResourceParamSchema, query: bookingListQuerySchema }), asyncHandler(async (req, res) => {
  await bookingsController.forResource(req, res);
}));
bookingRoutes.get("/:id", validate({ params: bookingIdParamSchema }), asyncHandler(async (req, res) => {
  await bookingsController.getById(req, res);
}));
bookingRoutes.post("/:id/cancel", validate({ params: bookingIdParamSchema }), asyncHandler(async (req, res) => {
  await bookingsController.cancel(req, res);
}));

export { bookingRoutes };
