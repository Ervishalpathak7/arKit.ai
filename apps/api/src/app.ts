import express from "express";
import type { Application } from "express";
import { errorHandler } from "@/utils/errorHandler.js";
import {} from "@archiq/logger";
import { register } from "@/observability/metrics.js";

export function CreateApp(): Application {
  const app = express();

 app.get("/metrics", async (_, res) => {
  res.setHeader(
    "Content-Type",
    register.contentType,
  );
  const metrics = await register.metrics();
  res.send(metrics);
});

  app.use(errorHandler);
  return app;
}
