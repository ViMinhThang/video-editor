import { asset_repo, track_repo } from "../../domain";
import FF from "../../lib/FF";

export class DownloadTrackUseCase {
  static async execute(
    track_item_id: number
  ): Promise<{ outputPath: string; assetName: string }> {
    const track_item = await track_repo.getTrackItemById(track_item_id);
    if (
      !track_item ||
      track_item.start_time == null ||
      track_item.end_time == null ||
      !track_item.asset_id
    ) {
      throw new Error("Track item not found");
    }
    const asset = await asset_repo.getAssetById(track_item.asset_id);
    if (!asset || !asset.server_path) {
      throw new Error("Asset not found");
    }
    const outputPath = await FF.cutVideoAccurate(
      asset.server_path,
      track_item.start_time,
      track_item.end_time
    );
    return { outputPath: outputPath, assetName: asset.original_name };
  }
}
