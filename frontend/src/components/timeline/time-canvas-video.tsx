import { useResizableCanvas } from "@/hooks/use-canvas-hooks";
import { useEditorContext } from "@/hooks/use-editor";
import { useTimelineContext } from "@/hooks/use-timeline";
import { drawTimeline } from "@/lib/timeline-draw";
import {
  handleContextMenuClick,
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
  const { handleContextMenu, highlightTrackItemIdRef, animLineWidthRef } =
    useTimelineContext();
  const { tracks, setTracks, setAsset, assets } = useEditorContext();

  const dragItemRef = useRef<TrackItem | null>(null);
  const dragStartXRef = useRef<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  const [dragOverlay, setDragOverlay] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    track: TrackItem;
  } | null>(null);

  const videos = tracks.video;

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
      highlightTrackItemId: highlightTrackItemIdRef.current,
      animLineWidth: animLineWidthRef.current,
    });
  }, [
    videos,
    thumbnailWidth,
    thumbnailHeight,
    groupGap,
    highlightTrackItemIdRef,
    animLineWidthRef,
  ]);
  const canvasRef = useResizableCanvas(renderCanvas, thumbnailHeight, videos);

  // Context menu
  const onContextMenu = (e: React.MouseEvent) =>
    handleContextMenuClick({
      e,
      canvasRef,
      videos,
      groupGap,
      thumbnailWidth,
      highlightTrackItemIdRef,
      animLineWidthRef,
      render: renderCanvas,
      handleContextMenu,
    });

  // Click
  const onVideoClick = (e: React.MouseEvent) => {
    if (isDragging) return;
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

  // Mouse down → bắt đầu drag
  const onMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    const clickX = getClickX(canvasRef.current, e);
    const foundTrackId = findTrackAtX(videos, clickX, groupGap, thumbnailWidth);

    if (!foundTrackId) return;

    const track = videos.find((t) => t.id === foundTrackId);
    if (!track) return;

    dragItemRef.current = track;
    dragStartXRef.current = clickX;
    setIsDragging(true);

    // Tạo overlay
    const width = (track.video_frames?.length || 1) * thumbnailWidth;
    setDragOverlay({
      x: clickX - width / 2,
      y: 20,
      width,
      height: thumbnailHeight,
      track,
    });
  };

  // Mouse move → update overlay
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragItemRef.current || !dragOverlay) return;

    const currentX = getClickX(canvasRef.current!, e);
    const deltaX = currentX - dragStartXRef.current;

    setDragOverlay((prev) => prev && { ...prev, x: prev.x + deltaX });

    dragStartXRef.current = currentX;
  };

  // Mouse up → commit drag
  const onMouseUp = (e: React.MouseEvent) => {
    setIsDragging(false);
    setDragOverlay(null);

    if (dragItemRef.current) {
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
