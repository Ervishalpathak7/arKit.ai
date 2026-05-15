import type { Prisma, PrismaClient } from "../../generated/prisma/client.js";

export class DesignRepository {
  constructor(private db: PrismaClient) {}

  async init(data: Prisma.DesignCreateInput) {
    return this.db.design.create({
      data: {
        authorId: data.authorId,
        prompt: data.prompt,
      },
    });
  }
}
