import { ProjectModel } from "../models";
import { BaseRepo, Constructor } from "../core";
import { Project } from "../../models/project_models";

export function AddProjectUpdate<TBase extends Constructor<BaseRepo>>(Base: TBase) {
  return class extends Base {
    async updateProject(id: number, data: Partial<Project>): Promise<boolean> {
      const [count] = await ProjectModel.update(
        {
          ...data,
          update_at: new Date(),
        },
        {
          where: { id },
        }
      );
      return count > 0;
    }
  };
}
