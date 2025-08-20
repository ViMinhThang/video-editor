import { VideoFrameModel } from "../orm/models/track_items_models";

export interface TrackItem {
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
  video_frames?: VideoFrameModel[];
}

export interface Asset {
  id?: number;
  original_name: string;
  url: string;
  server_path: string;
  type: string;
  thumbnail?: string;
  file_name: string;
  project_id: number;
  mime_type: string;
  size: number;
  created_at?: Date;
  updated_at?: Date;
}
