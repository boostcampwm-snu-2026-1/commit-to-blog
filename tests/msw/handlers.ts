import { http, HttpResponse } from "msw";

// Default happy-path handlers. Override per-test with server.use(...).
export const handlers = [
  // GitHub: list user repos
  http.get("https://api.github.com/user/repos", () => HttpResponse.json([])),

  // GitHub: list branches
  http.get("https://api.github.com/repos/:owner/:repo/branches", () => HttpResponse.json([])),

  // GitHub: list commits
  http.get("https://api.github.com/repos/:owner/:repo/commits", () => HttpResponse.json([])),

  // OpenAI: chat completions
  http.post("https://api.openai.com/v1/chat/completions", () =>
    HttpResponse.json({
      id: "chatcmpl-test",
      choices: [
        {
          index: 0,
          message: { role: "assistant", content: "mock summary" },
          finish_reason: "stop",
        },
      ],
    }),
  ),
];
