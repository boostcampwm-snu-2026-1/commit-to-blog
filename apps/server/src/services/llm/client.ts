import OpenAI from "openai";
import { env, hasOpenAiKey } from "../../config/env.js";

let cachedClient: OpenAI | null = null;

export function openai(): OpenAI {
  if (!hasOpenAiKey()) {
    throw new Error("OPENAI_API_KEY_MISSING");
  }
  if (!cachedClient) {
    cachedClient = new OpenAI({ apiKey: env.OPENAI_API_KEY! });
  }
  return cachedClient;
}
