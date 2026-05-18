import type { ErrorRequestHandler, RequestHandler } from "express";

export type ErrorResponseBody = {
  message: string;
  details?: unknown;
};

export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

function isHttpStatusCode(value: number) {
  return value >= 400 && value < 600;
}

function getErrorStatusCode(error: unknown) {
  if (error instanceof HttpError && isHttpStatusCode(error.statusCode)) {
    return error.statusCode;
  }

  if (typeof error === "object" && error !== null) {
    const statusError = error as { status?: unknown; statusCode?: unknown };
    const statusCode =
      typeof statusError.statusCode === "number"
        ? statusError.statusCode
        : statusError.status;

    if (typeof statusCode === "number" && isHttpStatusCode(statusCode)) {
      return statusCode;
    }
  }

  return 500;
}

function getErrorMessage(error: unknown, statusCode: number) {
  if (error instanceof HttpError) {
    return error.message;
  }

  if (statusCode === 400) {
    return "Invalid request";
  }

  if (statusCode === 404) {
    return "Route not found";
  }

  return "Internal server error";
}

export const notFoundHandler: RequestHandler = (_req, _res, next) => {
  next(new HttpError(404, "Route not found"));
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  const statusCode = getErrorStatusCode(error);
  const responseBody: ErrorResponseBody = {
    message: getErrorMessage(error, statusCode),
  };

  if (error instanceof HttpError && error.details !== undefined) {
    responseBody.details = error.details;
  }

  res.status(statusCode).json(responseBody);
};
