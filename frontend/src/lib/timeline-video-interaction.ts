import { RefObject } from "react";
import { applyHighlight, drawRoundedImage, findTrackAtX, getClickX } from "@/lib/utils";
import { Asset } from "@/types";
import { TrackItem } from "@/types/track_item";
import { drawTimeline, loadImage } from "./timeline-draw";

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

type RenderDraggingConfig = {
  canvasRef: RefObject<HTMLCanvasElement>;
  tracks: TrackItem[]; // các track đã sort theo timeline
  dragItemRef: React.MutableRefObject<TrackItem | null>;
  deltaX: number;
  thumbnailWidth: number;
  thumbnailHeight: number;
  groupGap: number;
  highlightTrackItemIdRef: React.MutableRefObject<number | null>;
  animLineWidthRef: React.MutableRefObject<number>;
};


type MouseDownConfig = {
  e: React.MouseEvent;
  canvasRef: RefObject<HTMLCanvasElement>;
  videos: TrackItem[];
  dragItemRef: React.RefObject<TrackItem | null>;
  dragStartXRef: React.RefObject<number>;
  setIsDragging: (value: boolean) => void;
};
type MouseUpConfig = {
  e: React.MouseEvent;
  canvasRef: RefObject<HTMLCanvasElement>;
  videos: TrackItem[];
  dragItemRef: React.MutableRefObject<TrackItem | null>;
  setTracks: React.Dispatch<React.SetStateAction<{ video: TrackItem[] }>>;
  setIsDragging: (value: boolean) => void;
  groupGap: number;
  thumbnailWidth: number;
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
      console.log(1);
    }
  }
};
export const handleMouseDown = ({
  e,
  canvasRef,
  videos,
  dragItemRef,
  dragStartXRef,
  setIsDragging,
}: MouseDownConfig) => {
  if (!canvasRef.current) return;

  const clickX = getClickX(canvasRef.current, e);
  const foundTrackItemId = findTrackAtX(videos, clickX, 10, 60); // groupGap và thumbnailWidth có thể truyền thêm nếu cần

  if (foundTrackItemId != null) {
    dragItemRef.current = videos.find((t) => t.id === foundTrackItemId) || null;
    dragStartXRef.current = clickX;
    setIsDragging(true);
  }
};
export const handleMouseUp = ({
  e,
  canvasRef,
  videos,
  dragItemRef,
  setTracks,
  setIsDragging,
  groupGap,
  thumbnailWidth,
}: MouseUpConfig) => {
  if (!dragItemRef.current || !canvasRef.current) return;

  const currentX = getClickX(canvasRef.current, e);
  const newIndex = findTrackAtX(videos, currentX, groupGap, thumbnailWidth);
  console.log("newIndex", newIndex);
  console.log("draggred index", dragItemRef.current.id);
  const updatedVideos = [...videos];

  const draggedTrack = updatedVideos.find(
    (t) => t.id === dragItemRef.current!.id
  );
  const targetTrack = updatedVideos.find((track) => track.id === newIndex);

  if (!draggedTrack || !targetTrack) return;

  // Hoán đổi startTime & endTime
  [draggedTrack.startTime, targetTrack.startTime] = [
    targetTrack.startTime,
    draggedTrack.startTime,
  ];
  [draggedTrack.endTime, targetTrack.endTime] = [
    targetTrack.endTime,
    draggedTrack.endTime,
  ];
  console.log("updated tracks", updatedVideos);
  setTracks((prev) => ({ ...prev, video: updatedVideos }));

  dragItemRef.current = null;
  setIsDragging(false);
};
export const renderDraggingItem = async ({
  canvasRef,
  tracks,
  dragItemRef,
  deltaX,
  thumbnailWidth,
  thumbnailHeight,
  groupGap,
  highlightTrackItemIdRef,
  animLineWidthRef,
}: RenderDraggingConfig) => {
  if (!canvasRef.current || !dragItemRef.current) return;
  const ctx = canvasRef.current.getContext("2d");
  if (!ctx) return;

  // Clear canvas trước khi vẽ lại
  ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

  // Vẽ timeline bình thường
  drawTimeline({
    canvas: canvasRef.current,
    videos: tracks,
    thumbnailWidth,
    thumbnailHeight,
    groupGap,
    highlightTrackItemId: highlightTrackItemIdRef.current,
  });

  // Tính originalX của track đang kéo
  let xOffset = 0;
  for (const track of tracks) {
    if (track.id === dragItemRef.current.id) {
    }
    const framesInTrack = track.video_frames ?? [];
    xOffset += framesInTrack.length * thumbnailWidth + groupGap;
  }

  const framesInDraggedTrack = dragItemRef.current.video_frames ?? [];
  const width = framesInDraggedTrack.length * thumbnailWidth;
  const images = await Promise.all(
    framesInDraggedTrack.map((f) =>
      loadImage(import.meta.env.VITE_API_BASE_URL + f.url)
    )
  );
  const imageMap: Record<number, HTMLImageElement> = {};
  framesInDraggedTrack.forEach((f, i) => (imageMap[f.id] = images[i]));
  framesInDraggedTrack.forEach((frame, idx) => {
    const img = imageMap[frame.id];
    drawRoundedImage(
      ctx,
      img,
      xOffset + idx * thumbnailWidth,
      20,
      thumbnailWidth,
      thumbnailHeight,
      8,
      idx === 0,
      idx === framesInDraggedTrack.length - 1
    );
  });
};
