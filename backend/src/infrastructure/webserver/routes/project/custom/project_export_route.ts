// src/infrastructure/webserver/routes/track_export_route.ts
import { Express, Request, Response } from "express";
import fs from "fs/promises"
import { ExportProjectUseCase } from "../../../../../application/usecases/ExportProjectUseCase";
export const createTrackExportRoute = (app: Express) => {
  app.get("/api/track-item/export", async (req: Request, res: Response) => {
    try {
      const { projectId } = req.query;
      if (!projectId) return res.status(400).send("projectId required");

      const filePath = await ExportProjectUseCase.execute(Number(projectId));

      const downloadName = `project_${projectId}.mp4`;
      res.download(filePath, downloadName, async (err) => {
        if (err) console.error(err);

        // dọn file sau khi tải xong
        try {
          await fs.unlink(filePath);
        } catch {}
      });
    } catch (err: any) {
      console.error(err);
      if (err.message === "TrackItemsNotFound")
        return res.status(404).send("Track item not found");
      if (err.message === "NoVideoToExport")
        return res.status(400).send("No video to export");
      return res.status(500).send("Internal server error");
    }
  });
};
