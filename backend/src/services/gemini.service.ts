import { env } from "../config/env.js";
import { HttpError } from "../middleware/error.middleware.js";
import type { CommitSummary, RepositorySummary } from "./github.normalizer.js";

export type GeneratedDraft = {
  title: string;
  summary: string;
  content: string;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    message?: string;
  };
};

type GenerateDraftInput = {
  repository: RepositorySummary;
  branch: string;
  commits: CommitSummary[];
};

const GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const GEMINI_MODEL = "gemini-2.5-flash";

function buildPrompt({ repository, branch, commits }: GenerateDraftInput) {
  const commitLines = commits
    .map(
      (commit, index) =>
        `${index + 1}. ${commit.sha} | ${commit.message} | ${commit.authorName} | ${commit.authorDate}`,
    )
    .join("\n");

  return [
    "You are writing a development blog draft.",
    "Return valid JSON only with title, summary, and content fields.",
    "Keep the summary concise and the content readable for a technical blog post.",
    `Repository: ${repository.fullName}`,
    `Branch: ${branch}`,
    "Commits:",
    commitLines,
  ].join("\n");
}

function extractDraftText(response: GeminiResponse) {
  const text = response.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();

  return text ?? "";
}

function parseStrictJson(text: string) {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new HttpError(502, "Gemini returned an invalid draft response");
  }
}

function parseDraft(text: string): GeneratedDraft {
  const parsed = parseStrictJson(text);

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    typeof (parsed as Partial<GeneratedDraft>).title !== "string" ||
    typeof (parsed as Partial<GeneratedDraft>).summary !== "string" ||
    typeof (parsed as Partial<GeneratedDraft>).content !== "string"
  ) {
    throw new HttpError(502, "Gemini returned an invalid draft response");
  }

  return {
    title: (parsed as GeneratedDraft).title,
    summary: (parsed as GeneratedDraft).summary,
    content: (parsed as GeneratedDraft).content,
  };
}

export async function generateBlogDraft(input: GenerateDraftInput) {
  const response = await fetch(
    `${GEMINI_API_BASE_URL}/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "x-goog-api-key": env.geminiApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: buildPrompt(input),
              },
            ],
          },
        ],
        generationConfig: {
          responseFormat: {
            text: {
              mimeType: "application/json",
              schema: {
                type: "object",
                additionalProperties: false,
                properties: {
                  title: {
                    type: "string",
                    description: "The title of the development blog draft.",
                  },
                  summary: {
                    type: "string",
                    description: "A concise summary of the development blog draft.",
                  },
                  content: {
                    type: "string",
                    description: "The body content of the development blog draft.",
                  },
                },
                required: ["title", "summary", "content"],
              },
            },
          },
        },
      }),
    },
  );

  if (!response.ok) {
    let message = "Gemini request failed";

    try {
      const body = (await response.json()) as GeminiResponse;
      if (typeof body.error?.message === "string" && body.error.message.trim() !== "") {
        message = body.error.message;
      }
    } catch {
      // Keep the generic message if Gemini does not return JSON.
    }

    throw new HttpError(
      response.status >= 500 ? 502 : response.status,
      response.status === 401 || response.status === 403
        ? `Gemini API access denied: ${message}`
        : message,
    );
  }

  const body = (await response.json()) as GeminiResponse;
  const draftText = extractDraftText(body);

  if (!draftText) {
    throw new HttpError(502, "Gemini returned an empty draft response");
  }

  return parseDraft(draftText);
}
