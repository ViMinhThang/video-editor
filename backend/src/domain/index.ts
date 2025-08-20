import { assetRepository } from "../domain/repositories/asset_repository";
import { ProjectRepository } from "../domain/repositories/project_repository";
import { trackRepository } from "../domain/repositories/track_repository";
import { videoRepository } from "../domain/repositories/video_repository";
import { videoRepoImpl } from "../infrastructure/repositories";

const repo = new videoRepoImpl();

export const project_repo: ProjectRepository = repo;
export const track_repo: trackRepository = repo;
export const asset_repo: assetRepository = repo;

export const video_repo: videoRepository = repo;
