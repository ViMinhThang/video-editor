import { createContext, useState, useRef, ReactNode, MouseEvent } from "react";
import { downloadTrackItem } from "@/api/track-api";
import { download, selectTrackItemContext } from "@/services/timeline-action";
import { ContextMenuState } from "@/types/editor";
import { TimelineContextType, TimeLineProps } from "@/types/timeline";

// ---------- Context ----------
export const TimelineContext = createContext<TimelineContextType | undefined>(undefined);

// ---------- Provider ----------
interface TimelineProviderProps extends TimeLineProps {
  children: ReactNode;
}

export const TimelineProvider = ({ children, frames, setCurrentTime }: TimelineProviderProps) => {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    trackItemId: null,
  });

  // Refs cho highlight animation
  const highlightState = {
    trackItemIdRef: useRef<number | null>(null),
    animLineWidthRef: useRef<number>(2),
    animationFrameRef: useRef<number | null>(null),
  };

  const resetHighlight = () => {
    setContextMenu({ visible: false, x: 0, y: 0, trackItemId: null });
    highlightState.trackItemIdRef.current = null;
    highlightState.animLineWidthRef.current = 0;
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    // TODO: implement cursor drag logic
  };

  const handleContextMenu = (e: MouseEvent, trackItemId: number) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, trackItemId });

    selectTrackItemContext(
      highlightState.trackItemIdRef,
      highlightState.animLineWidthRef,
      highlightState.animationFrameRef,
      trackItemId
    );
  };

  const handleDownload = async () => {
    if (!contextMenu.trackItemId) return;

    const trackItem = frames.find((f) => f.track_item_id === contextMenu.trackItemId);
    if (!trackItem) return;

    const response = await downloadTrackItem(contextMenu.trackItemId);
    download(response.data, "cutted.mp4", "video/mp4");

    resetHighlight();
  };

  return (
    <TimelineContext.Provider
      value={{
        frames,
        setCurrentTime,
        contextMenu,
        highlightTrackItemIdRef: highlightState.trackItemIdRef,
        animLineWidthRef: highlightState.animLineWidthRef,
        handleMouseDown,
        handleContextMenu,
        handleDownload,
        setContextMenu,
      }}
    >
      {children}
    </TimelineContext.Provider>
  );
};
