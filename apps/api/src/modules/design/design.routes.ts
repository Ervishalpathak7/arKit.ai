import { PrismaClient } from "@/generated/prisma/client.js";
import { DesignRepository } from "./design.repository.js";
import { DesignService } from "./design.service.js";
import { DesignController } from "./design.controllers.js";
import { Router } from "express";

export function DesignRouter(db: PrismaClient): Router {
  const repo = new DesignRepository(db);
  const services = new DesignService(repo);
  const controllers = new DesignController(services);
  const router = Router();
  router.post("/api/design/generate", controllers.CreateDesignController);
  return router;
}
