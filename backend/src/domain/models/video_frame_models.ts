import { TrackItemConfig } from "./track_items_models";

export interface videoFrame {
  id?: number;
  track_item_id: number;
  url: string;
  created_at?: Date;
  updated_at?: Date;
}
export interface assetsWithTrackItems {
  id?: number | undefined;
  project_id: number;
  asset_id?: number | undefined;
  type: "video" | "audio" | "text" | "image";
  start_time: number|undefined;
  end_time: number|undefined;
  config?: TrackItemConfig;
  created_at?: Date | undefined;
  updated_at?: Date | undefined;
  video_frames?: videoFrame[];
}
