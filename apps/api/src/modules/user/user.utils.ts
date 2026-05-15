import type { WebhookEvent } from "@clerk/fastify";
import type { FastifyRequest } from "fastify";
import { Webhook } from "svix";
import config from "../../config.js";

export const verifySvixHeaders = (req: FastifyRequest) => {
  const svix_id = req.headers["svix-id"] as string;
  const svix_timestamp = req.headers["svix-timestamp"] as string;
  const svix_signature = req.headers["svix-signature"] as string;

  if (!svix_id || !svix_timestamp || !svix_signature) {
    throw new Error("missing svix signature ");
  }

  const webhook = new Webhook(config.CLERK_SIGNING_SECRET);
  let event: WebhookEvent | null;

  try {
    event = webhook.verify(req.rawBody as string, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
    return event;
  } catch (error) {
    throw new Error("Invalid webhook signature");
  }
};
