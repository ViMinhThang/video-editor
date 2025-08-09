import feathersExpress, { rest } from "@feathersjs/express";
import { feathers } from "@feathersjs/feathers";
import { ProjectWebService } from "./services/projects_api";
import { FeathersWrapper } from "./feathers_adapter";
import { Express, Request, Response } from "express";
import { TrackWebService } from "./services/tracks_api";
import { asset_repo } from "../data";
import { AssetsWebService } from "./services/assets_api";
export const createFeathersServices = (app: Express) => {
  app.get(
    "/api/projects/:project_id/assets",
    async (req: Request, res: Response) => {
      try {
        const project_id = parseInt(req.params.project_id, 10);
        const data = await asset_repo.getAssets({ project_id });
        res.json(data);
      } catch (err) {
        console.log("error" + err);
      }
    }
  );

  const feathersApp = feathersExpress(feathers(), app).configure(rest());

  const projectService = new ProjectWebService();
  const trackService = new TrackWebService();
  const assetsWebService = new AssetsWebService();
  feathersApp.use("/api/projects", new FeathersWrapper(projectService));
  feathersApp.use("/api/tracks", new FeathersWrapper(trackService));
  feathersApp.use("/api/assets", new FeathersWrapper(assetsWebService));
  feathersApp.hooks({
    error: {
      all: [
        (ctx) => {
          if (ctx.error) {
            ctx.http = { status: 400 };
          }
        },
      ],
    },
  });
};
