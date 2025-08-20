import { Asset } from "../../../domain/models/track_items_models";
import { AssetModel } from "../../database/models/track_items_models";
import { Constructor, BaseRepo } from "../core";

export function AddUploadMedia<TBase extends Constructor<BaseRepo>>(
  Base: TBase
) {
  return class extends Base {
    async storeAsset(a: AssetModel): Promise<Asset | undefined> {
      return this.sequelize.transaction(async (transaction) => {
        const [_asset, created] = await AssetModel.upsert(
          {
          original_name: a.original_name,
            project_id: a.project_id,
            server_path:a.server_path,
            file_name: a.file_name,
            mime_type: a.mime_type,
            type:a.type,
            size: a.size,
            url: a.url,
            thumbnail: a?.thumbnail,
            created_at: a?.created_at,
          },
          { transaction }
        );
        return _asset ?? undefined;
      });
    }
  };
}
