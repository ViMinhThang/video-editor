import { ProjectModel } from "../models";
import { BaseRepo, Constructor } from "../core";
import { Project } from "../../models/project_models";

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

export function AddProjectStorage<TBase extends Constructor<BaseRepo>>(Base: TBase) {
  return class extends Base {
    storeProject(p: Project) {
      return this.sequelize.transaction(async (transaction) => {
        const [stored] = await ProjectModel.upsert(
          {
            user_id: 1,
            title: p.title,
            create_at: new Date(),
            update_at: new Date(),
          },
          { transaction }
        );
        return stored.id;
      });
    }
  };
}

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
