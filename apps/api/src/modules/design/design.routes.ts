import type { FastifyInstance } from "fastify";
import { DesignRepository } from "./design.repo.js";
import { DesignService } from "./design.services.js";
import { DesignController } from "./design.controllers.js";
import { QueueService } from "../queue/queue.services.js";

export const DesignRouter = (fastify: FastifyInstance) => {
  const repo = new DesignRepository(fastify.prisma);
  const queueService = new QueueService(fastify.queueChannel);
  const services = new DesignService(repo, queueService);
  const controllers = new DesignController(services);
  fastify.post("/init", controllers.initController);
};
