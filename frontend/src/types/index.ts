export interface Asset {
  type: string;
  url: string;
  created_at: string;
  id: number;
  mime_type: string;
  thumbnail: string;
  original_name: string;
}
export interface Project {
  title: string;
  url: string;
  icon: React.ElementType;
  id: string;
}
export interface FullProjectState {
  project: Project;
  assets: Asset[];
  track_items: TrackItem[];
}
export interface VideoFrame {
  id: number;
  track_item_id: number;
  frame_index: number;
  group_index: number;
  url: string;
  created_at: string;
  updated_at: string;
}

export interface TrackItem {
  id: number;
  project_id: number;
  track_id: number;
  asset_id: number;
  start_time: number;
  end_time: number;
  // ... các trường khác
  video_frames: VideoFrame[];
}

export type AssetWithFrames = Asset & {
  frames: VideoFrame[];
};