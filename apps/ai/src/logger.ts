import { createAppLogger } from "@archiq/log";

export const log: ReturnType<typeof createAppLogger> = createAppLogger({
  service: "api",
  production: process.env?.NODE_ENV === "production",
});
