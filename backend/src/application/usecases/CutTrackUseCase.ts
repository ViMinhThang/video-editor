import { asset_repo, track_repo, video_repo } from "../../domain";
import { TrackItem } from "../../domain/models/track_items_models";
import { calculateNumbFrames } from "../../lib/util";

export class CutTrackUseCase {
  static async execute(currentTime: number): Promise<{
    updated: TrackItem;
    created: TrackItem;
  }> {
    const track_item = await track_repo.getTrackByTime(currentTime);
    if (!track_item) {
      throw new Error("No Track Item found at " + currentTime);
    }

    if (
      track_item.asset_id == null ||
      track_item.start_time == null ||
      track_item.end_time == null ||
      track_item.id == null
    ) {
      throw new Error("Invalid Track Item data at " + currentTime);
    }

    // Check asset tồn tại
    const assetPath = await asset_repo.getAssetPath(track_item.asset_id);
    if (!assetPath) {
      throw new Error(`Asset not found for id ${track_item.asset_id}`);
    }

    // Cắt ra 2 track items
    const originalEnd = track_item.end_time;
    track_item.end_time = currentTime;

    // Update track item cũ
    const updated = await track_repo.storeTrackItem(track_item);

    // Tạo track item mới
    const new_track_item: TrackItem = {
      project_id: track_item.project_id,
      asset_id: track_item.asset_id,
      type:track_item.type,
      config:track_item.config,
      start_time: currentTime,
      end_time: originalEnd,
    };
    const created = await track_repo.storeTrackItem(new_track_item);

    // Cập nhật frame
    const startIndex = calculateNumbFrames(currentTime - track_item.start_time);
    const allFrames = await video_repo.getVideoFramesByTrackItemId(track_item.id);

    if (allFrames && created.id != null) {
      const framesForNew = allFrames.slice(startIndex);
      const ids = framesForNew
        .map((f) => f.id)
        .filter((id): id is number => id !== undefined);
      await video_repo.updateFramesTrackItemId(ids, created.id);
    }

    return { updated, created };
  }
}
