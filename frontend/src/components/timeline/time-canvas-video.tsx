import { useResizableCanvas } from "@/hooks/use-canvas-hooks";
import { useEditorContext } from "@/hooks/use-editor";
import { useTimelineContext } from "@/hooks/use-timeline";
import { drawTimeline } from "@/lib/timeline-draw";
import {
  handleMouseUp,
  handleVideoClick,
} from "@/lib/timeline-video-interaction";
import { findTrackAtX, getClickX } from "@/lib/utils";
import { TimelineCanvasProps } from "@/types/timeline";
import { TrackItem } from "@/types/track_item";
import { useCallback, useRef, useState } from "react";

export const TimeCanvasVideo = ({
  thumbnailWidth = 60,
  thumbnailHeight = 60,
  groupGap = 10,
}: TimelineCanvasProps) => {
  const { handleContextMenu, highlightRef } = useTimelineContext();
  const { tracks, setTracks, setAsset, assets } = useEditorContext();

  const videos = tracks.video;

  // refs + states cho drag
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

  const DRAG_THRESHOLD = 5; // px

  // Render timeline canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    drawTimeline({
      canvas,
      videos,
      thumbnailWidth,
      thumbnailHeight,
      groupGap,
      highlightTrackItemId:
        highlightRef.current.type === "video" ? highlightRef.current.id : null,
    });
  }, [videos, thumbnailWidth, thumbnailHeight, groupGap, highlightRef]);

  const canvasRef = useResizableCanvas(renderCanvas, thumbnailHeight, videos);

  // Context menu (chuột phải)
  const onContextMenu = (e: React.MouseEvent) => {
    if (isDragging) return;
    const clickX = getClickX(canvasRef.current!, e);
    const foundTrackId = findTrackAtX(videos, clickX, groupGap, thumbnailWidth);
    if (foundTrackId) {
      handleContextMenu(e, foundTrackId, "video", renderCanvas);
    }
  };

  // Click (chuột trái)
  const onVideoClick = (e: React.MouseEvent) => {
    if (isDragging || mouseDown) return;
    handleVideoClick({
      e,
      canvasRef,
      tracks,
      assets,
      setAsset,
      groupGap,
      thumbnailWidth,
    });
  };

  // Mouse down → chuẩn bị drag
  // Mouse down → chuẩn bị drag
  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // chỉ xử lý chuột trái

    if (!canvasRef.current) return;

    const clickX = getClickX(canvasRef.current, e);
    const foundTrackId = findTrackAtX(videos, clickX, groupGap, thumbnailWidth);
    if (!foundTrackId) return;

    const track = videos.find((t) => t.id === foundTrackId);
    if (!track) return;

    dragItemRef.current = track;
    dragStartXRef.current = clickX;
    setMouseDown(true);
  };

  // Mouse move → check ngưỡng và drag overlay
  const onMouseMove = (e: React.MouseEvent) => {
    if (!mouseDown || !dragItemRef.current) return;

    const currentX = getClickX(canvasRef.current!, e);
    const deltaX = currentX - dragStartXRef.current;

    if (!isDragging && Math.abs(deltaX) > DRAG_THRESHOLD) {
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

    if (isDragging && dragOverlay) {
      setDragOverlay((prev) => prev && { ...prev, x: prev.x + deltaX });
      dragStartXRef.current = currentX;
    }
  };

  // Mouse up → kết thúc drag hoặc click
  const onMouseUp = (e: React.MouseEvent) => {
    if (isDragging && dragItemRef.current) {
      // commit drag
      handleMouseUp({
        e,
        canvasRef,
        videos,
        dragItemRef,
        setTracks,
        setIsDragging,
        groupGap,
        thumbnailWidth,
      });
    }

    // reset
    setIsDragging(false);
    setMouseDown(false);
    setDragOverlay(null);
    dragItemRef.current = null;
  };

  return (
    <div style={{ position: "relative" }}>
      <canvas
        ref={canvasRef}
        onContextMenu={onContextMenu}
        onClick={onVideoClick}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        style={{
          display: "block",
          width: "100%",
          height: `${thumbnailHeight + 20}px`,
        }}
      />

      {dragOverlay && (
        <div
          style={{
            position: "absolute",
            left: dragOverlay.x,
            top: dragOverlay.y,
            width: dragOverlay.width,
            height: dragOverlay.height,
            backgroundColor: "rgba(0,150,255,0.7)",
            borderRadius: "4px",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};
