import OpenAI from "openai";
import { z } from "zod";
import { env } from "../config/env.js";
import { COMMIT_TO_DRAFT_SYSTEM_PROMPT } from "../prompts/system.js";
import { buildUserPrompt } from "../prompts/buildUserPrompt.js";
import type { SummarizeRequest, SummarizeResponse } from "../types/index.js";

const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });

const responseSchema = z.object({
  title: z.string().min(1).max(80),
  excerpt: z.string().min(1).max(200),
  contentMd: z.string().min(1),
});

export async function summarizeCommits(
  req: SummarizeRequest,
): Promise<SummarizeResponse> {
  const completion = await client.chat.completions.create({
    model: env.LLM_MODEL,
    response_format: { type: "json_object" },
    temperature: 0.4,
    messages: [
      { role: "system", content: COMMIT_TO_DRAFT_SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(req) },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("LLM returned an empty response");
  }

  const parsed = responseSchema.safeParse(JSON.parse(raw));
  if (!parsed.success) {
    throw new Error(
      `LLM response did not match schema: ${parsed.error.message}`,
    );
  }
  return parsed.data;
}
