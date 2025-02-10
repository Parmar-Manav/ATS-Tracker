import { constants } from "../constants.js";

export const errorHandler = (err, req, res, next) => {
  // console.error("Error caught:", err);
  const statusCode =
    err.status || res.statusCode || constants.INTERNAL_SERVER_ERROR;

  switch (statusCode) {
    case constants.NOT_FOUND:
      return res.status(statusCode).json({
        title: "NOT FOUND",
        message: err.message,
        stackTrace: err.stack,
      });
    case constants.VALIDATION_ERROR:
      return res.status(statusCode).json({
        title: "Validation Failed",
        message: err.message,
        stackTrace: err.stack,
      });
    case constants.UNAUTHORIZED:
      return res.status(statusCode).json({
        title: "UNAUTHORIZED",
        message: err.message,
        stackTrace: err.stack,
      });
    case constants.FORBIDDEN:
      return res.status(statusCode).json({
        title: "FORBIDDEN",
        message: err.message,
        stackTrace: err.stack,
      });
    default:
      return res.status(statusCode).json({
        title: "INTERNAL_SERVER_ERROR",
        message: err.message,
        stackTrace: err.stack,
      });
  }
};
