import { Transaction } from "sequelize";
import { ProjectModel, TrackModel } from "./models";
import { BaseRepo, Constructor } from "./core";
import { Project } from "../project_models";

export function AddStorage<TBase extends Constructor<BaseRepo>>(Base: TBase) {
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
        return stored;
      });
    }
  };
}
