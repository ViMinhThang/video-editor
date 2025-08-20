// src/application/usecases/project/ProjectUseCases.ts

import { project_repo } from "../../domain";
import { Project } from "../../domain/models/project_models";

export class ProjectUseCases {
  static async getProjects(user_id?: number, limit?: number): Promise<Project[]> {
    return project_repo.getProjects({ user_id, limit });
  }

  static async getProjectById(id: number): Promise<Project | undefined> {
    return project_repo.getProjectById(id);
  }

  static async createProject(title: string, user_id: number): Promise<Project | undefined> {
    const id = await project_repo.storeProject({ title, user_id });
    return project_repo.getProjectById(id);
  }

  static async updateProject(id: number, title: string): Promise<Project | undefined> {
    const success = await project_repo.updateProject(id, { title });
    if (!success) return undefined;
    return project_repo.getProjectById(id);
  }

  static async deleteProject(id: number): Promise<boolean> {
    return project_repo.delete(id);
  }
}
