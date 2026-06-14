import helmet from 'helmet';
import express, { Application } from 'express';
import { errorHandler } from '@/utils/errorHandler.js';
import DesignRouter from '@/routes/design.routes.js';

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
  app.use('/api', DesignRouter);


  app.use(errorHandler);
  return app;
}
