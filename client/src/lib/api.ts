import type { ApiResult } from 'shared';

export class ApiError extends Error {
  readonly code: string;
  readonly status?: number;

  constructor(code: string, message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    throw new ApiError('PARSE_FAILED', `response was not JSON (status ${res.status})`, res.status);
  }

  const envelope = body as ApiResult<T>;

  if (!res.ok || envelope.error) {
    throw new ApiError(
      envelope.error?.code ?? 'HTTP_ERROR',
      envelope.error?.message ?? `HTTP ${res.status}`,
      res.status,
    );
  }

  return envelope.data as T;
}
