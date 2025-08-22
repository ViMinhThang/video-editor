import { createContext, useState, useRef, ReactNode, MouseEvent } from "react";
import { downloadTrackItem } from "@/api/track-api";
import { download } from "@/services/timeline-action";
import { ContextMenuState } from "@/types/editor";
import {
  HighlightState,
  TimelineContextType,
  TimeLineProps,
} from "@/types/timeline";

// ---------- Context ----------
export const TimelineContext = createContext<TimelineContextType | undefined>(
  undefined
);

// ---------- Types ----------

// ---------- Provider ----------
interface TimelineProviderProps extends TimeLineProps {
  children: ReactNode;
}

export const TimelineProvider = ({
  children,
  frames,
  setCurrentTime,
}: TimelineProviderProps) => {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    trackItemId: null,
  });

  // Highlight state (chỉ 1 item tại 1 thời điểm)
  const highlightState = {
    ref: useRef<HighlightState>({ id: null, type: null }),
    animationFrameRef: useRef<number | null>(null),
  };

  const resetHighlight = () => {
    setContextMenu({ visible: false, x: 0, y: 0, trackItemId: null });
    highlightState.ref.current = { id: null, type: null };
  };

  const handleContextMenu = (
    e: MouseEvent,
    trackItemId: number,
    type: "video" | "subtitle",
    render: () => void
  ) => {
    e.preventDefault();

    // đảm bảo chỉ 1 item được chọn
    highlightState.ref.current = { id: trackItemId, type };

    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, trackItemId });

    render();
  };

  const handleDownload = async () => {
    if (!contextMenu.trackItemId) return;

    const trackItem = frames.find(
      (f) => f.track_item_id === contextMenu.trackItemId
    );
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
        highlightRef: highlightState.ref,
        handleContextMenu,
        handleDownload,
        setContextMenu,
      }}
    >
      {children}
    </TimelineContext.Provider>
  );
};
