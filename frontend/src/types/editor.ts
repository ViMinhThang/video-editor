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

export interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  trackItemId: number | null;
}
