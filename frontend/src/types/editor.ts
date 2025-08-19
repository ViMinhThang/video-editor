import { Asset, TrackItem, VideoFrame } from ".";

export interface EditorContextType {
  duration: number;
  frames: VideoFrame[];
  tracks: Record<string, TrackItem[]>;
  asset: Asset;
  fetchProject: () => Promise<void>;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
  setTracks: React.Dispatch<React.SetStateAction<Record<string, TrackItem[]>>>;
  setAsset: React.Dispatch<React.SetStateAction<Asset>>;
}
export interface VideoContextType {
  videoRef: React.RefObject<HTMLVideoElement>;
  isPlaying: boolean;
  currentTime: number;
  togglePlay: () => void;
  setCurrentTime: (time: number) => void;
}
export interface TimelineContextType {
  frames: any[];
  setCurrentTime: (time: number) => void;

  contextMenu: {
    visible: boolean;
    x: number;
    y: number;
    trackItemId: number | null;
  };
  highlightTrackItemIdRef: React.RefObject<number | null>;
  animLineWidthRef: React.RefObject<number>;

  handleMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleContextMenu: (e: React.MouseEvent, trackItemId: number) => void;
  handleDownload: () => void;
  setContextMenu: React.Dispatch<
    React.SetStateAction<{
      visible: boolean;
      x: number;
      y: number;
      trackItemId: number | null;
    }>
  >;
}

export interface TimeLineProps {
  children: React.ReactNode;
  frames: any[];
  setCurrentTime: (time: number) => void;
}
export interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  trackItemId: number | null;
}
export interface TimelineCanvasProps {
  thumbnailWidth?: number;
  thumbnailHeight?: number;
  groupGap: number;
}
