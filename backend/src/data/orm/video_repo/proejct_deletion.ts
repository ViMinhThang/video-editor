import { ProjectModel } from "../models";
import { BaseRepo, Constructor } from "../core";

export function AddProjectDeletion<TBase extends Constructor<BaseRepo>>(Base: TBase) {
  return class extends Base {
    async delete(id: number): Promise<boolean> {
      const count = await ProjectModel.destroy({
        where: { id },
      });
      return count > 0;
    }
  };
}
