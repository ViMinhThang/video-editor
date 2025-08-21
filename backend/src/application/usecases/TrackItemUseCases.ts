// src/application/usecases/track/TrackItemUseCases.ts
import path from "path";
import fs from "fs/promises";
import { asset_repo, track_repo, video_repo } from "../../domain";
import { TrackItem } from "../../domain/models/track_items_models";
import { videoFrame } from "../../domain/models/video_frame_models";
import FF from "../../lib/FF";
import { getProjectAssetDir, calculateNumbFrames } from "../../lib/util";

export class TrackItemUseCases {
  static async createTrackItem(data: {
    project_id: string;
    asset_id: number;
    start_time: number;
  }): Promise<TrackItem | undefined> {
    const asset = await asset_repo.getAssetById(data.asset_id);
    if (!asset) throw new Error("Asset not found");

    const duration = await FF.getDuration(asset.server_path);
    console.log(data);
    const track_item: TrackItem = {
      project_id: Number.parseInt(data.project_id),
      asset_id: asset.id,
      start_time: data.start_time,
      end_time: data.start_time + duration,
      type: "video"
    };

    const created = await track_repo.storeTrackItem(track_item);
    if (!created) throw new Error("Track item creation failed");

    const videoBaseName = path.parse(asset.original_name).name;
    const baseFramesDir = path.join(
      getProjectAssetDir(data.project_id, videoBaseName)
    );
    const framesDir = path.join(
      baseFramesDir,
      `track_item_${created.id}`,
      "frames"
    );
    await fs.mkdir(framesDir, { recursive: true });

    const tmpPaths: string[] = await FF.extractAllFrames(
      asset.server_path,
      calculateNumbFrames(duration)
    );
    const list_frames = [];

    for (let i = 0; i < tmpPaths.length; i++) {
      const frame_index = path.join(framesDir, `frame_${i}.jpg`);
      await fs.copyFile(tmpPaths[i], frame_index);
      await fs.unlink(tmpPaths[i]);

      const url_static = `/uploads/projects/${data.project_id}/assets/${videoBaseName}/track_item_${created.id}/frames/frame_${i}.jpg`;
      const video_frames: videoFrame = {
        track_item_id: created.id!,
        url: url_static,
      };
      list_frames.push(await video_repo.storeVideoFrame(video_frames));
    }
    (created as any).video_frames = list_frames;
    return created;
  }

  static async getTrackItem(id: number): Promise<TrackItem | undefined> {
    return track_repo.getTrackItemById(id);
  }

  static async getTrackItems(query: any): Promise<TrackItem[]> {
    return track_repo.getTrackItems(query);
  }

  static async deleteTrackItem(id: number): Promise<boolean> {
    return track_repo.deleteTrackItem(id);
  }
}
