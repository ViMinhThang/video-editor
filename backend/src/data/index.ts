import { assetRepository } from "./repo_interface/asset_repository";
import { videoRepoImpl } from "./orm";
import { ProjectRepository } from "./repo_interface/project_repository";
import { trackRepository } from "./repo_interface/track_repository";
import { videoRepository } from "./repo_interface/video_repository";

const repo = new videoRepoImpl();

export const project_repo: ProjectRepository = repo;
export const track_repo: trackRepository = repo;
export const asset_repo: assetRepository = repo;

export const video_repo: videoRepository = repo;
