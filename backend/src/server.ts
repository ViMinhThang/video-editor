import { createServer } from "http";
import express, { Express } from "express";
import { getConfig } from "./config";
import helmet from "helmet";
import { createErrorHandlers } from "./errors";
import { createRoutes } from "./routes";

const port = getConfig("http:port", 3000);

const expressApp: Express = express();

expressApp.use(helmet());
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));

createRoutes(expressApp);

createErrorHandlers(expressApp);

const server = createServer(expressApp);

server.listen(port, () => console.log(`HTTP Server listening on port ${port}`));
