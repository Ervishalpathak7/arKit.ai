import request from "supertest";
import { CreateApp } from "@/app.js";
import { describe, it, expect, afterAll, beforeAll, beforeEach } from "vitest";
import { Prisma } from "@/infra/prisma/prisma.js";
import { env } from "@/config/env.js";
import { Application } from "express";
import { Redis } from "@/infra/redis/redis.js";
import { randomUUID } from "crypto";
import { RabbitMQ } from "@/infra/queue/rabbitmq.js";

describe("Design Api", () => {
  const prisma = new Prisma(env.DATABASE_URL);
  const redis = new Redis(env.REDIS_URL);
  const rabbitMq = new RabbitMQ(env.RABBITMQ_URL);
  const randomId = randomUUID();
  let app: Application;

  beforeAll(async () => {
    await prisma.connect();
    await redis.connect();
    await rabbitMq.connect();
    app = CreateApp({
      prisma,
      redis,
      rabbitMq,
    });
  });

  beforeEach(async () => {
    await prisma.getClient().design.deleteMany();
    await redis.getClient().flushall();
  });

  afterAll(async () => {
    await prisma.disconnect();
    await redis.disconnect();
    await rabbitMq.disconnect();
  });

  it("Should give invalid request error", async () => {
    const response = await request(app).post("/api/design/generate").send();
    expect(response.status).toBe(401);
    expect(response.body.error).toBe("INVALID_REQUEST");
  });

  it("should give invalid request error", async () => {
    const response = await request(app)
      .post("/api/design/generate")
      .send({ prompt: "testing prompt  ${randomId}" });
    expect(response.status).toBe(401);
    expect(response.body.error).toBe("INVALID_REQUEST");
  });

  it("Should give invalid request error", async () => {
    const response = await request(app)
      .post("/api/design/generate")
      .set("idempotency-key", randomId)
      .send();

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("INVALID_REQUEST");
  });

  it("should generate a design and give designId", async () => {
    const response = await request(app)
      .post("/api/design/generate")
      .set("idempotency-key", randomId)
      .send({ prompt: `testing prompt ${randomId}` });

    expect(response.status).toBe(202);
    expect(response.body.data.id).toBeDefined();

    const design = await prisma
      .getClient()
      .design.findUnique({ where: { id: response.body.data.id } });

    expect(design).not.toBe(null);
  });
});
