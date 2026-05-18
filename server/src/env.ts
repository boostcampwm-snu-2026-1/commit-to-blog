import { fileURLToPath } from 'node:url';
import path from 'node:path';
import dotenv from 'dotenv';
import { z } from 'zod';

const here = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(here, '../../.env');
dotenv.config({ path: envPath, quiet: true });

const envSchema = z.object({
  GITHUB_TOKEN: z.string().min(1, 'GITHUB_TOKEN is required'),
  ANTHROPIC_API_KEY: z.string().min(1, 'ANTHROPIC_API_KEY is required'),
  BLOG_REPO: z
    .string()
    .regex(/^[^/]+\/[^/]+$/, 'BLOG_REPO must be "owner/repo"')
    .optional(),
  PORT: z.coerce.number().int().positive().default(3001),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `  ${i.path.join('.') || '(root)'}: ${i.message}`)
    .join('\n');
  console.error(`Invalid environment variables:\n${issues}`);
  process.exit(1);
}

export const env = parsed.data;
