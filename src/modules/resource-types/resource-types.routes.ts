import { Router } from "express";
import { asyncHandler, requireAuth, validate } from "../../middleware";
import { resourceTypesController } from "./resource-types.controller";
import {
  createResourceTypeSchema,
  resourceTypeIdParamSchema,
  resourceTypeListQuerySchema,
  updateResourceTypeSchema,
} from "./resource-types.schema";

/**
 * @openapi
 * /resource-types:
 *   post:
 *     tags: [ResourceTypes]
 *     summary: Create a resource type
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, name]
 *             properties:
 *               code: { type: string, example: ROOM }
 *               name: { type: string, example: Meeting Room }
 *               description: { type: string }
 *               isActive: { type: boolean, example: true }
 *     responses:
 *       201: { description: Resource type created }
 *       409: { description: Code already exists }
 *       401: { description: Unauthorized }
 *   get:
 *     tags: [ResourceTypes]
 *     summary: List resource types
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: isActive
 *         schema: { type: string, enum: ["true", "false"] }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [name, code, createdAt, updatedAt], default: name }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc], default: asc }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200: { description: Paginated resource types }
 *       401: { description: Unauthorized }
 * /resource-types/{id}:
 *   get:
 *     tags: [ResourceTypes]
 *     summary: Get a resource type
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Resource type }
 *       404: { description: Not found }
 *   patch:
 *     tags: [ResourceTypes]
 *     summary: Update a resource type
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code: { type: string }
 *               name: { type: string }
 *               description: { type: string, nullable: true }
 *               isActive: { type: boolean }
 *     responses:
 *       200: { description: Updated }
 *       404: { description: Not found }
 *   delete:
 *     tags: [ResourceTypes]
 *     summary: Delete a resource type
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204: { description: Deleted }
 *       409: { description: Type is in use }
 *       404: { description: Not found }
 */
const resourceTypeRoutes = Router();
resourceTypeRoutes.use(requireAuth);

resourceTypeRoutes.post("/", validate({ body: createResourceTypeSchema }), asyncHandler(async (req, res) => {
  await resourceTypesController.create(req, res);
}));
resourceTypeRoutes.get("/", validate({ query: resourceTypeListQuerySchema }), asyncHandler(async (req, res) => {
  await resourceTypesController.list(req, res);
}));
resourceTypeRoutes.get("/:id", validate({ params: resourceTypeIdParamSchema }), asyncHandler(async (req, res) => {
  await resourceTypesController.getById(req, res);
}));
resourceTypeRoutes.patch("/:id", validate({ params: resourceTypeIdParamSchema, body: updateResourceTypeSchema }), asyncHandler(async (req, res) => {
  await resourceTypesController.update(req, res);
}));
resourceTypeRoutes.delete("/:id", validate({ params: resourceTypeIdParamSchema }), asyncHandler(async (req, res) => {
  await resourceTypesController.remove(req, res);
}));

export { resourceTypeRoutes };
