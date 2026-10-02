import { createApp } from "./app";
import { env } from "./config";
import { logger } from "./infrastructure/logger";

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info("ERBS API started", {
    port: env.PORT,
    env: env.NODE_ENV,
    health: `http://localhost:${env.PORT}/api/v1/health`,
    swagger: `http://localhost:${env.PORT}/api-docs`,
  });
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled promise rejection", { reason });
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception", { message: error.message, stack: error.stack });
  server.close(() => process.exit(1));
});
