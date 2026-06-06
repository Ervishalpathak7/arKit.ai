import { Request, Response } from "express";
import { DesignService } from "./design.service.js";
import { InvalidRequest } from "@/error/index.js";
import { createHash } from "crypto";
import { getStatus, subscribe } from "@archiq/cache";
import { getDesignById } from "@archiq/db";

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

    // TODO: add auth middleware before production
    req.userId = authorId;

    // hash request
    const requestHash = createHash("sha256")
      .update(
        JSON.stringify({
          prompt,
          authorId: req.userId,
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
      data: { id: design.id, status: design.status },
    });
  };

  GetDesignController = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    // Check status
    const status = await getStatus(id);

    if (!status) {
      res.status(404).send({ error: "design not found" });
      return;
    }

    // If READY send the data from DB
    if (status === "READY") {
      const design = await getDesignById(id);
      if (!design) {
        res.status(404).send({ error: "design not found" });
        return;
      }
      res.status(200).send({
        status: "READY",
        data: {
          id: design.id,
          title: design.title,
          body: design.body,
          createdAt: design.createdAt,
        },
      });
      return;
    }

    // If FAILED send the failed message
    if (status === "FAILED") {
      res
        .status(422)
        .json({ status: "FAILED", message: "design generation failed" });
      return;
    }

    // ── PROCESSING or PENDING — open SSE and subscribe to Redis
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const heartbeat = setInterval(() => res.write(":\n\n"), 15000);
    const unsubscribe = subscribe(`design:${id}`, (data: any) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);

      if (
        data.type === "status" &&
        (data.status === "READY" || data.status === "FAILED")
      ) {
        cleanup();
      }
    });

    // re-check after subscribing to close the race condition gap
    const currentStatus = await getStatus(id);
    if (currentStatus === "READY" || currentStatus === "FAILED") {
      const design = currentStatus === "READY" ? await getDesignById(id) : null;
      res.write(
        `data: ${JSON.stringify({
          status: currentStatus,
          ...(design && {
            data: { id: design.id, title: design.title, body: design.body },
          }),
        })}\n\n`,
      );
      cleanup();
      return;
    }

    function cleanup() {
      clearInterval(heartbeat);
      unsubscribe();
      res.end();
    }

    req.on("close", cleanup);
  };
}
