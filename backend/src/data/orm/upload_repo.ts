import { BaseRepo, Constructor } from "./core";
import { AssetModel } from "./models/track_items_models";

export function AddUploadMedia<TBase extends Constructor<BaseRepo>>(
  Base: TBase
) {
  return class extends Base {
    async storeAsset(a: AssetModel): Promise<number> {
      return this.sequelize.transaction(async (transaction) => {
        const [_asset, created] = await AssetModel.upsert(
          {
            original_name: a.original_name,
            file_name: a.file_name,
            mime_type: a.mime_type,
            size: a.size,
            duration: a?.duration,
            url: a.url,
            width: a?.width,
            height: a?.height,
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
