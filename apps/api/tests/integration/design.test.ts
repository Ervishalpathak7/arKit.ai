import request from "supertest";
import { CreateApp } from "../../src/app.js";
import { describe, it, expect, afterAll, beforeAll, beforeEach } from "vitest";
import { env } from "../../src/config/env.js";
import { Application } from "express";
import { dissconnectDb, initDb, getDesignById } from "@archiq/db";
import { dissconnectCache, initCache } from "@archiq/cache";
import { dissconnectQueue, initQueue } from "@archiq/queue";
import { randomUUID } from "crypto";

describe("Design Api", () => {
  let app: Application;
  const randomId = randomUUID();

  beforeAll(async () => {
    await initDb(env.DATABASE_URL);
    await initCache(env.REDIS_URL);
    await initQueue(env.RABBITMQ_URL);
    app = CreateApp();
  });

  afterAll(async () => {
    await dissconnectDb();
    await dissconnectCache();
    await dissconnectQueue();
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
    const design = await getDesignById(response.body.data.id);
    expect(design).not.toBe(null);
  });
});
