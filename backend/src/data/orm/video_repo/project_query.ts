import { ProjectModel, TrackModel } from "../models";
import { BaseRepo, Constructor } from "../core";

export function AddProjectQueries<TBase extends Constructor<BaseRepo>>(Base: TBase) {
  return class extends Base {
    async getProjects(params?: any) {
      const queryOptions: any = {
        include: [{ model: TrackModel, as: "tracks" }],
        nest: true,
      };

      if (params?.user_id) {
        queryOptions.where = { user_id: params.user_id };
      }

      if (params?.limit) {
        queryOptions.limit = parseInt(params.limit, 10);
      }

      const result = await ProjectModel.findAll(queryOptions);
      return result;
    }
    async getProjectById(id: any) {
      const result = await ProjectModel.findOne({
        nest: true,
        where: {
          id: Number(id),
        },
      });
      return result ?? undefined
    }
  };
}
