export interface VideoFrame {
  start_time: number;
  end_time: number;
  id: number;
  track_item_id: number;
  url: string;
  created_at: string;
  updated_at: string;
}

export interface VideoConfig {
  scale?: number;
  rotation?: number;
  opacity?: number;
  crop?: { x: number; y: number; w: number; h: number };
}

export interface AudioConfig {
  volume?: number;
  fadeIn?: number;
  fadeOut?: number;
}

export interface TextConfig {
  text?: string;
  font?: string;
  fontSize?: number;
  color?: string;
  x?: number;
  y?: number;
  rotation?: number;
}

export type TrackItemConfig = VideoConfig | AudioConfig | TextConfig;

export interface TrackItem {
  id: number;
  project_id: number;
  assetId?: number;
  type: "video" | "audio" | "text" | "image";
  startTime: number;
  endTime: number;

  config?: TrackItemConfig;

  video_frames?: VideoFrame[];

  // state ở frontend
  loading?: boolean;
}
