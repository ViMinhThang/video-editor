import { Asset } from "../../models/track_items_models";
import { BaseRepo, Constructor } from "../core";
import { AssetModel } from "../models/track_items_models";

export function AddQueriesAsset<TBase extends Constructor<BaseRepo>>(
  Base: TBase
) {
  return class extends Base {
    async getAssetById(id: number): Promise<Asset | undefined> {
      const result = await AssetModel.findOne({ where: { id: id } });
      return result ?? undefined;
    }
    async getAssets(query: any): Promise<Asset[]> {
      const result = await AssetModel.findAll({
        where: { project_id: query.projectId },
        raw: true,
      });
      return result;
    }
  };
}
