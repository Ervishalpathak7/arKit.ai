import type { FastifyInstance } from "fastify";
import { UserRepository } from "./user.repo.js";
import { UserService } from "./user.services.js";
import { UserController } from "./user.controllers.js";

export const UserRouter = async (fastify: FastifyInstance) => {
  const repo = new UserRepository(fastify.prisma);
  const service = new UserService(repo);
  const controllers = new UserController(service);

  fastify.post(
    "/webhook/clerk",
    {
      config: {
        rawBody: true,
      },
    },
    controllers.webhook,
  );
};
