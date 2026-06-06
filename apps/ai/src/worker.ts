import { consumeDesign } from "@archiq/queue";
import { processDesign } from "./processing.js";
import { updateDesignById } from "@archiq/db";
import { setStatus } from "@archiq/cache";
import { log } from "./logger.js";

export async function startWorker() {
  log.info(`worker started , waiting for message`);
  await consumeDesign(async (data) => {
    const { id } = data as { id: string };
    log.info(`Design Generation Starts : [${id}]`);

    try {
      await processDesign(id);
      log.info(`[${id}] done`);
    } catch (error) {
      console.error(`[${id}] failed:`, error);
      await updateDesignById(id, { status: "FAILED" }).catch(() => {});
      await setStatus(id, "FAILED").catch(() => {});
    }
  });
}
