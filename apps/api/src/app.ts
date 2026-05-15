import Fastify from "fastify";
import gracefullShutdown from "./lib/shutdown.js";
import helmet from "@fastify/helmet";
import corsPlugin from "./plugins/cors.js";
import cookiePlugin from "./plugins/cookie.js";
import prismaPlugin from "./plugins/prisma.js";
import clerk from "./plugins/clerk.js";
import fastifyRawBody from "fastify-raw-body";
import healthRoutes from "./routes/health.js";
import aiPlugin from "./plugins/grok.js";
import authPlugin from "./plugins/auth.js";
import { UserRouter } from "./modules/user/user.routes.js";
import { DesignRouter } from "./modules/design/design.routes.js";
import { queuePlugin } from "./plugins/queue.js";

// Fastify app initialization
const app = Fastify({
  logger: {
    level: "info",
    transport: { target: "pino-pretty" },
  },
  disableRequestLogging: true,
});

// Plugins
app.register(helmet);
app.register(fastifyRawBody, {
  global: false,
});
app.register(corsPlugin);
app.register(clerk);
app.register(authPlugin);
app.register(cookiePlugin);
app.register(prismaPlugin);
app.register(queuePlugin)
app.register(aiPlugin);

// Routes
app.register(healthRoutes);
app.register(UserRouter, {
  prefix: "/api/users",
});
app.register(DesignRouter, {
  prefix: "/api/design",
});

process.on("SIGINT", () => gracefullShutdown(app));
process.on("SIGTERM", () => gracefullShutdown(app));

export default app;
