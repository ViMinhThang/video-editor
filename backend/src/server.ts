import { createServer } from "http";
import express, { Express } from "express";
import { getConfig } from "./config";
import helmet from "helmet";
import { createErrorHandlers } from "./errors";
import { createFeathersServices } from "./api";
import { createUploadRoutes } from "./api/custom/upload_routes";
import path from "path";
import { cors } from "@feathersjs/express";
import { createStateRoutes } from "./api/custom/get_state_project";

const port = getConfig("http:port", 3000);

const expressApp: Express = express();

expressApp.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));

expressApp.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

console.log("Serving uploads from:", path.join(__dirname, "../uploads"));
expressApp.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);
createFeathersServices(expressApp);
createUploadRoutes(expressApp);
createStateRoutes(expressApp)
createErrorHandlers(expressApp);

const server = createServer(expressApp);

server.listen(port, () => console.log(`HTTP Server listening on port ${port}`));
