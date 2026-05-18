import express from "express";
import type { Application } from "express";
import { errorHandler } from "@/utils/errorHandler.js";
import {} from "@archiq/logger"

export function CreateApp(): Application {
  const app = express();
  app.use(errorHandler);
  return app;
}
