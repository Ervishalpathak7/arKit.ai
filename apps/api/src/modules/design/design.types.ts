import { Prisma } from "@/generated/prisma/client.js";

export type DesignUpdateInput = {
  title?: string;
  status?: DesignStatus;
  body?: Prisma.InputJsonValue;
};

export type CreateDesignInput = {
  id: string;
  prompt: string;
  authorId: string;
};

type DesignStatus = "PROCESSING" | "FAILED" | "READY";
