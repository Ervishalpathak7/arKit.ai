import type { FastifyReply, FastifyRequest } from "fastify";
import type { DesignService } from "./design.services.js";

export class DesignController {
  constructor(private service: DesignService) {}

  initController = async (req: FastifyRequest, reply: FastifyReply) => {
    // TODO: add idempotancy logic
    // const idempotencyKey = req.headers["idempotency-key"] as string;
    // if (!idempotencyKey) {
    //   return reply.status(400).send({ error: "idempotency key missing" });
    // }
    const { prompt } = (req.body as { prompt?: string }) || {};
    if (!prompt)
      return reply.status(400).send({ error: "Prompt is required " });
    const design = await this.service.initService({
      prompt,
      authorId: "vishalpathak1",
    });
    return reply.status(201).send({
      message: "design generation initialised",
      id: design.id,
    });
  };
}
