import { Router } from "express";
import { asyncHandler, requireAuth, validate } from "../../middleware";
import { resourcesController } from "./resources.controller";
import {
  createResourceSchema,
  resourceIdParamSchema,
  resourceListQuerySchema,
  updateResourceSchema,
} from "./resources.schema";

/**
 * @openapi
 * /resources:
 *   post:
 *     tags: [Resources]
 *     summary: Create a resource
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, resourceTypeId, capacity, location]
 *             properties:
 *               name: { type: string, example: Board Room A }
 *               description: { type: string }
 *               resourceTypeId: { type: string, format: uuid }
 *               capacity: { type: integer, example: 10 }
 *               location: { type: string, example: Floor 2 }
 *               isActive: { type: boolean }
 *     responses:
 *       201: { description: Resource created }
 *       404: { description: Resource type not found }
 *       401: { description: Unauthorized }
 *   get:
 *     tags: [Resources]
 *     summary: List resources
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: resourceTypeId
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: location
 *         schema: { type: string }
 *       - in: query
 *         name: isActive
 *         schema: { type: string, enum: ["true", "false"] }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [name, capacity, location, createdAt, updatedAt] }
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
 *       200: { description: Paginated resources }
 * /resources/{id}:
 *   get:
 *     tags: [Resources]
 *     summary: Get a resource
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Resource }
 *       404: { description: Not found }
 *   patch:
 *     tags: [Resources]
 *     summary: Update a resource
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Updated }
 *       404: { description: Not found }
 *   delete:
 *     tags: [Resources]
 *     summary: Delete a resource
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204: { description: Deleted }
 *       409: { description: Resource has bookings }
 */
const resourceRoutes = Router();
resourceRoutes.use(requireAuth);

resourceRoutes.post("/", validate({ body: createResourceSchema }), asyncHandler(async (req, res) => {
  await resourcesController.create(req, res);
}));
resourceRoutes.get("/", validate({ query: resourceListQuerySchema }), asyncHandler(async (req, res) => {
  await resourcesController.list(req, res);
}));
resourceRoutes.get("/:id", validate({ params: resourceIdParamSchema }), asyncHandler(async (req, res) => {
  await resourcesController.getById(req, res);
}));
resourceRoutes.patch("/:id", validate({ params: resourceIdParamSchema, body: updateResourceSchema }), asyncHandler(async (req, res) => {
  await resourcesController.update(req, res);
}));
resourceRoutes.delete("/:id", validate({ params: resourceIdParamSchema }), asyncHandler(async (req, res) => {
  await resourcesController.remove(req, res);
}));

export { resourceRoutes };
