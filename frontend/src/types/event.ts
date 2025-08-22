import { RefObject } from "react";
import { Asset } from ".";
import { TrackItem } from "./track_item";

export type ContextMenuConfig = {
  e: React.MouseEvent;
  canvasRef: RefObject<HTMLCanvasElement>;
  videos: TrackItem[];
  groupGap: number;
  thumbnailWidth: number;
  highlightTrackItemIdRef: React.RefObject<number | null>;
  animLineWidthRef: React.RefObject<number>;
  render: () => void;
  handleContextMenu?: (e: React.MouseEvent, id: number) => void;
};

export type RenderDraggingConfig = {
  canvasRef: RefObject<HTMLCanvasElement>;
  tracks: TrackItem[];
  dragItemRef: React.RefObject<TrackItem | null>;
  deltaX: number;
  thumbnailWidth: number;
  thumbnailHeight: number;
  groupGap: number;
  highlightTrackItemIdRef: React.RefObject<number | null>;
  animLineWidthRef: React.RefObject<number>;
};

export type MouseDownConfig = {
  e: React.MouseEvent;
  canvasRef: RefObject<HTMLCanvasElement>;
  videos: TrackItem[];
  dragItemRef: React.RefObject<TrackItem | null>;
  dragStartXRef: React.RefObject<number>;
  setIsDragging: (value: boolean) => void;
};
export type MouseUpConfig = {
  e: React.MouseEvent;
  canvasRef: RefObject<HTMLCanvasElement>;
  videos: TrackItem[];
  dragItemRef: React.RefObject<TrackItem | null>;
  setTracks: React.Dispatch<React.SetStateAction<{ video: TrackItem[] }>>;
  setIsDragging: (value: boolean) => void;
  groupGap: number;
  thumbnailWidth: number;
};

export type VideoClickConfig = {
  e: React.MouseEvent;
  canvasRef: RefObject<HTMLCanvasElement>;
  tracks: Record<string, TrackItem[]>;
  assets: Asset[];
  setAsset: React.Dispatch<React.SetStateAction<Asset | undefined>>;
  groupGap: number;
  thumbnailWidth: number;
};