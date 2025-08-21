import { BaseRepo, Constructor } from "../core";
import { AssetModel } from "../../database/models/track_items_models";
import { Asset } from "../../../domain/models/asset_models";

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
    async getAssetPath(asset_id: number): Promise<string | undefined> {
      const result = await AssetModel.findOne({
        where: { id: asset_id },
        attributes: ["server_path"],
        raw: true,
      });

      return result ? result.server_path : undefined;
    }
  };
}
