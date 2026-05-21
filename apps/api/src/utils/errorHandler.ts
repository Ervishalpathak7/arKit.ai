import type { ErrorRequestHandler } from "express";
import { AppError, InvalidRequest } from "@/error/index.js";
import { log } from "@/config/logger.js";

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


  // Sending the Response
  res.status(statusCode).json({
    error,
    message,
  });

  // Centralised Logging for req-errors
  if (err instanceof AppError) {
    if (err instanceof InvalidRequest) {
      log.error(
        { type: err.name, field: err.field },
        `Invalid Request : ${err.message}`,
      );
    } else {
      log.error({ type: err.name }, `App Error : ${err.message}`);
    }
  } else {
    log.error({ type: "unknown" }, `Unknown error : ${err}`);
  }
};
