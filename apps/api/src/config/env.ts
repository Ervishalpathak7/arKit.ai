import z from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'production', 'test']),
  PORT: z.coerce.number().default(5500),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  RABBITMQ_URL: z.string().min(1),
});

export const env = envSchema.parse(process.env);
