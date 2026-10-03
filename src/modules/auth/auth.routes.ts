import { Router } from "express";
import { asyncHandler, requireAuth, validate } from "../../middleware";
import { authController } from "./auth.controller";
import { changePasswordSchema, loginSchema, registerSchema } from "./auth.schema";

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register and receive a token
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
 *                 example: Password123!
 *     responses:
 *       201:
 *         description: Account created
 *       409:
 *         description: Email already exists
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ada@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login succeeded
 *       401:
 *         description: Invalid email or password
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user
 *       401:
 *         description: Missing or invalid token
 * /auth/change-password:
 *   post:
 *     tags: [Auth]
 *     summary: Change the authenticated user's password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 maxLength: 72
 *                 example: NewPass123!
 *     responses:
 *       200:
 *         description: Password changed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *       400:
 *         description: New password does not meet the policy
 *       401:
 *         description: Missing token or current password is incorrect
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout the current session
 *     description: Stateless JWT logout. The client must discard the access token. No server session is stored.
 *     responses:
 *       200:
 *         description: Logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 */
const authRoutes = Router();

authRoutes.post(
  "/register",
  validate({ body: registerSchema }),
  asyncHandler(async (req, res) => {
    await authController.register(req, res);
  }),
);

authRoutes.post(
  "/login",
  validate({ body: loginSchema }),
  asyncHandler(async (req, res) => {
    await authController.login(req, res);
  }),
);

authRoutes.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    await authController.me(req, res);
  }),
);

authRoutes.post(
  "/change-password",
  requireAuth,
  validate({ body: changePasswordSchema }),
  asyncHandler(async (req, res) => {
    await authController.changePassword(req, res);
  }),
);

authRoutes.post("/logout", (_req, res) => {
  authController.logout(_req, res);
});

export { authRoutes };
