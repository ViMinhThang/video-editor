import feathersExpress, { rest } from "@feathersjs/express";
import { feathers } from "@feathersjs/feathers";
import { ProjectWebService } from "./rest/projects_api";
import { FeathersWrapper } from "./feathers_adapter";
import { Express, Request, Response } from "express";
import { TrackWebService } from "./rest/tracks_api";
import { asset_repo } from "../data";
import { AssetsWebService } from "./rest/assets_api";
import { TrackItemWebService } from "./rest/track_items_api";
export const createFeathersServices = (app: Express) => {
  app.get(
    "/api/projects/:project_id/assets",
    async (req: Request, res: Response) => {
      try {
        const project_id = parseInt(req.params.project_id, 10);
        const data = await asset_repo.getAssets({ projectId: project_id });
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
  const trackItemWebService = new TrackItemWebService();
  feathersApp.use("/api/projects", new FeathersWrapper(projectService));
  feathersApp.use("/api/tracks", new FeathersWrapper(trackService));
  feathersApp.use("/api/assets", new FeathersWrapper(assetsWebService));
  feathersApp.use("/api/trackItems", new FeathersWrapper(trackItemWebService));
  feathersApp.hooks({
    error: {
      all: [
        (ctx) => {
          if (ctx.error) {
            // In ra thông tin lỗi đầy đủ
            console.error("Feathers error hook:", {
              message: ctx.error.message,
              name: ctx.error.name,
              code: ctx.error.code,
              data: ctx.error.data,
              stack: ctx.error.stack,
            });

            // Nếu muốn trả về status 400 thay vì mặc định
            ctx.http = { status: 400 };

            // Nếu muốn custom lại message cho client
            ctx.error = {
              ...ctx.error,
              message: ctx.error.message || "Something went wrong",
            };
          }
        },
      ],
    },
  });
};
