import path from "path";
import { asset_repo, track_repo, video_repo } from "../../data";
import { TrackItem } from "../../data/models/track_items_models";
import { uploadDir } from "../custom/upload_routes";
import { WebService } from "./web_service";
import FF from "../../lib/FF";
import fs from "fs/promises";
import { getProjectAssetDir } from "../../lib/util";
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
      start_time: 0,
      end_time: duration,
    };
    const created = await track_repo.storeTrackItem(track_item);
    if (!created) {
      throw new Error("Track item creation failed");
    }
    try {
      const videoBaseName = path.parse(asset.original_name).name;
      const framesDir = path.join(
        getProjectAssetDir(project_id, videoBaseName),
        "frames"
      );

      await fs.mkdir(framesDir, { recursive: true });

      const tmpPath: string[][] = await FF.extractFramesIntoThreeGroups(
        asset.server_path
      );

      const finalPaths: string[][] = [];

      for (let groupIndex = 0; groupIndex < tmpPath.length; groupIndex++) {
        const groupPaths: string[] = [];

        for (
          let frameIndex = 0;
          frameIndex < tmpPath[groupIndex].length;
          frameIndex++
        ) {
          const srcPath = tmpPath[groupIndex][frameIndex];

          const destPath = path.join(
            framesDir,
            `g${groupIndex}_f${frameIndex}${path.extname(srcPath)}`
          );

          await fs.copyFile(srcPath, destPath); // async non-blocking
          const url_static = `/uploads/projects/${project_id}/assets/${videoBaseName}/frames/g${groupIndex}_f${frameIndex}${path.extname(
            srcPath
          )}`;

          groupPaths.push(destPath);
          const video_frames: videoFrame = {
            track_item_id: created.id!,
            frame_index: frameIndex,
            group_index: groupIndex,
            url: url_static,
          };
          await video_repo.storeVideoFrame(video_frames);
          await fs.unlink(srcPath).catch(() => {});
        }

        finalPaths.push(groupPaths);
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
