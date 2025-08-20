
import { Express, Request, Response } from "express";
import { createProjectRestApi } from "./rest/rest";
import { createTrackExportRoute } from "./custom/project_export_route";
import { createGetStateProject } from "./custom/project_state_route";

export const createProjectRoutes = (app: Express) => {
  createProjectRestApi(app);
  createGetStateProject(app);
  createTrackExportRoute(app);
};
