import { BaseRepo } from "./core";
import { AddProjectDeletion, AddProjectStorage, AddProjectUpdate } from "./project_repo/mutation";
import { AddProjectQueries } from "./project_repo/queries";


const ProjectRepo = AddProjectUpdate(
  AddProjectDeletion(AddProjectStorage(AddProjectQueries(BaseRepo)))
);

export const ProjectRepoImpl = ProjectRepo;
