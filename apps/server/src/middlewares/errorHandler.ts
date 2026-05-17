import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import type { ApiErrorBody } from "@commit-to-blog/shared";
import { ApiError } from "../lib/ApiError.js";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ApiError) {
    const body: ApiErrorBody = {
      error: { code: err.code, message: err.message, details: err.details },
    };
    res.status(err.statusCode).json(body);
    return;
  }

  if (err instanceof ZodError) {
    const body: ApiErrorBody = {
      error: {
        code: "BAD_REQUEST",
        message: "요청 형식이 올바르지 않습니다.",
        details: err.flatten(),
      },
    };
    res.status(400).json(body);
    return;
  }

  if (err instanceof Error && err.message === "GITHUB_TOKEN_MISSING") {
    const body: ApiErrorBody = {
      error: {
        code: "GITHUB_AUTH_FAILED",
        message: "GITHUB_TOKEN이 설정되지 않았습니다. .env를 확인해주세요.",
      },
    };
    res.status(401).json(body);
    return;
  }

  console.error("[unhandled-error]", err);
  const body: ApiErrorBody = {
    error: {
      code: "INTERNAL_ERROR",
      message: "예상치 못한 오류가 발생했습니다.",
    },
  };
  res.status(500).json(body);
};
