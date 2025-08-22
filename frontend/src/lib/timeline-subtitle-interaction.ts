import { TrackItem } from "@/types/track_item";
import { RefObject } from "react";
import { getClickX, findTrackAtX } from "./canvas-utils";

type SubtitleContextMenuConfig = {
  e: React.MouseEvent;
  canvasRef: RefObject<HTMLCanvasElement>;
  texts: TrackItem[];
  groupGap: number;
  highlightTrackItemIdRef: React.RefObject<number | null>;
  animLineWidthRef: React.RefObject<number>;
  render: () => void;
  handleContextMenu?: (e: React.MouseEvent, id: number) => void;
};

export const handleSubtitleContextMenuClick = ({
  e,
  canvasRef,
  texts,
  groupGap,
  highlightTrackItemIdRef,
  animLineWidthRef,
  render,
  handleContextMenu,
}: SubtitleContextMenuConfig) => {
  e.preventDefault();
  if (!canvasRef.current) return;

  const clickX = getClickX(canvasRef.current, e);

  const foundTrackItemId = findTrackAtX(texts, clickX, groupGap, 0, 40);

  highlightTrackItemIdRef.current = foundTrackItemId;
  animLineWidthRef.current = 0;
  render();

  if (foundTrackItemId != null) {
    handleContextMenu?.(e, foundTrackItemId);
  }
};
