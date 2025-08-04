import { BaseRepo, Constructor } from "./core";
import { ProjectModel, TrackModel } from "./models";

export function AddQueries<TBase extends Constructor<BaseRepo>>(Base: TBase) {
  return class extends Base {
    async getProjects(params?: any) {
      const result = await ProjectModel.findAll({
        include: [{ model: TrackModel, as: "tracks" }],
        nest: true,
        where: {
          user_id: params.user_id,
        },
      });
      return result;
    }
  };
}
