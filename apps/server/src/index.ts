import { env, hasGithubToken, hasOpenAiKey } from "./config/env.js";
import { createApp } from "./app.js";

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`[server] listening on http://localhost:${env.PORT}`);
  console.log(`[server] GITHUB_TOKEN: ${hasGithubToken() ? "set" : "missing (mock data 사용)"}`);
  console.log(`[server] OPENAI_API_KEY: ${hasOpenAiKey() ? "set" : "missing (week12에서 필요)"}`);
});
