type ApiErrorBody = {
  code?: string;
  message?: string;
};

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const requestJson = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });

  const body = await response.json().catch(() => ({})) as ApiErrorBody;

  if (!response.ok) {
    throw new ApiError(
      response.status,
      body.code ?? "REQUEST_FAILED",
      body.message ?? "요청을 처리하지 못했습니다.",
    );
  }

  return body as T;
};
