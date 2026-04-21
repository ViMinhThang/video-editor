import { Express, Request, Response } from "express";
import { ProjectService } from "../services/ProjectService";
import { validateRequest } from "../middleware/validate";
import { getProjectStateSchema } from "../dtos/project.dto";

export const createStateRoutes = (app: Express) => {
  const service = new ProjectService();

  app.get(
    "/api/projects/:projectId/full",
    validateRequest(getProjectStateSchema),
    async (req: Request, res: Response) => {
      const projectId = Number(req.params.projectId);
      const data = await service.getFullProjectState(projectId);
      return res.status(200).json(data);
    }
  );
};
