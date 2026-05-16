import express from "express";
import type { Application } from "express";
import { errorHandler } from "@/utils/errorHandler.js";

export function CreateApp(): Application {
  const app = express();

  app.use(errorHandler)
  return app;
}
