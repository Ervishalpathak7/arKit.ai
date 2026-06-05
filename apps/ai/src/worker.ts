import { consumeDesign } from "@archiq/queue";
import { processDesign } from "./processing.js";
import { updateDesignById } from "@archiq/db";
import { setStatus } from "@archiq/cache";

export async function startWorker() {
  console.log(`worker started , waiting for message`);

  await consumeDesign(async (data) => {
    const { id } = data as { id: string };

    try {
      await processDesign(id);
      console.log(`[${id}] done`);
    } catch (error) {
      console.error(`[${id}] failed:`, error);
      await updateDesignById(id, { status: "FAILED" }).catch(() => {});
      await setStatus(id, "FAILED").catch(() => {});
    }
  });
}
