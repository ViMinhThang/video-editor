import { ProjectWebService } from "../controllers/projects_api";
import { Express, Request, Response, Router } from "express";
import { TrackWebService } from "../controllers/tracks_api";
import { asset_repo } from "../infrastructure/repositories";
import { AssetsWebService } from "../controllers/assets_api";
import { TrackItemWebService } from "../controllers/track_items_api";
import { ExpressController } from "../controllers/express_adapter";
import { WebService } from "../controllers/web_service";

const registerWebService = <T>(router: Router, path: string, service: WebService<T>) => {
  const controller = new ExpressController(service);
  router.get(path, controller.getMany);
  router.post(path, controller.store);
  router.get(`${path}/:id`, controller.getOne);
  router.put(`${path}/:id`, controller.replace);
  router.patch(`${path}/:id`, controller.modify);
  router.delete(`${path}/:id`, controller.delete);
};

export const createApiRoutes = (app: Express) => {
  const apiRouter = Router();

  apiRouter.get(
    "/projects/:project_id/assets",
    async (req: Request, res: Response) => {
      try {
        const project_id = parseInt(req.params.project_id, 10);
        const data = await asset_repo.getAssets({ projectId: project_id });
        res.json(data);
      } catch (err) {
        console.error("Error fetching project assets:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  );

  registerWebService(apiRouter, "/projects", new ProjectWebService());
  registerWebService(apiRouter, "/tracks", new TrackWebService());
  registerWebService(apiRouter, "/assets", new AssetsWebService());
  registerWebService(apiRouter, "/trackItems", new TrackItemWebService());

  app.use("/api", apiRouter);
};
