import type { ApiErrorCode } from "@commit-to-blog/shared";

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: ApiErrorCode,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }

  static badRequest(message: string, details?: unknown): ApiError {
    return new ApiError(400, "BAD_REQUEST", message, details);
  }

  static notFound(message = "리소스를 찾을 수 없습니다."): ApiError {
    return new ApiError(404, "NOT_FOUND", message);
  }

  static githubAuthFailed(message = "GitHub 토큰이 유효하지 않습니다."): ApiError {
    return new ApiError(401, "GITHUB_AUTH_FAILED", message);
  }

  static internal(message = "예상치 못한 오류가 발생했습니다.", details?: unknown): ApiError {
    return new ApiError(500, "INTERNAL_ERROR", message, details);
  }
}
