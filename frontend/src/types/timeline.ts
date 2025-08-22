import { Asset } from ".";
import { ContextMenuState } from "./editor";

export interface TimelineCanvasProps {
  thumbnailWidth?: number;
  thumbnailHeight?: number;
  groupGap?: number;
}
export interface TimelineRulerProps {
  width: number;
  height: number;
  duration: number;
  scale: number;
}
export interface TimeLineProps {
  frames: any[];
  setCurrentTime: (time: number) => void;
}

// highlight state: chỉ 1 item tại 1 thời điểm
export type HighlightState = {
  id: number | null;
  type: "video" | "subtitle" | null;
};
export interface TimelineContextType {
  frames: any[];
  setCurrentTime: (time: number) => void;

  contextMenu: ContextMenuState;
  setContextMenu: React.Dispatch<React.SetStateAction<ContextMenuState>>;

  // highlight item
  highlightRef: React.RefObject<HighlightState>;

  // actions
  handleContextMenu: (
    e: React.MouseEvent,
    trackItemId: number,
    type: "video" | "subtitle",
    render: () => void
  ) => void;
  handleOnClick: (
    e: React.MouseEvent,
    trackItemId: number,
    type: "video" | "subtitle",
    render: () => void
  ) => void;

  handleDownload: () => Promise<void>;
}

export interface TimeCanvasSubtitleProps {
  groupGap: number;
  thumbnailHeight?: number;
}
export interface TimeDisplayProps {
  currentTime: number;
  duration: number;
}
export interface TimelineRulerDrawOptions {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  duration: number;
  scale: number;
}
