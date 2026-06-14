import z from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'production', 'test']).default('dev'),
  PORT: z.coerce.number({ error: 'PORT MUST BE PROVIDED' }).default(5500),
  DATABASE_URL: z.string({ error: 'DATABASE_URL MUST BE PROVIDED' }).min(1),
  REDIS_URL: z.string({ error: 'REDIS_URL MUST BE PROVIDED' }).min(1),
  RABBITMQ_URL: z.string({ error: 'RABBITMQ_URL MUST BE PROVIDED' }).min(1),
});

export const env = envSchema.parse(process.env);
