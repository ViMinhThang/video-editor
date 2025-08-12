import { project_repo } from "../../data";
import { Project } from "../../data/models/project_models";
import { WebService } from "./web_service";
import * as jsonpatch from "fast-json-patch";

export class ProjectWebService implements WebService<Project> {
  getOne(id: any): Promise<Project | undefined> {
    return project_repo.getProjectById(id);
  }
  getMany(query: any): Promise<Project[]> {
    const { user_id, limit } = query || {};
    return project_repo.getProjects({ user_id, limit });
  }
  async store(data: any): Promise<Project | undefined> {
    const { title, user_id } = data;
    const id = await project_repo.storeProject({ title, user_id });
    console.log("Stored new project with ID:", id);
    const project = await project_repo.getProjectById(id);
    console.log("Retrieved after store:", project);
    return project;
  }
  delete(id: any): Promise<boolean> {
    return project_repo.delete(Number.parseInt(id));
  }
  async replace(id: any, data: any): Promise<Project | undefined> {
    const { title } = data;

    const success = await project_repo.updateProject(id, { title });
    if (success) {
      return project_repo.getProjectById(id);
    }
    return undefined;
  }

  async modify(id: any, data: any): Promise<Project | undefined> {
    const dbData = await this.getOne(id);
    if (dbData !== undefined) {
      return await this.replace(
        id,
        jsonpatch.applyPatch(dbData, data).newDocument
      );
    }
  }
}
