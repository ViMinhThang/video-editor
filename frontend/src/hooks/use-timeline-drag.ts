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

  // chỉ lưu id + start/end, không copy nguyên object (tránh flickering)
  const resizeItemRef = useRef<{ id: number; startTime: number; endTime: number } | null>(null);
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
    if (!foundTrackId) return;

    const track = videos.find((t) => t.id === foundTrackId);
    if (!track) return;

    // resize check
    const handle = getResizeHandleAtX(track, clickX, thumbnailWidth);
    if (handle) {
      resizeModeRef.current = handle;
      resizeItemRef.current = {
        id: track.id,
        startTime: track.startTime,
        endTime: track.endTime,
      };
      setMouseDown(true);
      return;
    }

    // drag
    dragItemRef.current = track;
    dragStartXRef.current = clickX;
    setMouseDown(true);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const currentX = getClickX(canvasRef.current!, e);

    // ================= RESIZE =================
    if (resizeItemRef.current && resizeModeRef.current) {
      const pxToTime = 1 / thumbnailWidth;
      let { startTime, endTime } = resizeItemRef.current;

      if (resizeModeRef.current === "left") {
        startTime = Math.max(0, Math.min(currentX * pxToTime, endTime - 0.1));
      } else {
        endTime = Math.max(startTime + 0.1, currentX * pxToTime);
      }

      // lưu vào ref để tránh lệch khi kéo tiếp
      resizeItemRef.current.startTime = startTime;
      resizeItemRef.current.endTime = endTime;

      // dispatch realtime → state update liên tục, không flicker
      dispatchTracks({
        type: "RESIZE_TRACK",
        trackType,
        id: resizeItemRef.current.id,
        startTime,
        endTime,
      });
      return;
    }

    // ================= DRAG =================
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

  const onMouseUp = () => {
    setIsDragging(false);
    setMouseDown(false);
    setDragOverlay(null);

    // reset refs
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
