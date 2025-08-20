// src/interface/routes/project_routes.ts
import { Express, Request, Response } from "express";
import { ProjectUseCases } from "../../../../../application/usecases/ProjectUseCases";

export const createProjectRestApi = (app: Express) => {
  // Lấy nhiều project
  app.get("/api/projects", async (req: Request, res: Response) => {
    try {
      const { user_id, limit } = req.query;
      const projects = await ProjectUseCases.getProjects(
        user_id ? Number(user_id) : undefined,
        limit ? Number(limit) : undefined
      );
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Lấy 1 project
  app.get("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const project = await ProjectUseCases.getProjectById(id);
      if (!project) return res.status(404).json({ message: "Project not found" });
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Tạo project mới
  app.post("/api/projects", async (req: Request, res: Response) => {
    try {
      const { title, user_id } = req.body;
      if (!title || !user_id) {
        return res.status(400).json({ message: "Missing title or user_id" });
      }
      const project = await ProjectUseCases.createProject(title, Number(user_id));
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update project
  app.put("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { title } = req.body;
      const project = await ProjectUseCases.updateProject(id, title);
      if (!project) return res.status(404).json({ message: "Project not found" });
      res.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Xóa project
  app.delete("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const success = await ProjectUseCases.deleteProject(id);
      if (!success) return res.status(404).json({ message: "Project not found" });
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
};
