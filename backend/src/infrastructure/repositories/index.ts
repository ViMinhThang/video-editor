import { ProjectRepository } from "../../domain/repositories/project_repository";
import { TrackRepository } from "../../domain/repositories/track_repository";
import { AssetRepository } from "../../domain/repositories/asset_repository";
import { VideoRepository } from "../../domain/repositories/video_repository";

import { ProjectRepoImpl } from "./project_repository";
import { TrackRepoImpl } from "./track_repository";
import { AssetRepoImpl } from "./asset_repository";
import { VideoRepoImpl } from "./video_repository";

export const project_repo: ProjectRepository = new ProjectRepoImpl();
export const track_repo: TrackRepository = new TrackRepoImpl();
export const asset_repo: AssetRepository = new AssetRepoImpl();
export const video_repo: VideoRepository = new VideoRepoImpl();
