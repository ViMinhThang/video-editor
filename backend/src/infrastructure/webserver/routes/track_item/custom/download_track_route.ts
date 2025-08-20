import { Express, Request, Response } from "express";
import fs from "fs/promises";
import { DownloadTrackUseCase } from "../../../../../application/usecases/DownloadTrackUseCase";

export const createDownloadTrack = (app: Express) => {
  app.get("/api/track-item/download", async (req: Request, res: Response) => {
    try {
      const { track_item_id } = req.query;
      if (!track_item_id) {
        return res.status(400).send("Missing track_item_id");
      }

      const { outputPath, assetName } = await DownloadTrackUseCase.execute(
        Number(track_item_id)
      );

      res.download(outputPath, assetName, async (err) => {
        if (err) {
          console.error("Download error:", err);
          res.status(500).send("Failed to download file");
        } else {
          try {
            await fs.unlink(outputPath);
          } catch (err) {
            console.log("Cleanup error:", err);
          }
        }
      });
    } catch (err) {
      console.error("Error in download route:", err);
      res.status(500).send("Internal server error");
    }
  });
};
