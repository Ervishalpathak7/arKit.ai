import { DesignService } from "./design.service.js";
import { DesignController } from "./design.controllers.js";
import { Router } from "express";

export function DesignRouter(): Router {
  const designService = new DesignService();
  const controllers = new DesignController(designService);
  const router = Router();
  router.post("/api/design/generate", controllers.CreateDesignController);
  return router;
}
