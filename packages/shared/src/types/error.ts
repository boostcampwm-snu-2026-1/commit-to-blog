export type ApiErrorCode =
  | "BAD_REQUEST"
  | "NOT_FOUND"
  | "GITHUB_AUTH_FAILED"
  | "GITHUB_RATE_LIMITED"
  | "LLM_FAILED"
  | "LLM_CONTEXT_TOO_LARGE"
  | "INTERNAL_ERROR";

export type ApiErrorBody = {
  error: {
    code: ApiErrorCode;
    message: string;
    details?: unknown;
  };
};
