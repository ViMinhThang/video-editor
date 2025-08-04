import { Project } from "./project_models";

export interface VideoRepository {
  getProjects(params: any): Promise<any>;
  storeProject(params: Project): Promise<any>;
}
