import { BaseRepo } from "./core";
import {
  AddProjectDeletion,
  AddProjectStorage,
  AddProjectUpdate,
} from "./project_repo/mutation";
import { AddProjectQueries } from "./project_repo/queries";
import { AddStorageTrack, AddStorageTrackItem, AddTrackDeletion } from "./track_repo/mutation";
import { AddQueriesTrack } from "./track_repo/queries";
import { AddUploadMedia } from "./upload_repo";

const ProjectRepo = AddProjectUpdate(
  AddProjectDeletion(AddProjectStorage(AddProjectQueries(BaseRepo)))
);

const trackRepo =AddTrackDeletion(AddStorageTrack(
  AddUploadMedia(AddQueriesTrack(AddStorageTrackItem(ProjectRepo))))
);

export const videoRepoImpl = trackRepo;
