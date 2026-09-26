import cors from "cors";
import express from "express";
import helmet from "helmet";
import { setupSwagger } from "./infrastructure/docs";
import { apiRouter } from "./routes";

export function createApp() {
  const app = express();

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  app.use(cors());
  app.use(express.json());

  setupSwagger(app);

  app.use("/api/v1", apiRouter);

  return app;
}
