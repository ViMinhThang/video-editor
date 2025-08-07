import { videoRepoImpl } from "./orm";
import { ProjectRepository } from "./project_repository";
import { uploadRepository } from "./upload_repository";

const repo = new videoRepoImpl();

export const upload_repo: uploadRepository = repo;
export const project_repo: ProjectRepository = repo;
