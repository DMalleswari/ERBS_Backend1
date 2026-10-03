import swaggerJsdoc from "swagger-jsdoc";
import { env } from "../../config";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "ERBS API",
      version: "1.0.0",
      description: "Enterprise Resource Booking System API documentation",
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}/api/v1`,
        description: "Local development",
      },
    ],
    tags: [
      {
        name: "Health",
        description: "Service health checks",
      },
      {
        name: "Auth",
        description: "Register and login",
      },
      {
        name: "Users",
        description: "User records",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/modules/**/*.routes.ts", "./dist/modules/**/*.routes.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
