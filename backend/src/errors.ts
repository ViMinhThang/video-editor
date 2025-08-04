import { Express, ErrorRequestHandler } from "express";
import { getConfig } from "./config";

export const createErrorHandlers = (app: Express) => {
  // 404 Handler
  app.use((req, res) => {
    res.status(404);
    res.render("error", { message: "Not Found", status: 404 });
  });

  const handler: ErrorRequestHandler = (error, req, res, next) => {
    console.error("Server Error:", error);
    if (res.headersSent) {
      return next(error);
    }
    res.status(500).json({
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  };

  app.use(handler);
};
