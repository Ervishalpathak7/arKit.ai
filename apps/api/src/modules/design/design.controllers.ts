import { Request, Response } from "express";
import { DesignService } from "./design.service.js";
import { InvalidRequest } from "@/error/index.js";
import { createHash } from "crypto";

const authorId = "9ac10786-624a-4106-965f-8d01ff0f3bd1";

export class DesignController {
  constructor(private service: DesignService) {}

  CreateDesignController = async (req: Request, res: Response) => {
    // Extract Idempotency-key from headers
    const idempotencyKey = req.headers["idempotency-key"] as string;
    if (!idempotencyKey) {
      throw new InvalidRequest(
        "idempotency-key",
        "idempotency-key header is required",
      );
    }

    // Extract Prompt from body
    const { prompt } = (req.body as { prompt: string }) || {};
    if (!prompt) throw new InvalidRequest("prompt", "Prompt is Required");

    req.userId = authorId;
    const requestHash = createHash("sha256")
      .update(
        JSON.stringify({
          prompt,
          userId: req.userId,
          route: req.originalUrl,
          method: req.method,
        }),
      )
      .digest("hex");

    // Create a design in db and put a message in queue
    const design = await this.service.createDesign({
      prompt,
      authorId: req.userId,
      idempotencyKey,
      requestHash,
    });

    // Send the response
    res.status(202).send({
      message: "Design generation queued",
      data: { id: design?.id, status: design?.status },
    });
  };
}
