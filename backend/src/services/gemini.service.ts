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
  repository: Pick<RepositorySummary, "owner" | "name" | "fullName">;
  branch: string;
  commits: CommitSummary[];
};

const GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const GEMINI_MODEL = "gemini-2.5-flash";

function ensureString(value: unknown, fieldName: string) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new HttpError(400, "Invalid request body", {
      field: fieldName,
    });
  }

  return value;
}

function ensureRepository(value: unknown) {
  if (typeof value !== "object" || value === null) {
    throw new HttpError(400, "Invalid request body", {
      field: "repository",
    });
  }

  const repository = value as Partial<RepositorySummary>;

  return {
    owner: ensureString(repository.owner, "repository.owner"),
    name: ensureString(repository.name, "repository.name"),
    fullName: ensureString(repository.fullName, "repository.fullName"),
  };
}

function ensureCommits(value: unknown) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new HttpError(400, "Invalid request body", {
      field: "commits",
    });
  }

  return value.map((commit, index) => {
    if (typeof commit !== "object" || commit === null) {
      throw new HttpError(400, "Invalid request body", {
        field: `commits[${index}]`,
      });
    }

    const input = commit as Partial<CommitSummary>;

    return {
      sha: ensureString(input.sha, `commits[${index}].sha`),
      message: ensureString(input.message, `commits[${index}].message`),
      authorName: ensureString(
        input.authorName,
        `commits[${index}].authorName`,
      ),
      authorDate: ensureString(
        input.authorDate,
        `commits[${index}].authorDate`,
      ),
      htmlUrl: ensureString(input.htmlUrl, `commits[${index}].htmlUrl`),
    };
  });
}

export function parseGenerateDraftInput(body: unknown): GenerateDraftInput {
  if (typeof body !== "object" || body === null) {
    throw new HttpError(400, "Invalid request body");
  }

  return {
    repository: ensureRepository(
      (body as { repository?: unknown }).repository,
    ),
    branch: ensureString((body as { branch?: unknown }).branch, "branch"),
    commits: ensureCommits((body as { commits?: unknown }).commits),
  };
}

function buildCommitContext(commits: CommitSummary[]) {
  if (commits.length === 0) {
    return ["Commits:", "- No commits were selected."].join("\n");
  }

  return [
    "Commits:",
    ...commits.map((commit, index) => {
      const lines = [
        `${index + 1}. sha: ${commit.sha}`,
        `   message: ${commit.message}`,
        `   author: ${commit.authorName}`,
        `   date: ${commit.authorDate}`,
        `   url: ${commit.htmlUrl}`,
      ];

      return lines.join("\n");
    }),
  ].join("\n");
}

export function buildPrompt({ repository, branch, commits }: GenerateDraftInput) {
  return [
    "You are writing a development blog draft from GitHub repository activity.",
    "Return valid JSON only with title, summary, and content fields.",
    "Use only the provided repository, branch, and commit context.",
    "Write a specific, technical draft that explains what changed and why it matters.",
    "Keep the summary concise and the content readable for a development blog audience.",
    "Repository context:",
    `- owner: ${repository.owner}`,
    `- name: ${repository.name}`,
    `- full name: ${repository.fullName}`,
    "Branch context:",
    `- name: ${branch}`,
    buildCommitContext(commits),
    "Title guidance: concise and specific.",
    "Summary guidance: one short paragraph.",
    "Content guidance: explain the feature work, implementation steps, and noteworthy details in a blog-friendly structure.",
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
  let response: Response;

  try {
    response = await fetch(
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
                      description:
                        "A concise summary of the development blog draft.",
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
  } catch {
    throw new HttpError(502, "Gemini request failed");
  }

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

  let body: GeminiResponse;

  try {
    body = (await response.json()) as GeminiResponse;
  } catch {
    throw new HttpError(502, "Gemini returned an invalid draft response");
  }

  const draftText = extractDraftText(body);

  if (!draftText) {
    throw new HttpError(502, "Gemini returned an empty draft response");
  }

  return parseDraft(draftText);
}
