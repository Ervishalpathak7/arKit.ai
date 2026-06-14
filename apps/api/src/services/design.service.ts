import { CreateDesignDTO } from '../modules/design/design.dto.js';
import { createId } from '@paralleldrive/cuid2';
import { AppError } from '@/error/index.js';
import { log } from '@/config/logger.js';
import { Design, DesignStatus, saveDesign, updateDesignById } from '@archiq/db';
import { enqueueDesign } from '@archiq/queue';
import {
  setIdempotencyKey,
  deleteIdempotencyKey,
  getIdempotentData,
  IdempotencyRecord,
  setStatus,
} from '@archiq/cache';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export const createDesignService = async ({
  authorId,
  prompt,
  requestHash,
  idempotencyKey,
}: CreateDesignDTO) => {
  // Generate cuid for DesignId
  const id = createId();

  // 1. check idempotency
  const acquired = await setIdempotencyKey(authorId, idempotencyKey, {
    id,
    status: 'PENDING',
    requestHash,
  });

  if (!acquired) {
    const existing = await getIdempotentData(authorId, idempotencyKey);
    if (!existing) throw new AppError('Race condition', 409, 'RACE_CONDITION');

    const parsed = JSON.parse(existing) as IdempotencyRecord;
    if (parsed.requestHash !== requestHash)
      throw new AppError('Payload mismatch', 409, 'PAYLOAD_MISMATCH');

    return { id: parsed.id, status: parsed.status as DesignStatus };
  }

  // 2. save to DB
  let design: Design;
  try {
    design = await saveDesign({ id, authorId, prompt });
  } catch (error) {
    // idempotency key is set but design failed — delete the key so retries can start fresh
    await deleteIdempotencyKey(authorId, idempotencyKey).catch(() => {});
    throw new AppError(
      'Design creation failed in database',
      500,
      'DATABASE_ERROR'
    );
  }

  // 3. set initial status in Redis — must happen before enqueue
  // so stream route never sees a null status for a valid job
  await setStatus(id, 'PENDING');

  // 4. enqueue
  try {
    await enqueueDesign({ type: 'design-generation', id, authorId });
    log.info({ id }, 'design generation queued');
  } catch (error) {
    await updateDesignById(design.id, { status: 'FAILED' }).catch(() => {});
    await setStatus(id, 'FAILED');
    throw new AppError('Design queue failed', 500, 'RABBITMQ_FAILURE');
  }
  return { id: design.id, status: 'PENDING' };
};
