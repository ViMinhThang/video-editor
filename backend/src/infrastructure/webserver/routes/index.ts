import { createProjectRoutes } from "./project";
import { createTrackItemRoutes } from "./track_item";
import { Express, Request, Response } from "express";
import { createUploadRoutes } from "./upload/upload_routes";
import { createAssetRoutes } from "./assets/createAssetRoutes";
import { createTrackRestApi } from "./track/rest";

export const createRoutes = (app: Express) => {
  createProjectRoutes(app);
  createTrackItemRoutes(app);
  createUploadRoutes(app);
  createAssetRoutes(app);
  createAssetRoutes(app);
  createTrackRestApi(app);
};
