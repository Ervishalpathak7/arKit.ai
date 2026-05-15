import type { Prisma, PrismaClient } from "../../generated/prisma/client.js";
import type { UpdateUserDTO } from "./user.dto.js";

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByClerkId(clerkId: string) {
    return this.prisma.user.findUnique({ where: { clerkId } });
  }

  async upsertUser(data: Prisma.UserCreateInput) {
    return this.prisma.user.upsert({
      create: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        imageUrl: data.imageUrl,
        clerkId: data.clerkId,
      },
      update: {},
      where: {
        clerkId: data.clerkId,
      },
    });
  }

  async update(clerkId: string, data: UpdateUserDTO) {
    return this.prisma.user.update({
      where: {
        clerkId,
      },
      data,
    });
  }
}
