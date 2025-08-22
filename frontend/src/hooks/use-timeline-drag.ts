import { useState, useRef } from "react";
import { getClickX, findTrackAtX } from "@/lib/canvas-utils";
import { TrackItem } from "@/types/track_item";

interface UseTimelineDragDropProps {
  videos: TrackItem[];
  thumbnailWidth: number;
  thumbnailHeight: number;
  groupGap: number;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onDrop: (track: TrackItem, e: React.MouseEvent) => void;
}

export function useTimelineDragDrop({
  videos,
  thumbnailWidth,
  thumbnailHeight,
  groupGap,
  canvasRef,
  onDrop,
}: UseTimelineDragDropProps) {
  const dragItemRef = useRef<TrackItem | null>(null);
  const dragStartXRef = useRef<number>(0);

  const [isDragging, setIsDragging] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [dragOverlay, setDragOverlay] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    track: TrackItem;
  } | null>(null);

  // mouse down → chuẩn bị drag
  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || !canvasRef.current) return;
    const clickX = getClickX(canvasRef.current, e);
    console.log("clickX",clickX)
    const foundTrackId = findTrackAtX(videos, clickX, groupGap, thumbnailWidth);
    console.log("founded trackId",foundTrackId)
    const track = videos.find((t) => t.id === foundTrackId);
    if (!track) return;

    dragItemRef.current = track;
    dragStartXRef.current = clickX;
    setMouseDown(true);
  };

  // mouse move → cập nhật overlay
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragItemRef.current) return;

    const currentX = getClickX(canvasRef.current!, e);
    const deltaX = currentX - dragStartXRef.current;

    if (!isDragging && Math.abs(deltaX) > 2) {
      // bắt đầu drag
      setIsDragging(true);

      const width =
        (dragItemRef.current.video_frames?.length || 1) * thumbnailWidth;
      setDragOverlay({
        x: dragStartXRef.current - width / 2,
        y: 20,
        width,
        height: thumbnailHeight,
        track: dragItemRef.current,
      });
    }

    if (isDragging) {
      setDragOverlay((prev) => prev && { ...prev, x: prev.x + deltaX });
      dragStartXRef.current = currentX;
    }
  };

  // mouse up → drop
  const onMouseUp = (e: React.MouseEvent) => {
    if (isDragging && dragItemRef.current) {
      onDrop(dragItemRef.current, e);
    }

    // reset
    setIsDragging(false);
    setMouseDown(false);
    setDragOverlay(null);
    dragItemRef.current = null;
  };

  return {
    isDragging,
    mouseDown,
    dragOverlay,
    onMouseDown,
    onMouseMove,
    onMouseUp,
  };
}
