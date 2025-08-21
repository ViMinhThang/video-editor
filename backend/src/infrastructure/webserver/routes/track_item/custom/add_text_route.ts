import { Express, Request, Response } from "express";
import { track_repo } from "../../../../../domain";
import { AddTextItemUseCase } from "../../../../../application/usecases/AddTextUseCase";
export const createAddTextItem = (app: Express) => {
  app.post("/api/track-item/add-text", async (req: Request, res: Response) => {
    try {
      const { time, asset_id, project_id } = req.body;
      console.log(req.body)
      const created = await AddTextItemUseCase.add(time, asset_id, project_id);
      res.status(201).json({ message: "succeed", item: created });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  });
};
