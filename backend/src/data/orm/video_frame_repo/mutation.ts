import { videoFrame } from "../../models/video_frame_models";
import { BaseRepo, Constructor } from "../core";
import { VideoFrameModel } from "../models/track_items_models";

export function AddStorageVideoFrame<Tbase extends Constructor<BaseRepo>>(
  Base: Tbase
) {
  return class extends Base {
    async storeVideoFrame(vf: videoFrame): Promise<videoFrame | undefined> {
      return this.sequelize.transaction(async (transaction) => {
        const [_track_item, created] = await VideoFrameModel.upsert(
          {
            ...vf,
          },
          { transaction }
        );
        return _track_item ?? undefined;
      });
    }
    async updateFramesTrackItemId(
      frameIds: number[],
      newTrackItemId: number
    ): Promise<boolean> {
      const [count] = await VideoFrameModel.update(
        { track_item_id: newTrackItemId },
        {
          where: {
            id: frameIds,
          },
        }
      );
      return count > 0;
    }
  };
}
