import { Express } from "express";
import { video_repository } from "../data";

export const createVideoRoutes = (app: Express) => {
  app.get("/api/projects", async (req, res) => {
    const user_id = req.query.user_id;
    const result = await video_repository.getProjects({ user_id });
    res.status(200).json(result);
  });
  app.post("/api/projects", async (req, res) => {
    const user_id = 1;
    const title = req.body.title;
    const result = await video_repository.storeProject({ user_id, title });
    if (result) {
      res.status(200).json({ message: "Create successfully" });
    } else {
      res.status(400);
    }
  });
};
