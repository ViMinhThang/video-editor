import feathersExpress, { rest } from "@feathersjs/express";
import { feathers } from "@feathersjs/feathers";
import { ProjectWebService } from "./projects_api";
import { FeathersWrapper } from "./feathers_adapter";
import { Express, Request, Response } from "express";
import { TrackWebService } from "./tracks_api";
import { track_repo } from "../data";

export const createFeathersServices = (app: Express) => {
  app.get(
    "/api/projects/:project_id/tracks-preview",
    async (req: Request, res: Response) => {
      try {
        const project_id = parseInt(req.params.project_id, 10);
        const data = await track_repo.getTracksWithOneItem(project_id);
        res.json(data);
      } catch (err) {
        console.log("error" + err);
      }
    }
  );

  const feathersApp = feathersExpress(feathers(), app).configure(rest());

  const projectService = new ProjectWebService();
  const trackService = new TrackWebService();
  feathersApp.use("/api/projects", new FeathersWrapper(projectService));
  feathersApp.use("/api/tracks", new FeathersWrapper(trackService));

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
