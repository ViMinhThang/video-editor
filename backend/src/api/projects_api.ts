import { video_repository } from "../data";
import { Project } from "../data/models/project_models";
import { WebService } from "./web_service";
import * as jsonpatch from "fast-json-patch";

export class ProjectWebService implements WebService<Project> {
  getOne(id: any): Promise<Project | undefined> {
    return video_repository.getProjectById(id);
  }
  getMany(query: any): Promise<Project[]> {
    const { user_id, limit } = query || {};
    return video_repository.getProjects({ user_id, limit });
  }
  async store(data: any): Promise<Project | undefined> {
    const { title, user_id } = data;
    const id = await video_repository.storeProject({ title, user_id });
    console.log("Stored new project with ID:", id);
    const project = await video_repository.getProjectById(id);
    console.log("Retrieved after store:", project);
    return project;
  }
  delete(id: any): Promise<boolean> {
    return video_repository.delete(Number.parseInt(id));
  }
  async replace(id: any, data: any): Promise<Project | undefined> {
    const { title } = data;

    const success = await video_repository.updateProject(id, { title });
    if (success) {
      return video_repository.getProjectById(id);
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
