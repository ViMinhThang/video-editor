import { Express, Request, Response } from "express";
import { TrackItemService } from "../services/TrackItemService";
import { validateRequest } from "../middleware/validate";
import { cutTrackSchema, downloadTrackItemSchema, exportProjectSchema, updateTrackSchema } from "../dtos/track_item.dto";
import fs from "fs/promises";

export const createCutRoute = (app: Express) => {
  const service = new TrackItemService();
  app.post(
    "/api/track-item/cut-track-item",
    validateRequest(cutTrackSchema),
    async (req: Request, res: Response) => {
      const { currentTime } = req.body;
      const result = await service.cutTrackItem(currentTime);
      res.json({
        message: "Track item cut successfully",
        parts: result.parts,
      });
    }
  );
};

export const createDownloadRoute = (app: Express) => {
  const service = new TrackItemService();
  app.get(
    "/api/track-item/download",
    validateRequest(downloadTrackItemSchema),
    async (req: Request, res: Response) => {
      const track_item_id = Number(req.query.track_item_id);
      const { outputPath, originalName } = await service.downloadTrackItem(track_item_id);

      res.download(outputPath, originalName, async (err) => {
        if (err) console.error("Download error:", err);
        try {
          await fs.unlink(outputPath);
        } catch (e) {
          console.error("Cleanup error:", e);
        }
      });
    }
  );
};

export const createTrackExportRoute = (app: Express) => {
  const service = new TrackItemService();
  app.get(
    "/api/track-item/export",
    validateRequest(exportProjectSchema),
    async (req: Request, res: Response) => {
      const projectId = Number(req.query.projectId);
      const { finalOutput, downloadName, cleanupPaths, tempDir } = await service.exportProject(projectId);

      res.download(finalOutput, downloadName, async (err) => {
        if (err) console.error("Export download error:", err);
        try {
          for (const p of cleanupPaths) await fs.unlink(p).catch(() => {});
          await fs.rmdir(tempDir).catch(() => {});
        } catch (error) {
          console.error("Cleanup error:", error);
        }
      });
    }
  );
};

export const createUpdateTextRoute = (app: Express) => {
  const service = new TrackItemService();
  app.put(
    "/api/track-item/:id",
    validateRequest(updateTrackSchema),
    async (req: Request, res: Response) => {
      const track = req.body;
      track.id = Number(req.params.id);
      const track_item = await service.updateTrackItem(track);
      res.status(200).json({ message: "updated track", track_item });
    }
  );
};
