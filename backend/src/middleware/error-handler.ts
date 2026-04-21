import { Express, ErrorRequestHandler } from "express";
import { AppError, ValidationError } from "../utils/errors";

export const createErrorHandlers = (app: Express) => {
  // 404 Handler
  app.use((req, res, next) => {
    res.status(404).json({ error: { message: "Route Not Found", code: 404 } });
  });

  const handler: ErrorRequestHandler = (error, req, res, next) => {
    if (res.headersSent) {
      return next(error);
    }

    if (error instanceof ValidationError) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
          code: error.statusCode,
          details: error.details,
        },
      });
    }

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
          code: error.statusCode,
        },
      });
    }

    console.error("Unhandled Server Error:", error);
    res.status(500).json({
      error: {
        message: "Internal Server Error",
        code: 500,
        ...(process.env.NODE_ENV === "development" && { details: error.message || error }),
      },
    });
  };

  app.use(handler);
};
