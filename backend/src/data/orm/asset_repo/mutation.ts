import { BaseRepo, Constructor } from "../core";
import { AssetModel } from "../models/track_items_models";

export function AddDeletionAsset<TBase extends Constructor<BaseRepo>>(
  Base: TBase
) {
  return class extends Base {
    async deleteAsset(id: number): Promise<boolean> {
      const count = await AssetModel.destroy({
        where: { id },
      });
      return count > 0 ;
    }
  };
}
export function AddStoreAsset<TBase extends Constructor<BaseRepo>>(
  Base: TBase
) {
  return class extends Base {
    async storeAsset(a: AssetModel): Promise<number> {
      return this.sequelize.transaction(async (transaction) => {
        const [_asset, created] = await AssetModel.upsert(
          {
            original_name: a.original_name,
            project_id: a.project_id,
            file_name: a.file_name,
            mime_type: a.mime_type,
            size: a.size,
            url: a.url,
            thumbnail: a?.thumbnail,
            created_at: a?.created_at,
          },
          { transaction }
        );
        return _asset.id;
      });
    }
  };
}
