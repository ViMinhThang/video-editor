/**
 * @what Interaction logic for the subtitle track.
 * @why Enables precise selection and context-menu triggering for text segments in the timeline.
 * @how Synchronizes with the 'precalculateTimelineLayout' utility to perform O(1) pixel-perfect hit lookups.
 */

import { RefObject } from "react";
import { getClickX, findTrackIdAtPixel, precalculateTimelineLayout } from "@/lib/utils";
import type { TrackItem } from "@/types";

interface SubtitleContextMenuConfig {
  e: React.MouseEvent;
  canvasRef: RefObject<HTMLCanvasElement>;
  texts: TrackItem[];
  groupGap: number;
  highlightTrackItemIdRef: React.MutableRefObject<number | null>;
  animLineWidthRef: React.MutableRefObject<number>;
  render: () => void;
  handleContextMenu?: (e: React.MouseEvent, id: number) => void;
}

export const handleSubtitleContextMenuClick = (config: SubtitleContextMenuConfig) => {
  const {
     e, canvasRef, texts, groupGap,
     highlightTrackItemIdRef, animLineWidthRef, render, handleContextMenu
  } = config;

  e.preventDefault();
  if (!canvasRef.current) return;

  const clickX = getClickX(canvasRef.current, e);

  // Time-based layout pre-calculation
  const pxPerSecond = 40;
  const layout = precalculateTimelineLayout(texts, groupGap, pxPerSecond, true);
  const foundTrackItemId = findTrackIdAtPixel(layout, clickX);

  highlightTrackItemIdRef.current = foundTrackItemId;
  animLineWidthRef.current = 0;
  render();

  if (foundTrackItemId != null) {
    handleContextMenu?.(e, foundTrackItemId);
  }
};
