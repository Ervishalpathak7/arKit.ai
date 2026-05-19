import request from "supertest";
import { CreateApp } from "@/app.js";
import { describe, it, expect, afterAll, beforeAll, beforeEach } from "vitest";
import { Prisma } from "@/infra/prisma/prisma.js";
import { env } from "@/config/env.js";
import { Application } from "express";

describe("Design Generate Api", () => {
  const prisma = new Prisma(env.DATABASE_URL);
  let app: Application;

  beforeAll(async () => {
    await prisma.connect();
    app = CreateApp({ prismaClient: prisma.getClient() });
  });

  beforeEach(async () => {
    await prisma.getClient().design.deleteMany();
  });

  afterAll(async () => {
    await prisma.disconnect();
  });

  it("Should create design & return design Id", async () => {
    const response = await request(app).post("/api/design/generate").send({
      prompt: "testing prompt",
    });

    expect(response.status).toBe(201);
    expect(response.body.data.id).toBeDefined();

    const design = await prisma.getClient().design.findUnique({
      where: {
        id: response.body.data.id,
      },
    });

    expect(design).not.toBeNull();
  });
});
