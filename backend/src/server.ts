import "express-async-errors";
import { createServer } from "http";
import express, { Express } from "express";
import { getConfig } from "./config";
import helmet from "helmet";
import { createErrorHandlers } from "./middleware/error-handler";
import { createApiRoutes } from "./routes";
import { createUploadRoutes } from "./routes/upload_routes";
import path from "path";
import cors from "cors";
import { createStateRoutes } from "./routes/get_state_project";
import {
  createCutRoute,
  createDownloadRoute,
  createTrackExportRoute,
  createUpdateTextRoute,
} from "./routes/track_item_routes";

const port = getConfig("http:port", 3000);

const expressApp: Express = express();

expressApp.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));

expressApp.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

console.log("Serving uploads from:", path.join(__dirname, "../uploads"));
expressApp.use("/uploads", express.static(path.join(__dirname, "../uploads")));
createApiRoutes(expressApp);
createUpdateTextRoute(expressApp);
createUploadRoutes(expressApp);
createDownloadRoute(expressApp);
createTrackExportRoute(expressApp);
createStateRoutes(expressApp);
createCutRoute(expressApp);
createErrorHandlers(expressApp);

const server = createServer(expressApp);

server.listen(port, () => console.log(`HTTP Server listening on port ${port}`));
