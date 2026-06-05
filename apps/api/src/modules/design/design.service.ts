import { CreateDesignDTO, UpdateDesignDTO } from "./design.dto.js";
import { createId } from "@paralleldrive/cuid2";
import { AppError } from "@/error/index.js";
import { log } from "@/config/logger.js";
import { Design, DesignStatus, saveDesign, updateDesignById } from "@archiq/db";
import { enqueueDesign } from "@archiq/queue";
import {
  setResult,
  setIdempotencyKey,
  getIdempotentData,
  IdempotencyRecord,
} from "@archiq/cache";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export class DesignService {
  constructor() {}

  async createDesign({
    authorId,
    prompt,
    requestHash,
    idempotencyKey,
  }: CreateDesignDTO) {
    // Generate cuid for DesignId
    const id = createId();

    // Set Idempotency-key
    const aquired = await setIdempotencyKey(authorId, idempotencyKey, {
      id,
      status: "PENDING",
      requestHash: requestHash,
    });

    if (!aquired) {
      const existing = await getIdempotentData(authorId, idempotencyKey);
      if (!existing)
        throw new AppError("Race condition", 409, "RACE_CONDITION");

      const parsed = JSON.parse(existing) as IdempotencyRecord;
      if (parsed.requestHash !== requestHash)
        throw new AppError("Payload mismatch", 409, "PAYLOAD_MISMATCH");
      return {
        id: parsed.id,
        status: parsed.status as DesignStatus,
      };
    }

    let design: Design;
    try {
      design = await saveDesign({
        id,
        authorId,
        prompt,
      });
    } catch (error) {
      throw new AppError(
        "design creation failed in database",
        500,
        "DATABASE_ERROR",
      );
    }

    try {
      await enqueueDesign({ type: "design-generation", id, authorId });
      log.info({ id }, `design generation queued`);
    } catch (error) {
      await updateDesignById(design.id, { status: "FAILED" });
      throw new AppError("design queue failed", 500, "RABBITMQ_FAILURE");
    }

    try {
      await setResult(
        id,
        JSON.stringify({
          id: design.id,
          status: design.status,
          requestHash: requestHash,
        }),
      );
      return { id: design.id, status: design.status };
    } catch (error) {
      log.error(
        {
          type: "redis",
          error,
        },
        `redis data saving failed`,
      );
    }
  }

  // async getAuthorDesign(data: GetAuthorDesignDTO) {
  //   return this.repo.findByIdAndAuthor(data);
  // }

  // async listAuthorDesigns(
  //   authorId: string,
  //   page: number = 1,
  //   limit: number = DEFAULT_LIMIT,
  // ) {
  //   const checkedLimit =
  //     limit <= 0 ? DEFAULT_LIMIT : Math.min(limit, MAX_LIMIT);
  //   const checkedPage = page < 0 ? 1 : page;
  //   return this.repo.findByAuthor(authorId, checkedPage, checkedLimit);
  // }
}
