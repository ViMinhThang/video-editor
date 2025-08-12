import { TrackItem } from "../../models/track_items_models";
import { BaseRepo, Constructor } from "../core";
import { TrackItemModel, TrackModel } from "../models";

export function AddStorageTrackItem<Tbase extends Constructor<BaseRepo>>(
  Base: Tbase
) {
  return class extends Base {
    async storeTrackItem(ti: TrackItem): Promise<TrackItem> {
      return this.sequelize.transaction(async (transaction) => {
        const [_track_item, created] = await TrackItemModel.upsert(
          {
            track_id: ti.track_id,
            project_id: ti.project_id,
            start_time: ti?.start_time,
            asset_id: ti.asset_id,
            end_time: ti?.end_time,
            x: ti?.x,
            y: ti?.y,
            scale: ti?.scale,
            rotation: ti?.rotation,
            text_content: ti?.text_content,
          },
          { transaction }
        );
        return _track_item;
      });
    }
  };
}

export function AddStorageTrack<TBase extends Constructor<BaseRepo>>(
  Base: TBase
) {
  return class extends Base {
    storeTrack(p: any) {
      return this.sequelize.transaction(async (transaction) => {
        const [stored] = await TrackModel.upsert(
          {
            type: p.type,
            order: 1,
          },
          { transaction }
        );
        return stored;
      });
    }
  };
}

export function AddTrackDeletion<TBase extends Constructor<BaseRepo>>(
  Base: TBase
) {
  return class extends Base {
    async deleteTrack(id: number) {
      const count = await TrackModel.destroy({
        where: { id },
      });
      return count > 0;
    }
    async deleteTrackItem(id: number) {
      const count = await TrackItemModel.destroy({
        where: { id },
      });
      return count > 0;
    }
  };
}
