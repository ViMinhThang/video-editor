export interface videoFrame {
  id?: number;
  track_item_id: number;
  url: string;
  created_at?: Date;
  updated_at?: Date;
}
export interface assetsWithTrackItems {
  video_frames: videoFrame[] | undefined;
  id?: number;
  track_id: number;
  asset_id?: number;
  start_time?: number;
  width?: number;
  height?: number;
  end_time?: number;
  project_id: number;
  x?: number;
  y?: number;
  scale?: number;
  rotation?: number;
  text_content?: string;
  created_at?: Date;
  updated_at?: Date;
}
[];
