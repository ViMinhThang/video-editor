
import { drawTimeline, loadImage } from "./timeline-draw";
import { getClickX, findTrackAtX, drawRoundedImage } from "./canvas-utils";
import { VideoClickConfig, MouseDownConfig, MouseUpConfig, RenderDraggingConfig } from "@/types/event";

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

  const draggedId = dragItemRef.current.id;
  console.log("dragged id", draggedId, " -> target id", newIndex);

  if (newIndex == null || newIndex === draggedId) {
    // thả ra mà ko có target hoặc thả vào chính nó
    dragItemRef.current = null;
    setIsDragging(false);
    return;
  }

  const updatedVideos = [...videos];
  const draggedTrack = updatedVideos.find((t) => t.id === draggedId);
  const targetTrack = updatedVideos.find((t) => t.id === newIndex);

  if (!draggedTrack || !targetTrack) return;

  // hoán đổi start/end
  const tmpStart = draggedTrack.startTime;
  const tmpEnd = draggedTrack.endTime;

  draggedTrack.startTime = targetTrack.startTime;
  draggedTrack.endTime = targetTrack.endTime;

  targetTrack.startTime = tmpStart;
  targetTrack.endTime = tmpEnd;

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
