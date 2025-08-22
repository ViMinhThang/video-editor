import { drawTimeline, loadImage } from "./timeline-draw";
import { getClickX, findTrackAtX, drawRoundedImage } from "./canvas-utils";
import {
  VideoClickConfig,
  MouseDownConfig,
  MouseUpConfig,
  RenderDraggingConfig,
} from "@/types/event";

export const handleVideoClick = ({
  e,
  canvasRef,
  tracks,
  assets,
  setAsset,
  groupGap,
  thumbnailWidth,
  highlightRef,
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
      highlightRef.current.id = foundTrackItemId;
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
  trackType,
}: MouseUpConfig) => {
  if (!dragItemRef.current || !canvasRef.current) return;

  const currentX = getClickX(canvasRef.current, e);
  const newIndex = findTrackAtX(videos, currentX, groupGap, thumbnailWidth);

  const draggedId = dragItemRef.current.id;
  console.log("dragged id", draggedId, " -> target id", newIndex);

  if (newIndex == null || newIndex === draggedId) {
    dragItemRef.current = null;
    setIsDragging(false);
    return;
  }

  const updatedTracks = [...videos];
  const draggedTrack = updatedTracks.find((t) => t.id === draggedId);
  const targetTrack = updatedTracks.find((t) => t.id === newIndex);

  if (!draggedTrack || !targetTrack) return;

  // swap start/end
  [draggedTrack.startTime, targetTrack.startTime] = [
    targetTrack.startTime,
    draggedTrack.startTime,
  ];
  [draggedTrack.endTime, targetTrack.endTime] = [
    targetTrack.endTime,
    draggedTrack.endTime,
  ];

  console.log("updated tracks", updatedTracks);

  setTracks((prev) => ({
    ...prev,
    [trackType]: updatedTracks,
  }));

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
