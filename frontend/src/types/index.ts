export interface Asset {
  name: string;
  type: string;
  url: string;
  created_at: string;
  id: number;
  mime_type: string;
  thumbnail: string;
  trackItems: TrackItem[];
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
}
export interface VideoFrame {
  start_time: number;
  end_time: number;
  id: number;
  track_item_id: number;
  url: string;
  created_at: string;
  updated_at: string;
}

export interface TrackItem {
  rotation: number;
  color: string;
  fontSize: number;
  y: number;
  x: number;
  textContent: string;
  id: number;
  project_id: number;
  trackId: number;
  assetId: number;
  startTime: number;
  endTime: number;
  video_frames: VideoFrame[];
  loading: boolean;
}
export interface TimelineMetricsParams {
  framesLength: number;
  duration: number;
  zoom: number;
  currentTime: number;
  extraTime?: number;
  baseScale?: number;
}

export interface DrawTimelineParams {
  canvas: HTMLCanvasElement;
  frames: VideoFrame[];
  scale: number;
  thumbnailWidth: number;
  thumbnailHeight: number;
  groupGap: number;
  highlightTrackItemId?: number | null;
  animLineWidth?: number;
  borderColor?: string;
}
