type ApiErrorResponse = {
  message?: unknown;
};

export async function readApiError(
  response: Response,
  fallbackMessage: string,
) {
  try {
    const body = (await response.json()) as ApiErrorResponse;

    if (typeof body.message === "string" && body.message.trim() !== "") {
      return body.message;
    }
  } catch {
    // Keep the fallback when the response body is empty or not JSON.
  }

  return fallbackMessage;
}

export function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error && error.message.trim() !== "") {
    return error.message;
  }

  return fallbackMessage;
}
