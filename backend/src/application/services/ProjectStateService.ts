// src/application/services/ProjectStateService.ts
import { project_repo, asset_repo, track_repo, video_repo } from "../../domain";
import { assetsWithTrackItems } from "../../domain/models/video_frame_models";
import { ProjectStateMapper, ProjectStateDTO } from "../dto/ProjectStateDTO";

export class ProjectStateService {
  static async getFullProjectState(projectId: number): Promise<ProjectStateDTO> {
    const project = await project_repo.getProjectById(projectId);
    if (!project) throw new Error("ProjectNotFound");

    const assets = await asset_repo.getAssets({ projectId });
    const trackItems = await track_repo.getTrackItemsByProjectId({ projectId });

    const trackItemsWithFrames: assetsWithTrackItems[] = [];
    for (const trackItem of trackItems) {
      if (!trackItem.id) continue;
      const video_frames = await video_repo.getVideoFramesByTrackItemId(trackItem.id);
      trackItemsWithFrames.push({ ...trackItem, video_frames });
    }

    return ProjectStateMapper.toProjectStateDTO(project, assets, trackItemsWithFrames);
  }
}
