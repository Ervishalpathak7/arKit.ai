import z from "zod";

console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV !== "production") {
  const { config } = await import("dotenv");
  config();
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z.coerce.number().default(8080),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  RABBITMQ_URL: z.string().min(1),
});

export const env = envSchema.parse(process.env);
