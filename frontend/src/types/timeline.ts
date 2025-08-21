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

  // Context menu state
  contextMenu: {
    visible: boolean;
    x: number;
    y: number;
    trackItemId: number | null;
  };

  // Highlight / animation refs
  highlightTrackItemIdRef: React.RefObject<number | null>;
  animLineWidthRef: React.RefObject<number>;

  // Drag / resize refs
  dragState?: {
    activeTrackItemId: React.RefObject<number | null>;
    startX: React.RefObject<number>;
    startWidth: React.RefObject<number>;
    isDragging: React.RefObject<boolean>;
    isResizing: React.RefObject<boolean>;
  };

  // Handlers
  handleContextMenu: (e: React.MouseEvent<HTMLDivElement>, trackItemId: number) => void;
  handleDownload: (trackItemId?: number) => void;

  // State setters
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
