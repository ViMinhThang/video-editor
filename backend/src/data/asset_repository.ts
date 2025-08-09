import { Asset } from "./models/track_items_models";

export interface assetRepository {
  getAssetById(id: number): Promise<Asset | undefined>;
  getAssets(query: any): Promise<Asset[]>;
  deleteAsset(id: number): Promise<boolean>;
  storeAsset(params: Asset): Promise<Asset|undefined>;
}
