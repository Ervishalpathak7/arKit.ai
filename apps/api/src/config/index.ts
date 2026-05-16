import { env } from "./env.js";

export const config = {
  logger: {
    level: env.NODE_ENV === "production" ? "info" : "debug",
  },
};
