import { Prisma, PrismaClient } from "@/generated/prisma/client.js";

export class DesignRepository {
  constructor(private db: PrismaClient) {}

  async create(data: Prisma.DesignCreateInput) {
    return this.db.design.create({ data });
  }

  findByIdAndAuthor(id: string, authorId: string) {
    return this.db.design.findUnique({ where: { id, authorId } });
  }

  async findByAuthor(authorId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    return this.db.design.findMany({
      where: { authorId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  }

  async update(id: string, data: Prisma.DesignUpdateInput) {
    return this.db.design.update({ where: { id }, data });
  }
}
