import { env } from '@/config/env.js';
import helmet from 'helmet';
import express, { Application } from 'express';
import { register } from '@/observability/metrics.js';
import { errorHandler } from '@/utils/errorHandler.js';
import { DesignRouter } from '@/modules/design/design.routes.js';

export function CreateApp(): Application {
  // express app creation
  const app = express();

  // Middlewares
  app.use(helmet());
  app.use(express.json({ limit: '16kb' }));
  app.use(express.urlencoded({ limit: '16kb', extended: true }));

  // Routes
  app.get('/', (req, res) => {
    res.status(200).send({
      message: 'heelo from container!',
      pod: process.env.POD_NAME || 'unknown',
      timeStamp: new Date().toLocaleDateString(),
    });
  });

  app.get('/readyz', (_req, res) => res.status(200).send('ready'));
  app.get('/healthz', (_req, res) => res.status(200).send('ok'));

  // design routes
  const designRouter = DesignRouter();
  app.use('/api', designRouter);

  // if (env.NODE_ENV !== 'test') {
  //   app.get('/metrics', async (_, res) => {
  //     res.setHeader('Content-Type', register.contentType);
  //     const metrics = await register.metrics();
  //     res.send(metrics);
  //   });
  // }

  app.use(errorHandler);
  return app;
}
