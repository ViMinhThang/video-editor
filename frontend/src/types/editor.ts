import { Project, Asset } from ".";
import { TrackItem, VideoFrame } from "./track_item";

export interface EditorContextType {
  project: Project | null;
  projectId: string;
  assets: Asset[];
  asset: Asset | null;
  tracks: Record<string, TrackItem[]>;
  frames: VideoFrame[];
  duration: number;
  fileInputRef: React.RefObject<HTMLInputElement>;

  setAsset: React.Dispatch<React.SetStateAction<Asset | null>>;
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
  setTracks: React.Dispatch<React.SetStateAction<Record<string, TrackItem[]>>>;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
  addTextItem: (time: number, asset_id: number) => Promise<void>;
  fetchProject: () => Promise<void>;
  handleUploadFile: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  addTrackItem: (asset: Asset) => Promise<void>;
}
export interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  trackItemId: number | null;
}