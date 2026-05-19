import { Prisma, PrismaClient } from "@/generated/prisma/client.js";
import { GetAuthorDesignDTO } from "./design.dto.js";
import { CreateDesignInput, DesignUpdateInput } from "./design.types.js";

export class DesignRepository {
  constructor(private db: PrismaClient) {}

  async create(data: CreateDesignInput) {
    return this.db.design.create({ data });
  }

  findByIdAndAuthor({ id, authorId }: GetAuthorDesignDTO) {
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

  async update(id: string, authorId: string, data: DesignUpdateInput) {
    return this.db.design.update({
      where: { id, authorId },
      data: {
        status: data.status,
        title: data.title,
        body: data.body,
      },
    });
  }
}
