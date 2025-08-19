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
  children: React.ReactNode;
  frames: any[];
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
export interface TimeCanvasSubtitleProps {
  groupGap: number;
  thumbnailHeight?: number;
}
export interface TimeDisplayProps {
  currentTime: number;
  duration: number;
}
