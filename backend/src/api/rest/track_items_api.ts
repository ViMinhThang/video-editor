import path from "path";
import { asset_repo, track_repo, video_repo } from "../../data";
import { TrackItem } from "../../data/models/track_items_models";
import { uploadDir } from "../custom/upload_routes";
import { WebService } from "./web_service";
import FF from "../../lib/FF";
import fs from "fs/promises";
import {
  calculateNumbFrames,
  getNextRunIndex,
  getProjectAssetDir,
} from "../../lib/util";
import { videoFrame } from "../../data/models/video_frame_models";

export class TrackItemWebService implements WebService<TrackItem> {
  getOne(id: any): Promise<TrackItem | undefined> {
    return track_repo.getTrackItemById(id);
  }

  getMany(query: any): Promise<TrackItem[]> {
    return track_repo.getTrackItems(query);
  }

  async store(data: any): Promise<TrackItem | undefined> {
    const asset = await asset_repo.getAssetById(data.asset_id);
    if (!asset) return;
    const project_id = data.project_id;

    const duration = await FF.getDuration(asset.server_path);
    const track_item: TrackItem = {
      project_id,
      asset_id: asset.id,
      track_id: 1,
      start_time: data.start_time,
      end_time: data.start_time + duration,
    };
    const created = await track_repo.storeTrackItem(track_item);
    if (!created) {
      throw new Error("Track item creation failed");
    }
    try {
      const videoBaseName = path.parse(asset.original_name).name;
      const baseFramesDir = path.join(
        getProjectAssetDir(project_id, videoBaseName)
      );
      const framesDir = path.join(
        baseFramesDir,
        "track_item" + "_" + created.id + "",
        "frames"
      );
      await fs.mkdir(framesDir, { recursive: true });

      const tmpPath: string[] = await FF.extractAllFrames(
        asset.server_path,
        calculateNumbFrames(duration)
      );

      const finalPaths: string[] = [];

      for (let i = 0; i < tmpPath.length; i++) {
        const frame_index = path.join(framesDir, `frame_${i}.jpg`);
        await fs.copyFile(tmpPath[i], frame_index);
        await fs.unlink(tmpPath[i]);
        finalPaths.push(frame_index);
        const url_static = `/uploads/projects/${project_id}/assets/${videoBaseName}/track_item_${
          created.id
        }/frames/frame_${[i]}.jpg`;
        const video_frames: videoFrame = {
          track_item_id: created.id!,
          url: url_static,
        };
        await video_repo.storeVideoFrame(video_frames);
      }

      console.log("Frames copied:", finalPaths);

      return created;
    } catch (error) {
      console.error("Error storing track item:", error);
    }
  }

  delete(id: any): Promise<boolean> {
    return track_repo.deleteTrackItem(Number.parseInt(id));
  }

  async replace(id: any, data: any): Promise<TrackItem | undefined> {
    throw new Error("Not implemented");
  }

  async modify(id: any, data: any): Promise<TrackItem | undefined> {
    throw new Error("Not implemented");
  }
}
