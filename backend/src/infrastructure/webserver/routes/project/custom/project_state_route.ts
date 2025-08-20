// src/infrastructure/webserver/routes/project_state_routes.ts
import { Express, Request, Response } from "express";
import { ProjectStateService } from "../../../../../application/services/ProjectStateService";

export const createGetStateProject = (app: Express) => {
  app.get("/api/projects/:projectId/full", async (req: Request, res: Response) => {
    try {
      const projectId = Number(req.params.projectId);
      if (isNaN(projectId)) {
        return res.status(400).json({ error: "Invalid projectId" });
      }

      const dto = await ProjectStateService.getFullProjectState(projectId);
      return res.status(200).json(dto);
    } catch (err: any) {
      console.error("Error fetching project state:", err);
      if (err.message === "ProjectNotFound") {
        return res.status(404).json({ error: "Project not found" });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  });
};
