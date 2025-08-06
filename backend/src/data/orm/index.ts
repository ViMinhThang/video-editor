import { BaseRepo } from "./core";
import { AddProjectDeletion } from "./video_repo/proejct_deletion";
import { AddProjectQueries } from "./video_repo/project_query";
import { AddProjectStorage } from "./video_repo/project_storage";
import { AddProjectUpdate } from "./video_repo/project_update";

const VideoRepo = AddProjectUpdate(
  AddProjectDeletion(AddProjectStorage(AddProjectQueries(BaseRepo)))
);

export const VideoRepoImpl = VideoRepo;
