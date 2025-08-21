import { TrackItem } from "./track_item";

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
