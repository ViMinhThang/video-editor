import { Express, Request, Response } from "express";
import { CutTrackUseCase } from "../../../../../application/usecases/CutTrackUseCase";

export const createCutTrackItem = (app: Express) => {
  app.post(
    "/api/track-item/cut-track-item",
    async (req: Request, res: Response) => {
      try {
        const { currentTime } = req.body;

        if (typeof currentTime !== "number" || isNaN(currentTime)) {
          return res.status(400).json({ error: "Invalid currentTime" });
        }

        const result = await CutTrackUseCase.execute(currentTime);
        return res.status(200).json(result);
      } catch (error: any) {
        console.error("CutTrack error:", error);
        return res.status(500).json({ error: error.message });
      }
    }
  );
};
