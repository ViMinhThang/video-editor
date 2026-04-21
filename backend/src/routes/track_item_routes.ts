import { Express, Request, Response } from "express";
import { asset_repo, track_repo, video_repo } from "../infrastructure/repositories";
import FF from "../../lib/FF";
import { Asset, TrackItem } from "../domain/interfaces/track_items_models";
import os from "os"
import { calculateNumbFrames } from "../../lib/util";
import fs from "fs/promises";
import path from "path";
export const createCutRoute = (app: Express) => {
  app.post(
    "/api/track-item/cut-track-item",
    async (req: Request, res: Response) => {
      const { currentTime } = req.body;
      const track_item = await track_repo.getTrackByTime(currentTime);
      
      if (!track_item) {
        return res
          .status(404)
          .json({ error: `No track item found at time ${currentTime}` });
      }

      // 1. Validate track item data
      if (
        track_item.asset_id == null ||
        track_item.start_time == null ||
        track_item.end_time == null ||
        track_item.id == null
      ) {
        return res.status(400).json({ error: "Invalid track item data" });
      }

      // 2. Get original file path
      const assetPath = await asset_repo.getAssetPath(track_item.asset_id);
      if (!assetPath) {
        return res
          .status(404)
          .json({ error: `Asset not found for id ${track_item.asset_id}` });
      }

      // 3. (Optional) Accurate video cutting would happen here

      // 4. Split into two track items
      const originalEnd = track_item.end_time;

      // Update the first track item
      track_item.end_time = currentTime;
      await track_repo.storeTrackItem(track_item);

      // Create a new track item for the second part
      const new_track_item: TrackItem = {
        project_id: track_item.project_id,
        track_id: track_item.track_id,
        asset_id: track_item.asset_id,
        start_time: currentTime,
        end_time: originalEnd,
      };
      const created = await track_repo.storeTrackItem(new_track_item);
      await track_repo.storeTrackItem(track_item);

      const startIndex = calculateNumbFrames(
        currentTime - track_item.start_time
      );

      const allFrames = await video_repo.getVideoFramesByTrackItemId(
        track_item.id
      );
      if (allFrames && created.id != null) {
        const framesForNew = allFrames.slice(startIndex);
        const ids = framesForNew
          .map((f) => f.id)
          .filter((id): id is number => id !== undefined);
        await video_repo.updateFramesTrackItemId(ids, created.id);
      }

      // 5. Return results
      return res.json({
        message: "Track item cut successfully",
        parts: [track_item, new_track_item],
      });
      // } catch (err) {
      //   console.error("Error cutting track item:", err);
      //   return res.status(500).json({ error: "Internal server error" });
      // }
    }
  );
};
export const createDownloadRoute = (app: Express) => {
  app.get("/api/track-item/download", async (req: Request, res: Response) => {
    try {
      const { track_item_id } = req.query;
      if (!track_item_id) return res.status(400).send("Missing track_item_id");

      const track_item = await track_repo.getTrackItemById(track_item_id);
      if (
        !track_item ||
        track_item.start_time == null ||
        track_item.end_time == null ||
        !track_item.asset_id
      )
        return res.status(404).send("Track item not found");

      const asset = await asset_repo.getAssetById(track_item.asset_id);
      if (!asset || !asset.server_path)
        return res.status(404).send("Asset not found");

      const outputPath = await FF.cutVideoAccurate(
        asset.server_path,
        track_item.start_time,
        track_item.end_time
      );

      res.download(outputPath, asset.original_name, async (err) => {
        if (err) {
          console.error("Download error:", err);
          res.status(500).send("Failed to download file");
        } else {
          try {
            await fs.unlink(outputPath);
          } catch (err) {
            console.log(err);
          }
        }
      });
    } catch (err) {
      console.error("Error in download route:", err);
      res.status(500).send("Internal server error");
    }
  });
};
export const createTrackExportRoute = (app: Express) => {
  app.get("/api/track-item/export", async (req: Request, res: Response) => {
    const { projectId } = req.query;
    if (!projectId) return res.status(400).send("projectId required");

    const trackItems = await track_repo.getTrackItemsByProjectId({
      projectId: Number(projectId),
    });
    // 1. Separate video tracks and text tracks
    const videoTracks = trackItems.filter((t) => t.video_frames && t.video_frames.length > 0);
    const textTracks = trackItems.filter((t) => t.text_content && t.text_content.trim() !== "");

    // 2. Fetch corresponding assets
    const assetIds = [...new Set(videoTracks.map((t) => t.asset_id))];
    const assets: Asset[] = [];
    for (const id of assetIds) {
      const asset = await asset_repo.getAssetById(id!);
      if (asset) assets.push(asset);
    }

    // 3. Cut each video track_item (re-encode for accuracy)
    const cutVideos: string[] = [];
    for (const vt of videoTracks) {
      const asset = assets.find((a) => a.id === vt.asset_id);
      if (!asset) continue;

      const outputPath = await FF.cutVideoAccurate(
        asset.server_path,
        vt.start_time!,
        vt.end_time!
      );
      cutVideos.push(outputPath);
    }

    if (cutVideos.length === 0) return res.status(400).send("No video content found to export");

    // 4. Concatenate videos
    const tempDir = fs.mkdtemp(path.join(os.tmpdir(), "export-"));
    const concatFile = path.join(await tempDir, "concat.mp4");
    await FF.concatVideos(cutVideos, concatFile);

    // 5. Overlay subtitles (if any)
    let finalOutput = concatFile;
    if (textTracks.length > 0) {
      const withSub = path.join(await tempDir, "with_subs.mp4");
      await FF.overlaySubtitles(concatFile, textTracks, withSub);
      finalOutput = withSub;
    }

    // 6. Return the download file
    const downloadName = `project_${projectId}.mp4`;
    res.download(finalOutput, downloadName, async (err) => {
      if (err) console.error("Export download error:", err);

      // Cleanup temporary files
      try {
        cutVideos.forEach((f) => fs.unlink(f));
        fs.unlink(finalOutput);
        fs.rmdir(await tempDir);
      } catch (error) {
        console.error("Cleanup error:", error);
      }
    });
  });
};

export const createUpdateTextRoute = (app: Express) => {
  app.put("/api/track-item/:id", async (req: Request, res: Response) => {
    const track = req.body;
    try {
      const track_item = await track_repo.storeTrackItem(track);

      res.status(200).json({ message: "updated track", track_item });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  });
};
