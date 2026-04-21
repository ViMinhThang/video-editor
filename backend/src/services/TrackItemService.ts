import { asset_repo, track_repo, video_repo, project_repo } from "../infrastructure/repositories";
import FF from "../infrastructure/services/FFmpegService";
import { TrackItem, Asset } from "../domain/interfaces/track_items_models";
import os from "os";
import fs from "fs/promises";
import path from "path";
import { calculateNumbFrames } from "../utils/util";
import { NotFoundError, BadRequestError } from "../utils/errors";

export class TrackItemService {
  async cutTrackItem(currentTime: number): Promise<{ parts: TrackItem[] }> {
    const track_item = await track_repo.getTrackByTime(currentTime);
    if (!track_item) {
      throw new NotFoundError(`No track item found at time ${currentTime}`);
    }

    if (track_item.asset_id == null || track_item.start_time == null || track_item.end_time == null || track_item.id == null) {
      throw new BadRequestError("Invalid track item data");
    }

    const assetPath = await asset_repo.getAssetPath(track_item.asset_id);
    if (!assetPath) {
      throw new NotFoundError(`Asset not found for id ${track_item.asset_id}`);
    }

    const originalEnd = track_item.end_time;
    track_item.end_time = currentTime;
    await track_repo.storeTrackItem(track_item);

    const new_track_item: TrackItem = {
      project_id: track_item.project_id,
      track_id: track_item.track_id,
      asset_id: track_item.asset_id,
      start_time: currentTime,
      end_time: originalEnd,
    };
    
    const created = await track_repo.storeTrackItem(new_track_item);
    
    const startIndex = calculateNumbFrames(currentTime - track_item.start_time);
    const allFrames = await video_repo.getVideoFramesByTrackItemId(track_item.id);
    
    if (allFrames && created.id != null) {
      const framesForNew = allFrames.slice(startIndex);
      const ids = framesForNew.map(f => f.id).filter((id): id is number => id !== undefined);
      await video_repo.updateFramesTrackItemId(ids, created.id);
    }

    return { parts: [track_item, new_track_item] };
  }

  async downloadTrackItem(track_item_id: number): Promise<{ outputPath: string, originalName: string }> {
    const track_item = await track_repo.getTrackItemById(track_item_id);
    
    if (!track_item || track_item.start_time == null || track_item.end_time == null || !track_item.asset_id) {
          throw new NotFoundError("Track item not found");
    }

    const asset = await asset_repo.getAssetById(track_item.asset_id);
    if (!asset || !asset.server_path) {
          throw new NotFoundError("Asset not found");
    }

    const outputPath = await FF.cutVideoAccurate(
      asset.server_path,
      track_item.start_time,
      track_item.end_time
    );

    return { outputPath, originalName: asset.original_name };
  }

  async exportProject(projectId: number): Promise<{ finalOutput: string, downloadName: string, cleanupPaths: string[], tempDir: string }> {
    const trackItems = await track_repo.getTrackItemsByProjectId({ projectId });
    
    const videoTracks = trackItems.filter((t) => t.video_frames && t.video_frames.length > 0);
    const textTracks = trackItems.filter((t) => t.text_content && t.text_content.trim() !== "");

    const assetIds = [...new Set(videoTracks.map((t) => t.asset_id))];
    const assets: Asset[] = [];
    for (const id of assetIds) {
      if (id) {
        const asset = await asset_repo.getAssetById(id);
        if (asset) assets.push(asset);
      }
    }

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

    if (cutVideos.length === 0) {
        throw new BadRequestError("No video content found to export");
    }

    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "export-"));
    const concatFile = path.join(tempDir, "concat.mp4");
    await FF.concatVideos(cutVideos, concatFile);

    let finalOutput = concatFile;
    if (textTracks.length > 0) {
      const withSub = path.join(tempDir, "with_subs.mp4");
      await FF.overlaySubtitles(concatFile, textTracks, withSub);
      finalOutput = withSub;
    }

    return {
        finalOutput,
        downloadName: `project_${projectId}.mp4`,
        cleanupPaths: [...cutVideos, finalOutput],
        tempDir
    };
  }

  async updateTrackItem(track: Partial<TrackItem>): Promise<TrackItem> {
      return await track_repo.storeTrackItem(track);
  }
}
