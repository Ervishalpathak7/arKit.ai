import { PrismaClient } from "@/generated/prisma/client.js";
import { GetAuthorDesignDTO } from "./design.dto.js";
import { CreateDesignInput, DesignUpdateInput } from "./design.types.js";

export class DesignRepository {
  constructor(private db: PrismaClient) {}

  create = async (data: CreateDesignInput) => {
    return this.db.design.create({ data });
  };

  findByIdAndAuthor = async ({ id, authorId }: GetAuthorDesignDTO) => {
    return this.db.design.findUnique({ where: { id, authorId } });
  };

  findByAuthor = async (authorId: string, page: number, limit: number) => {
    const skip = (page - 1) * limit;
    return this.db.design.findMany({
      where: { authorId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  };

  update = async (id: string, authorId: string, data: DesignUpdateInput) => {
    return this.db.design.update({
      where: { id, authorId },
      data: {
        status: data.status,
        title: data.title,
        body: data.body,
      },
    });
  };

  delete = async (id: string, authorId: string) => {
    return this.db.design.delete({
      where: {
        id,
        authorId,
      },
    });
  };
}
