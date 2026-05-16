import type { ErrorRequestHandler } from "express";
import { AppError } from "@/error/index.js";

export const errorHandler: ErrorRequestHandler = async (
  err,
  _req,
  res,
  _next,
) => {
  const error = err instanceof AppError ? err.code : "INTERNAL_SERVER_ERROR";
  const message =
    err instanceof AppError ? err.message : "Internal Server Error";
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  res.status(statusCode).json({
    error,
    message,
  });
};
