import { Asset, TrackItem } from "../../domain/interfaces/track_items_models";
import { AssetModel, TrackItemModel } from "../database/models/track_items_models";
import { AssetRepository } from "../../domain/repositories/asset_repository";
import { db } from "../database/core";

export class AssetRepoImpl implements AssetRepository {
  async getAssetById(id: number): Promise<Asset | undefined> {
    const result = await AssetModel.findOne({ where: { id } });
    return result ?? undefined;
  }

  async getAssets(query: any): Promise<Asset[]> {
    return await AssetModel.findAll({
      where: { project_id: query.projectId },
      raw: true,
    });
  }

  async getAssetPath(asset_id: number): Promise<string | undefined> {
    const result = await AssetModel.findOne({
      where: { id: asset_id },
      attributes: ["server_path"],
      raw: true,
    });
    return result ? (result as any).server_path : undefined;
  }

  async deleteAsset(id: number): Promise<boolean> {
    const count = await AssetModel.destroy({
      where: { id },
    });
    return count > 0;
  }

  async storeAsset(a: any): Promise<Asset | undefined> {
    return await db.sequelize.transaction(async (transaction) => {
      const [_asset] = await AssetModel.upsert(
        {
          original_name: a.original_name,
          project_id: a.project_id,
          file_name: a.file_name,
          mime_type: a.mime_type,
          server_path: a.server_path,
          size: a.size,
          type: a.type,
          url: a.url,
          thumbnail: a?.thumbnail,
        },
        { transaction }
      );
      return _asset.get({ plain: true });
    });
  }

  async storeTrackItem(ti: TrackItem): Promise<TrackItem | undefined> {
    return await db.sequelize.transaction(async (transaction) => {
      const [_track_item] = await TrackItemModel.upsert(
        {
          id: ti.id,
          track_id: ti.track_id,
          project_id: ti.project_id,
          start_time: ti?.start_time,
          asset_id: ti?.asset_id,
          end_time: ti?.end_time,
          x: ti?.x,
          y: ti?.y,
          scale: ti?.scale,
          rotation: ti?.rotation,
          text_content: ti?.text_content,
        },
        { transaction }
      );
      return _track_item.get({ plain: true });
    });
  }
}
