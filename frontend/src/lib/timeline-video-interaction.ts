import { RefObject } from "react";
import { findTrackAtX, getClickX } from "@/lib/utils";
import { Asset, TrackItem } from "@/types";

type ContextMenuConfig = {
  e: React.MouseEvent;
  canvasRef: RefObject<HTMLCanvasElement>;
  videos: TrackItem[];
  groupGap: number;
  thumbnailWidth: number;
  highlightTrackItemIdRef: React.MutableRefObject<number | null>;
  animLineWidthRef: React.MutableRefObject<number>;
  render: () => void;
  handleContextMenu?: (e: React.MouseEvent, id: number) => void;
};

export const handleContextMenuClick = ({
  e,
  canvasRef,
  videos,
  groupGap,
  thumbnailWidth,
  highlightTrackItemIdRef,
  animLineWidthRef,
  render,
  handleContextMenu,
}: ContextMenuConfig) => {
  e.preventDefault();
  if (!canvasRef.current) return;

  const clickX = getClickX(canvasRef.current, e);
  const foundTrackItemId = findTrackAtX(
    videos,
    clickX,
    groupGap,
    thumbnailWidth
  );

  highlightTrackItemIdRef.current = foundTrackItemId;
  animLineWidthRef.current = 0;
  render();

  if (foundTrackItemId != null) {
    handleContextMenu?.(e, foundTrackItemId);
  }
};

type VideoClickConfig = {
  e: React.MouseEvent;
  canvasRef: RefObject<HTMLCanvasElement>;
  tracks: Record<string, TrackItem[]>;
  assets: Asset[];
  setAsset: React.Dispatch<React.SetStateAction<Asset | undefined>>;
  groupGap: number;
  thumbnailWidth: number;
};

export const handleVideoClick = ({
  e,
  canvasRef,
  tracks,
  assets,
  setAsset,
  groupGap,
  thumbnailWidth,
}: VideoClickConfig) => {
  if (!canvasRef.current) return;

  const clickX = getClickX(canvasRef.current, e);
  const foundTrackItemId = findTrackAtX(
    tracks.video,
    clickX,
    groupGap,
    thumbnailWidth
  );

  if (foundTrackItemId != null) {
    const trackItem = tracks.video.find((t) => t.id === foundTrackItemId);
    const foundAsset = assets.find((a) => a.id === trackItem?.assetId);
    if (foundAsset) {
      setAsset(foundAsset);
    }
  }
};
