import { createCutTrackItem } from "./custom/cut_track_route";
import { createDownloadTrack } from "./custom/download_track_route";
import { createUpdateTextRoute } from "./custom/update_text_route";
import { Express } from "express";
import { createTrackItemRestApi } from "./rest/rest";
import { createAddTextItem } from "./custom/add_text_route";

export const createTrackItemRoutes = (app: Express) => {
  createAddTextItem(app);
  createCutTrackItem(app);
  createDownloadTrack(app);
  createUpdateTextRoute(app);
  createTrackItemRestApi(app);
};
