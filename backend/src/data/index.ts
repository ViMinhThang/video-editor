import { ProjectRepoImpl } from "./orm";
import { ProjectRepository } from "./project_repository";

const repo = new ProjectRepoImpl();

export const project_repo: ProjectRepository = repo;
