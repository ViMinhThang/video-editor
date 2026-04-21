import { ProjectModel, TrackModel } from "../database/models";
import { Project } from "../../domain/interfaces/project_models";
import { ProjectRepository } from "../../domain/repositories/project_repository";
import { db } from "../database/core";

export class ProjectRepoImpl implements ProjectRepository {
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

    return await ProjectModel.findAll(queryOptions);
  }

  async getProjectById(id: any) {
    const result = await ProjectModel.findOne({
      nest: true,
      where: { id: Number(id) },
    });
    return result ?? undefined;
  }

  async storeProject(p: Project): Promise<number | undefined> {
    return await db.sequelize.transaction(async (transaction) => {
      const [stored] = await ProjectModel.upsert(
        {
          user_id: 1, // Defaulting to 1 as in original mixin
          title: p.title,
        },
        { transaction }
      );
      return stored.id;
    });
  }

  async updateProject(id: number, data: Partial<Project>): Promise<boolean> {
    const [count] = await ProjectModel.update(data, {
      where: { id },
    });
    return count > 0;
  }

  async delete(id: number): Promise<boolean> {
    const count = await ProjectModel.destroy({
      where: { id },
    });
    return count > 0;
  }
}
