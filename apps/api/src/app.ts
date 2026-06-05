import helmet from "helmet";
import express from "express";
import { env } from "./config/env.js";
import type { Application } from "express";
import { register } from "@/observability/metrics.js";
import { errorHandler } from "@/utils/errorHandler.js";
import { DesignRouter } from "./modules/design/design.routes.js";

export function CreateApp(): Application {
  const app = express();

  // middlewares
  app.use(helmet());
  app.use(express.json({ limit: "16kb" }));
  app.use(express.urlencoded({ limit: "16kb", extended: true }));

  // routes
  const designRouter = DesignRouter();
  app.use(designRouter);

  if (env.NODE_ENV !== "test") {
    app.get("/metrics", async (_, res) => {
      res.setHeader("Content-Type", register.contentType);
      const metrics = await register.metrics();
      res.send(metrics);
    });
  }

  app.use(errorHandler);
  return app;
}
