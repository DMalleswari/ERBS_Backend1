import fs from "fs";
import path from "path";
import winston from "winston";
import { env } from "../../config";

const logDir = path.resolve(process.cwd(), "logs");
fs.mkdirSync(logDir, { recursive: true });

const levelByEnv = {
  development: "debug",
  test: "error",
  production: "info",
} as const;

const structuredFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

export const logger = winston.createLogger({
  level: levelByEnv[env.NODE_ENV],
  defaultMeta: { service: "erbs-backend" },
  format: structuredFormat,
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    }),
  ],
});

if (env.NODE_ENV === "production") {
  logger.add(
    new winston.transports.Console({
      format: structuredFormat,
    }),
  );
} else if (env.NODE_ENV === "development") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "HH:mm:ss" }),
        winston.format.printf((info) => {
          const { timestamp, level, message, service: _service, ...meta } = info;
          const extra = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : "";
          return `${String(timestamp)} ${level}: ${String(message)}${extra}`;
        }),
      ),
    }),
  );
}
