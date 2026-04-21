import { asset_repo, project_repo, track_repo, video_repo } from "../infrastructure/repositories";
import { assetsWithTrackItems } from "../domain/interfaces/video_frame_models";
import { NotFoundError } from "../utils/errors";

export class ProjectService {
  async getFullProjectState(projectId: number) {
    const project = await project_repo.getProjectById(projectId);
    if (!project) throw new NotFoundError("Project not found");

    const assets = await asset_repo.getAssets({ projectId });
    const track_items = await track_repo.getTrackItemsByProjectId({ projectId });

    const track_items_with_frames: assetsWithTrackItems[] = [];
    for (const trackItem of track_items) {
      if (!trackItem.id) continue;
      const video_frames = await video_repo.getVideoFramesByTrackItemId(trackItem.id);
      track_items_with_frames.push({
        ...trackItem,
        video_frames: video_frames || [],
      });
    }

    const assetsWithTrackItems = assets.map((asset) => ({
      ...asset,
      track_items: track_items_with_frames.filter((ti) => ti.asset_id === asset.id),
    }));
      
    return { assets: assetsWithTrackItems };
  }
}
