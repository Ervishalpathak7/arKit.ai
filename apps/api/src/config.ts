import { configDotenv } from "dotenv";
import z from "zod";

configDotenv();

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV : z.enum(['DEV' , 'PROD' , 'TEST']).default('DEV'),
  CLIENT_URL : z.url(),
  JWT_SECRET : z.string(),
  COOKIE_SIGNATURE_KEY : z.string(),
  DATABASE_URL : z.url(),
  CLERK_SECRET_KEY : z.string(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY : z.string(),
  CLERK_SIGNING_SECRET : z.string(),
  GROQ_API_KEY : z.string(),
  RABBITMQ_URL : z.url()
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(
    `Env parsing failed: ${JSON.stringify(parsedEnv.error.format(), null, 2)}`,
  );
}

const config = parsedEnv.data;
export default config;
