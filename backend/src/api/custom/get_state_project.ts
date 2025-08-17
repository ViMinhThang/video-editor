import { Express, Request, Response } from "express";
import { asset_repo, project_repo, track_repo, video_repo } from "../../data";
import { Asset, TrackItem } from "../../data/models/track_items_models";
import {
  assetsWithTrackItems,
  videoFrame,
} from "../../data/models/video_frame_models";

export const createStateRoutes = (app: Express) => {
  app.get(
    "/api/projects/:projectId/full",
    async (req: Request, res: Response) => {
      try {
        const projectId = Number(req.params.projectId);
        if (isNaN(projectId)) {
          return res.status(400).json({ error: "Invalid projectId" });
        }

        // Lấy project
        const project = await project_repo.getProjectById(projectId);
        if (!project) {
          return res.status(404).json({ error: "Project not found" });
        }

        // Lấy assets
        const assets: Asset[] = await asset_repo.getAssets({ projectId });

        // Lấy track items
        const track_items: TrackItem[] =
          await track_repo.getTrackItemsByProjectId({ projectId });

        // Lấy video frames cho mỗi track item
        const track_items_with_frames: assetsWithTrackItems[] = [];
        for (const trackItem of track_items) {
          if (!trackItem.id) continue;
          const video_frames = await video_repo.getVideoFramesByTrackItemId(
            trackItem.id
          );
          track_items_with_frames.push({
            ...trackItem,
            video_frames,
          });
        }
        const assetsWithTrackItems = assets.map((asset) => ({
          ...asset,
          track_items: track_items_with_frames.filter(
            (ti) => ti.asset_id === asset.id
          ),
        }));
          
        return res.status(200).json({ assets: assetsWithTrackItems });
      } catch (err) {
        console.error("Error fetching project state:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );
};
