import { videoFrame } from "../models/video_frame_models";

export interface VideoRepository {
  getVideoFramesByTrackItemId(id: number): Promise<videoFrame[] | undefined>;
  storeVideoFrame(vf: videoFrame): Promise<videoFrame | undefined>;
  updateFramesTrackItemId(
    frameIds: number[],
    newTrackItemId: number
  ): Promise<boolean>;
}
