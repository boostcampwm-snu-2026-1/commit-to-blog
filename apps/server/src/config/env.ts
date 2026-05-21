import "dotenv/config";
import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  GITHUB_TOKEN: z.string().min(1).optional(),
  OPENAI_API_KEY: z.string().min(1).optional(),
  OPENAI_MODEL: z.string().default("gpt-4o-mini"),
  /**
   * Posts JSON 영속화 디렉토리. apps/server 워크스페이스를 cwd 로 npm 이 실행하므로
   * 기본값은 그 기준 상대경로(`../../data` = 레포 루트의 `data/`).
   */
  DATA_DIR: z.string().default("../../data"),
});

export type Env = z.infer<typeof EnvSchema>;

export const env: Env = EnvSchema.parse(process.env);

export const hasGithubToken = (): boolean => Boolean(env.GITHUB_TOKEN);
export const hasOpenAiKey = (): boolean => Boolean(env.OPENAI_API_KEY);
