import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { healthRoutes } from "../modules/health/health.routes";
import { usersRoutes } from "../modules/users/users.routes";

const apiRouter = Router();

apiRouter.use("/health", healthRoutes);
apiRouter.use("/auth", authRoutes);
apiRouter.use("/users", usersRoutes);

export { apiRouter };
