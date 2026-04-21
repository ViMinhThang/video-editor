import { Asset, TrackItem } from "../interfaces/track_items_models";

export interface AssetRepository {
  storeTrackItem(ti: TrackItem): Promise<TrackItem | undefined>;
  getAssetById(id: number): Promise<Asset | undefined>;
  getAssets(query: any): Promise<Asset[]>;
  deleteAsset(id: number): Promise<boolean>;
  storeAsset(params: Asset): Promise<Asset | undefined>;
  getAssetPath(asset_id: number): Promise<string | undefined>;
}
