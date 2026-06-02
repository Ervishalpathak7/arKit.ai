import { InputJsonValue } from "@archiq/prisma";

export type DesignUpdateInput = {
  title?: string;
  status?: DesignStatus;
  body?: InputJsonValue;
};

export type CreateDesignInput = {
  id: string;
  prompt: string;
  authorId: string;
};

type DesignStatus = "PROCESSING" | "FAILED" | "READY";
