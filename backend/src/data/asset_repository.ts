import { Asset, TrackItem } from "./models/track_items_models";
import { TrackItemModel } from "./orm/models";

export interface assetRepository {
  storeTrackItem(ti:TrackItem):Promise<boolean>
  getAssetById(id: number): Promise<Asset | undefined>;
  getAssets(query: any): Promise<Asset[]>;
  deleteAsset(id: number): Promise<boolean>;
  storeAsset(params: Asset): Promise<Asset|undefined>;
}
