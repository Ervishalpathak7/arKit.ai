import type { PrismaClient } from "../generated/prisma/client.js";
import type Groq from "groq-sdk";
import type { Channel } from "amqplib";

export interface JWTPayload {
  userId: string;
  role: "user" | "admin";
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
    prisma: PrismaClient;
    ai: Groq;
    queueChannel: Channel;
  }
  interface FastifyRequest {
    userId: string;
  }
}
