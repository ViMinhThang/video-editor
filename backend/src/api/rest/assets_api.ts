import { asset_repo } from "../../data";
import { Project } from "../../data/models/project_models";
import { Asset } from "../../data/models/track_items_models";
import { WebService } from "./web_service";
import * as jsonpatch from "fast-json-patch";

export class AssetsWebService implements WebService<Asset> {
  getOne(id: any): Promise<Asset | undefined> {
    return asset_repo.getAssetById(id);
  }
  getMany(query: any): Promise<Asset[]> {
    return asset_repo.getAssets(query);
  }
  async store(data: any): Promise<Asset | undefined> {
    return asset_repo.storeAsset(data);
  }
  delete(id: any): Promise<boolean> {
    return asset_repo.deleteAsset(Number.parseInt(id));
  }
  async replace(id: any, data: any): Promise<Asset | undefined> {
    throw new Error("Not implemented");
  }

  async modify(id: any, data: any): Promise<Asset | undefined> {
    throw new Error("Not implemented");
  }
}
