import { useState, useRef } from "react";
import { getClickX, findTrackAtX } from "@/lib/canvas-utils";
import { TrackItem } from "@/types/track_item";
import { getResizeHandleAtX } from "@/lib/utils";
import { TracksState, TracksAction } from "@/types/track";

interface UseTimelineDragDropProps {
  videos: TrackItem[];
  thumbnailWidth: number;
  thumbnailHeight: number;
  groupGap: number;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  dispatchTracks: React.Dispatch<TracksAction>;
  trackType: keyof TracksState;
}

export function useTimelineDragDrop({
  videos,
  thumbnailWidth,
  thumbnailHeight,
  groupGap,
  canvasRef,
  dispatchTracks,
  trackType,
}: UseTimelineDragDropProps) {
  const dragItemRef = useRef<TrackItem | null>(null);
  const dragStartXRef = useRef<number>(0);
  const resizeItemRef = useRef<TrackItem | null>(null);
  const resizeModeRef = useRef<"left" | "right" | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [dragOverlay, setDragOverlay] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    track: TrackItem;
  } | null>(null);

  const onMouseDown = (e: React.MouseEvent) => {
    const clickX = getClickX(canvasRef.current, e);
    const foundTrackId = findTrackAtX(videos, clickX, groupGap, thumbnailWidth);
    console.log("found track",foundTrackId)
    if (!foundTrackId) return;

    const track = videos.find((t) => t.id === foundTrackId);
    console.log("adsdfsdfddfsdf",track)
    if (!track) return;

    // resize check
    const handle = getResizeHandleAtX(track, clickX, thumbnailWidth);
    if (handle) {
      console.log(handle)
      resizeModeRef.current = handle;
      resizeItemRef.current = { ...track };
      setMouseDown(true);
      return;
    }

    // drag
    dragItemRef.current = track;
    dragStartXRef.current = clickX;
    setMouseDown(true);
  };

  const onMouseMove = (e: React.MouseEvent, render: () => void) => {
    const currentX = getClickX(canvasRef.current!, e);

    // resize
    if (resizeItemRef.current && resizeModeRef.current) {
      const frameIndex = Math.round(currentX / thumbnailWidth);
      const step = 2; // hoặc 2 để mượt hơn

      let newStart = resizeItemRef.current.startTime;
      let newEnd = resizeItemRef.current.endTime;

      if (resizeModeRef.current === "left") {
        const stepIndex = Math.floor(frameIndex / step) * step;
        newStart = Math.max(0, Math.min(stepIndex, newEnd - 1));
      } else {
        const stepIndex = Math.floor(frameIndex / step) * step;
        newEnd = Math.max(newStart + 1, stepIndex);
      }

      resizeItemRef.current.startTime = newStart;
      resizeItemRef.current.endTime = newEnd;

      dispatchTracks({
        type: "RESIZE_TRACK",
        trackType,
        id: resizeItemRef.current.id,
        startTime: newStart,
        endTime: newEnd,
      });
      return;
    }

    // drag
    if (dragItemRef.current) {
      const deltaX = currentX - dragStartXRef.current;
      if (!isDragging && Math.abs(deltaX) > 2) {
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
    }
  };

  const onMouseUp = (e: React.MouseEvent) => {
    // TODO: gọi drop nếu cần
    setIsDragging(false);
    setMouseDown(false);
    setDragOverlay(null);
    resizeItemRef.current = null;
    resizeModeRef.current = null;
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
