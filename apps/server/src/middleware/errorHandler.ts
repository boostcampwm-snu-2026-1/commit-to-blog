import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "ValidationError",
      details: err.flatten(),
    });
    return;
  }

  const status = typeof err?.status === "number" ? err.status : 500;
  const message = err?.message ?? "Internal Server Error";

  if (status >= 500) {
    console.error("[error]", err);
  }

  res.status(status).json({ error: message });
};
