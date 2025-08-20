import { Express, Request, Response } from "express";
import { UpdateTrackItemUseCase } from "../../../../../application/usecases/UpdateTrackItemUseCase";

export const createUpdateTextRoute = (app: Express) => {
  app.put("/api/track-item/:id", async (req: Request, res: Response) => {
    try {
      const track = { ...req.body, id: Number(req.params.id) };

      const track_item = await UpdateTrackItemUseCase.execute(track);

      res.status(200).json({
        message: "Track item updated",
        track_item,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Internal server error" });
    }
  });
};
