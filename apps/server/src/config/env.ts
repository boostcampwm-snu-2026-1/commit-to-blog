import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { z } from "zod";

const currentDir = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(currentDir, "../..");

config({ path: resolve(packageRoot, "../../.env") });
config({ path: resolve(packageRoot, ".env"), override: true });

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  APP_ORIGIN: z.string().default("http://localhost:5173"),
  DB_PATH: z.string().default("data/commit-to-blog.db"),
  GITHUB_TOKEN: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default("gpt-4.1-mini"),
  DEMO_MODE: z.enum(["true", "false"]).optional().default("false").transform((value) => value === "true")
});

const parsed = envSchema.parse(process.env);

export const env = {
  ...parsed,
  packageRoot,
  databasePath: resolve(packageRoot, parsed.DB_PATH)
};

export const integrationMode = {
  github: parsed.DEMO_MODE || !parsed.GITHUB_TOKEN ? "demo" : "live",
  openAI: parsed.DEMO_MODE || !parsed.OPENAI_API_KEY ? "demo" : "live"
} as const;

