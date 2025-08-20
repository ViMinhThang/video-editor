import { Project } from "../models/project_models";

export interface ProjectRepository {
  updateProject(id: number, data: Partial<Project>): Promise<boolean>;
  delete(id: number): Promise<boolean>;
  getProjects(params: any): Promise<any>;
  getProjectById(id: any): Promise<Project | undefined>;
  storeProject(params: Project): Promise<number | undefined>;
}
