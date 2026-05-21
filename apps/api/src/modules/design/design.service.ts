import { RedisService } from "@/services/redis/index.js";
import {
  CreateDesignDTO,
  GetAuthorDesignDTO,
  UpdateDesignDTO,
} from "./design.dto.js";
import { DesignRepository } from "./design.repository.js";
import { createId } from "@paralleldrive/cuid2";
import { AppError } from "@/error/index.js";
import { Design, DesignStatus } from "@/generated/prisma/client.js";
import { IdempotencyRecord } from "@/types/index.js";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export class DesignService {
  constructor(
    private repo: DesignRepository,
    private redisService: RedisService,
  ) {}

  async createDesign(data: CreateDesignDTO) {
    // Generate cuid for DesignId
    const id = createId();

    // Set Idempotency-key
    const redisKey = `idem:${data.authorId}:${data.idempotencyKey}`;
    const aquired = await this.redisService.setIdempotencyKey(redisKey, {
      id,
      status: "PROCESSING",
      requestHash: data.requestHash,
    });

    if (!aquired) {
      const existing = await this.redisService.getSavedData(redisKey);
      if (!existing)
        throw new AppError("Race condition", 409, "RACE_CONDITION");

      const parsed = JSON.parse(existing) as IdempotencyRecord;
      if (parsed.requestHash !== data.requestHash)
        throw new AppError("Payload mismatch", 409, "PAYLOAD_MISMATCH");
      return {
        id: parsed.id,
        status: parsed.status as DesignStatus,
      };
    }

    let design: Design;
    try {
      design = await this.repo.create({
        id,
        authorId: data.authorId,
        prompt: data.prompt,
      });
    } catch (error) {
      throw new AppError(
        "design creation failed in database",
        500,
        "DATABASE_ERROR",
      );
    }

    try {
      await this.redisService.setData(
        redisKey,
        JSON.stringify({
          id: design.id,
          status: design.status,
          requestHash: data.requestHash,
        }),
        86400,
      );
      return { id: design.id, status: design.status };
    } catch (error) {
      await this.repo.delete(design.id, data.authorId);
      await this.redisService.deleteData(redisKey);
      throw new AppError(
        "design creation failed in redis ",
        500,
        "REDIS_ERROR",
      );
    }
  }

  async getAuthorDesign(data: GetAuthorDesignDTO) {
    return this.repo.findByIdAndAuthor(data);
  }

  async updateDesign({ id, authorId, data }: UpdateDesignDTO) {
    return this.repo.update(id, authorId, data);
  }

  async listAuthorDesigns(
    authorId: string,
    page: number = 1,
    limit: number = DEFAULT_LIMIT,
  ) {
    const checkedLimit =
      limit <= 0 ? DEFAULT_LIMIT : Math.min(limit, MAX_LIMIT);
    const checkedPage = page < 0 ? 1 : page;
    return this.repo.findByAuthor(authorId, checkedPage, checkedLimit);
  }
}
