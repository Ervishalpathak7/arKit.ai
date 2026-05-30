import { DesignRepository } from "./design.repository.js";
import { DesignService } from "./design.service.js";
import { DesignController } from "./design.controllers.js";
import { Router } from "express";
import { RedisService } from "@/services/redis/index.js";
import { DesignRouterOptions } from "@/types/index.js";
import { RabbitMqService } from "@/services/queue/index.js";

export function DesignRouter({
  prismaClient,
  redisClient,
  rabbitMq,
}: DesignRouterOptions): Router {
  const repo = new DesignRepository(prismaClient);
  const redisService = new RedisService(redisClient);
  const queueService = new RabbitMqService(rabbitMq);
  const designService = new DesignService(repo, redisService, queueService);
  const controllers = new DesignController(designService);
  const router = Router();
  router.post("/api/design/generate", controllers.CreateDesignController);
  return router;
}
