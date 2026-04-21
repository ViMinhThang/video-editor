import { videoFrame } from "../../domain/interfaces/video_frame_models";
import { VideoFrameModel } from "../database/models/track_items_models";
import { VideoRepository } from "../../domain/repositories/video_repository";
import { db } from "../database/core";

export class VideoRepoImpl implements VideoRepository {
  async getVideoFramesByTrackItemId(id: number): Promise<videoFrame[] | undefined> {
    const result = await VideoFrameModel.findAll({
      where: { track_item_id: id },
      raw: true,
    });
    return (result as unknown as videoFrame[]) ?? undefined;
  }

  async storeVideoFrame(vf: videoFrame): Promise<videoFrame | undefined> {
    return await db.sequelize.transaction(async (transaction) => {
      const [_track_item] = await VideoFrameModel.upsert(
        {
          ...vf,
        },
        { transaction }
      );
      return _track_item.get({ plain: true }) as videoFrame;
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
}
