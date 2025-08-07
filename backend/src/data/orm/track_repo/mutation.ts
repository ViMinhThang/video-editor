import { BaseRepo, Constructor } from "../core";
import { TrackItemModel, TrackModel } from "../models";

export function AddStorageTrackItem<Tbase extends Constructor<BaseRepo>>(
  Base: Tbase
) {
  return class extends Base {
    async storeTrackItem(ti: TrackItemModel): Promise<boolean> {
      const [_track_item, created] = await TrackItemModel.upsert({
        track_id: ti.track_id,
        start_time: ti?.start_time,
        asset_id: ti.asset_id,
        end_time: ti?.end_time,
        x: ti?.x,
        y: ti?.y,
        scale: ti?.scale,
        rotation: ti?.rotation,
        text_content: ti?.text_content,
        created_at: ti.created_at,
      });
      return created ?? false;
    }
     async storeTracks(t: TrackModel): Promise<boolean> {
      const [_track_item, created] = await TrackModel.upsert({
        project_id:t.project_id,
        type:t.type,
        order:t.order
      });
      return created ?? false;
    }
  };
  
}
