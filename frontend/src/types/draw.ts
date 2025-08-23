import { TrackItem } from "./track_item";

export interface DrawTimelineOptions {
  canvas: HTMLCanvasElement;
  videos: TrackItem[];
  thumbnailWidth: number;
  thumbnailHeight: number;
  groupGap: number;
  highlightTrackItemId: number | null;
  borderColor?: string;
}
export interface DrawSubtitleTimelineOptions {
  canvas: HTMLCanvasElement;
  texts: TrackItem[];
  groupGap: number;
  highlightTrackItemId: number | null;
  borderColor?: string;
  thumbnailHeight: number;
}
