import { ProjectRepoImpl, uploadRepoImpl } from "./orm";
import { ProjectRepository } from "./project_repository";
import { uploadRepository } from "./upload_repository";

const repo = new ProjectRepoImpl();

export const upload_repo:uploadRepository = new uploadRepoImpl()
export const project_repo: ProjectRepository = repo;
