import { createApp } from "./app";
import { env } from "./config";

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`ERBS API running on http://localhost:${env.PORT}`);
  console.log(`Health:  http://localhost:${env.PORT}/api/v1/health`);
  console.log(`Swagger: http://localhost:${env.PORT}/api-docs`);
});
