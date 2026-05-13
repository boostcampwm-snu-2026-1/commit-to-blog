import type { RequestHandler } from "express";
import { ApiError } from "../lib/ApiError.js";

export const notFound: RequestHandler = (req, _res, next) => {
  next(ApiError.notFound(`경로를 찾을 수 없습니다: ${req.method} ${req.path}`));
};
