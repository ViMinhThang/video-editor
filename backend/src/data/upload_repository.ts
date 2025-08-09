import { Asset, TrackItem } from "./models/track_items_models";
import { Track } from "./models/track_models";

export interface uploadRepository {
  storeTrack(params: { project_id: number; type: string }): Promise<Track>;
  storeAsset(params: Asset): Promise<number>;
  storeTrackItem(params: TrackItem): Promise<boolean | undefined>;
}
