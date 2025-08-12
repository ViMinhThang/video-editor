import { videoFrame } from "../../models/video_frame_models";
import { BaseRepo, Constructor } from "../core";
import { VideoFrameModel } from "../models/track_items_models";

export function AddQueriesVideoFrame<Tbase extends Constructor<BaseRepo>>(
  Base: Tbase
) {
  return class extends Base {
    async getVideoFramesByTrackItemId(
      id: number
    ): Promise<videoFrame[] | undefined> {
      const result = await VideoFrameModel.findAll({
        where: { track_item_id: id },
        raw: true,
      });
      return result ?? undefined;
    }
  };
}
