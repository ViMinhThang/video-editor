import { BaseRepo } from "./core";
import {
  AddProjectDeletion,
  AddProjectStorage,
  AddProjectUpdate,
} from "./project_repo/mutation";
import { AddProjectQueries } from "./project_repo/queries";
import { AddStorageTrackItem } from "./track_repo/mutation";
import { AddQueriesTrack } from "./track_repo/queries";
import { AddUploadMedia } from "./upload_repo";

const ProjectRepo = AddProjectUpdate(
  AddProjectDeletion(AddProjectStorage(AddProjectQueries(BaseRepo)))
);

const trackRepo = AddUploadMedia(AddQueriesTrack(AddStorageTrackItem(ProjectRepo)));

export const videoRepoImpl = trackRepo
