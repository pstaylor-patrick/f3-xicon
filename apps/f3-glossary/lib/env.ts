import { z } from 'zod';
import { config } from 'dotenv';

config({ path: '.env.local' });

const envSchema = z
  .object({
    POSTGRES_URL: z.string().min(1),
  })
  .required()
  .readonly();

type Env = z.infer<typeof envSchema>;

const result = envSchema.safeParse({
  POSTGRES_URL: process.env.POSTGRES_URL,
});

if (!result.success) {
  console.error('Invalid environment variables:', result.error.format());
  process.exit(1);
}

const env = Object.freeze(result.data) as Readonly<Env>;

// Only wrapped, so that DI patterns could be used in unit tests
export type EnvGetter = () => Env;
export const getEnv: EnvGetter = () => env;
