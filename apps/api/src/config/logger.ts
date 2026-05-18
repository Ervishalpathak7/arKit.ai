import { createAppLogger } from "@archiq/logger";
import { env } from "./env.js";

export const log: ReturnType<typeof createAppLogger> = createAppLogger({
  service: "api",
  production: env.NODE_ENV === "production",
});
