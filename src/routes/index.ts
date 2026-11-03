import { Router } from "express";
import { auditLogRoutes } from "../modules/audit-logs/audit-logs.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { availabilityRoutes } from "../modules/availability/availability.routes";
import { bookingRoutes } from "../modules/bookings/bookings.routes";
import { dashboardRoutes } from "../modules/dashboard/dashboard.routes";
import { healthRoutes } from "../modules/health/health.routes";
import { notificationRoutes } from "../modules/notifications/notifications.routes";
import { resourceTypeRoutes } from "../modules/resource-types/resource-types.routes";
import { resourceRoutes } from "../modules/resources/resources.routes";
import { usersRoutes } from "../modules/users/users.routes";

const apiRouter = Router();

apiRouter.use("/health", healthRoutes);
apiRouter.use("/auth", authRoutes);
apiRouter.use("/users", usersRoutes);
apiRouter.use("/resource-types", resourceTypeRoutes);
apiRouter.use("/resources", resourceRoutes);
apiRouter.use("/availability", availabilityRoutes);
apiRouter.use("/bookings", bookingRoutes);
apiRouter.use("/dashboard", dashboardRoutes);
apiRouter.use("/audit-logs", auditLogRoutes);
apiRouter.use("/notifications", notificationRoutes);

export { apiRouter };
