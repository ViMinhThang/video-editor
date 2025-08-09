import { AddDeletionAsset } from "./asset_repo/mutation";
import { AddQueriesAsset } from "./asset_repo/queries";
import { BaseRepo } from "./core";
import {
  AddProjectDeletion,
  AddProjectStorage,
  AddProjectUpdate,
} from "./project_repo/mutation";
import { AddProjectQueries } from "./project_repo/queries";
import {
  AddStorageTrack,
  AddStorageTrackItem,
  AddTrackDeletion,
} from "./track_repo/mutation";
import { AddQueriesTrack } from "./track_repo/queries";
import { AddUploadMedia } from "./upload_repo";

const projectRepo = AddProjectUpdate(
  AddProjectDeletion(AddProjectStorage(AddProjectQueries(BaseRepo)))
);

const assetRepo = AddDeletionAsset(AddQueriesAsset(projectRepo));

const trackRepo = AddTrackDeletion(
  AddStorageTrack(
    AddUploadMedia(AddQueriesTrack(AddStorageTrackItem(assetRepo)))
  )
);

export const videoRepoImpl = trackRepo;
