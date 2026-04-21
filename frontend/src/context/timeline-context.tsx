/**
 * @what Context provider for the visual timeline interaction layer.
 * @why Manages ephemeral state like context menus, playhead dragging, and visual highlights for selected track items.
 * @how Synchronizes interacton logic with the 'TimelineActions' service and coordinates with context-aware canvases.
 */

import React, { createContext, useState, useRef } from "react";
import type { ReactNode, MouseEvent } from "react";
import { downloadTrackItem } from "@/api/track-api";
import { download, selectTrackItemContext } from "../features/editor/services/TimelineActions";
import type { ContextMenuState } from "@/types/editor";
import type { TimelineContextType, TimeLineProps } from "@/types/timeline";

export const TimelineContext = createContext<TimelineContextType | null>(null);

const initialContextMenu: ContextMenuState = {
  visible: false,
  x: 0,
  y: 0,
  trackItemId: null,
};

export const TimelineProvider = ({
  children,
  frames,
  setCurrentTime,
}: TimeLineProps) => {
  const [contextMenu, setContextMenu] = useState(initialContextMenu);

  const highlightState = {
    trackItemIdRef: useRef<number | null>(null),
    animLineWidthRef: useRef<number>(2),
    animationFrameRef: useRef<number | null>(null),
  };

  const resetHighlight = () => {
    setContextMenu(initialContextMenu);
    highlightState.trackItemIdRef.current = null;
    highlightState.animLineWidthRef.current = 0;
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    // Implement cursor movement logic if required
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
    const trackItem = frames.find(
      (f) => f.track_item_id === contextMenu.trackItemId
    );
    if (!trackItem) return;
    try {
      const response = await downloadTrackItem(contextMenu.trackItemId);
      download(response.data, "video-export.mp4", "video/mp4");
      setContextMenu(initialContextMenu);
      resetHighlight();
    } catch (err) {
      console.error("Failed to download track item:", err);
    }
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
