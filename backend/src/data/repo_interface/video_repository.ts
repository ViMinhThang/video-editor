import { videoFrame } from "../models/video_frame_models";

export interface videoRepository {
  getVideoFramesByTrackItemId(id: number): Promise<videoFrame []| undefined>;
  storeVideoFrame(vf: videoFrame): Promise<videoFrame | undefined>;
}
