import { BaseRepo } from "./core";
import { AddProjectDeletion, AddProjectStorage, AddProjectUpdate } from "./project_repo/mutation";
import { AddProjectQueries } from "./project_repo/queries";
import { AddUploadMedia } from "./upload_repo";


const ProjectRepo = AddProjectUpdate(
  AddProjectDeletion(AddProjectStorage(AddProjectQueries(BaseRepo)))
);

const uploadRepo = AddUploadMedia(BaseRepo)

export const ProjectRepoImpl = ProjectRepo;
export const uploadRepoImpl = uploadRepo