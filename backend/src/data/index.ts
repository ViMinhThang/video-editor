import { assetRepository } from "./asset_repository";
import { videoRepoImpl } from "./orm";
import { ProjectRepository } from "./project_repository";
import { trackRepository } from "./track_repository";

const repo = new videoRepoImpl();

export const project_repo: ProjectRepository = repo;
export const track_repo: trackRepository = repo;
export const asset_repo: assetRepository = repo;
