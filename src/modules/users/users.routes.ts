import { Router } from "express";
import { asyncHandler, requireAuth, validate } from "../../middleware";
import { usersController } from "./users.controller";
import { createUserSchema, updateUserSchema, userIdParamSchema, userListQuerySchema } from "./users.schema";

/**
 * @openapi
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Create a user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ada Lovelace
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ada@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 maxLength: 72
 *                 example: Password123!
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Validation failed
 *       409:
 *         description: Email already exists
 *   get:
 *     tags: [Users]
 *     summary: List users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Case-insensitive match on name or email
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, email, createdAt, updatedAt]
 *           default: createdAt
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Paginated users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 20
 *                     total:
 *                       type: integer
 *                       example: 100
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 * /users/profile:
 *   get:
 *     tags: [Users]
 *     summary: Authenticated user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Public profile of the authenticated user
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
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     name:
 *                       type: string
 *                       example: Ada Lovelace
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: ada@example.com
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Missing or invalid token
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 *   patch:
 *     tags: [Users]
 *     summary: Update a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: User updated
 *       404:
 *         description: User not found
 *       409:
 *         description: Email already exists
 *   delete:
 *     tags: [Users]
 *     summary: Delete a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
const usersRoutes = Router();

usersRoutes.use(requireAuth);

usersRoutes.post(
  "/",
  validate({ body: createUserSchema }),
  asyncHandler(async (req, res) => {
    await usersController.create(req, res);
  }),
);

usersRoutes.get(
  "/",
  validate({ query: userListQuerySchema }),
  asyncHandler(async (req, res) => {
    await usersController.list(req, res);
  }),
);

usersRoutes.get(
  "/profile",
  requireAuth,
  asyncHandler(async (req, res) => {
    await usersController.profile(req, res);
  }),
);

usersRoutes.get(
  "/:id",
  validate({ params: userIdParamSchema }),
  asyncHandler(async (req, res) => {
    await usersController.getById(req, res);
  }),
);

usersRoutes.patch(
  "/:id",
  validate({ params: userIdParamSchema, body: updateUserSchema }),
  asyncHandler(async (req, res) => {
    await usersController.update(req, res);
  }),
);

usersRoutes.delete(
  "/:id",
  validate({ params: userIdParamSchema }),
  asyncHandler(async (req, res) => {
    await usersController.remove(req, res);
  }),
);

export { usersRoutes };
