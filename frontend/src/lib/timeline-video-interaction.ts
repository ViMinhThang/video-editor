/**
 * @what High-precision interaction logic for the timeline video track.
 * @why Provides pixel-perfect hit detection for selecting clips and triggering context menus.
 * @how Leverages pre-calculated layout metrics to determine item occupancy at any given pixel coordinate.
 */

import { RefObject } from "react";
import { findTrackIdAtPixel, getClickX, precalculateTimelineLayout } from "@/lib/utils";
import type { Asset, TrackItem } from "@/types";

interface ContextMenuConfig {
  e: React.MouseEvent;
  canvasRef: RefObject<HTMLCanvasElement>;
  videos: TrackItem[];
  groupGap: number;
  thumbnailWidth: number;
  highlightTrackItemIdRef: React.MutableRefObject<number | null>;
  animLineWidthRef: React.MutableRefObject<number>;
  render: () => void;
  handleContextMenu?: (e: React.MouseEvent, id: number) => void;
}

export const handleContextMenuClick = (config: ContextMenuConfig) => {
  const {
    e, canvasRef, videos, groupGap, thumbnailWidth,
    highlightTrackItemIdRef, animLineWidthRef, render, handleContextMenu
  } = config;

  e.preventDefault();
  if (!canvasRef.current) return;

  const clickX = getClickX(canvasRef.current, e);
  const layout = precalculateTimelineLayout(videos, groupGap, thumbnailWidth, false);
  const foundTrackItemId = findTrackIdAtPixel(layout, clickX);

  highlightTrackItemIdRef.current = foundTrackItemId;
  animLineWidthRef.current = 0;
  render();

  if (foundTrackItemId != null) {
    handleContextMenu?.(e, foundTrackItemId);
  }
};

interface VideoClickConfig {
  e: React.MouseEvent;
  canvasRef: RefObject<HTMLCanvasElement>;
  tracks: Record<string, TrackItem[]>;
  assets: Asset[];
  setAsset: React.Dispatch<React.SetStateAction<Asset | undefined>>;
  groupGap: number;
  thumbnailWidth: number;
}

export const handleVideoClick = (config: VideoClickConfig) => {
  const {
    e, canvasRef, tracks, assets, setAsset, groupGap, thumbnailWidth
  } = config;

  if (!canvasRef.current) return;

  const clickX = getClickX(canvasRef.current, e);
  const layout = precalculateTimelineLayout(tracks.video, groupGap, thumbnailWidth, false);
  const foundTrackItemId = findTrackIdAtPixel(layout, clickX);

  if (foundTrackItemId != null) {
    const trackItem = tracks.video.find((t) => t.id === foundTrackItemId);
    const foundAsset = assets.find((a) => a.id === trackItem?.asset_id);
    if (foundAsset) {
      setAsset(foundAsset);
    }
  }
};
