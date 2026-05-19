import express from "express";
import type { Application } from "express";
import { errorHandler } from "@/utils/errorHandler.js";
import { register } from "@/observability/metrics.js";
import { PrismaClient } from "./generated/prisma/client.js";
import helmet from "helmet";
import { DesignRouter } from "./modules/design/design.routes.js";
import { env } from "./config/env.js";

type AppDependencies = {
  prismaClient: PrismaClient;
};

export function CreateApp({ prismaClient }: AppDependencies): Application {
  const app = express();

  // middlewares
  app.use(helmet());
  app.use(express.json({ limit: "16kb" }));
  app.use(express.urlencoded({ limit: "16kb", extended: true }));

  // routes
  const designRouter = DesignRouter(prismaClient);
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
