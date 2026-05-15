import type { WebhookEvent } from "@clerk/fastify";
import type { UserService } from "./user.services.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import { verifySvixHeaders } from "./user.utils.js";

export class UserController {
  constructor(private service: UserService) {}

  webhook = async (req: FastifyRequest, reply: FastifyReply) => {
    let event: WebhookEvent;
    try {
      event = verifySvixHeaders(req);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      return reply.status(400).send({ error: msg });
    }

    // User Created
    if (event.type === "user.created") {
      const email = event.data.email_addresses?.[0]?.email_address;
      if (!email) return reply.status(400).send({ error: "No email found" });
      const { first_name, last_name, id: clerkId, image_url } = event.data;
      const user = await this.service.save({
        email,
        firstName: first_name ?? "",
        lastName: last_name ?? "",
        imageUrl: image_url,
        clerkId,
      });
      console.log(`New User Registered ${user.id}`);
      return reply.status(200).send({ message: "ok" });

      // User Updated
    } else if (event.type === "user.updated") {
      const email = event.data.email_addresses?.[0]?.email_address;
      if (!email) return reply.status(400).send({ error: "No email found" });
      const { first_name, last_name, id: clerkId, image_url } = event.data;
      const user = await this.service.update(clerkId, {
        email,
        firstName: first_name ?? "",
        lastName: last_name ?? "",
        imageUrl: image_url,
      });
      console.log(`User Updated ${user.id}`);
      return reply.status(200).send({ message: "ok" });

      // Other Event
    } else {
      console.warn(`unconfigured event occured`);
      return reply.status(400).send({ error: "event not configured" });
    }
  };
}
