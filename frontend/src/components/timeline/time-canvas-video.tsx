import { useResizableCanvas } from "@/hooks/use-canvas-hooks";
import { useEditorContext } from "@/hooks/use-editor";
import { useTimelineContext } from "@/hooks/use-timeline";
import { drawTimeline } from "@/lib/timeline-draw";
import {
  handleContextMenuClick,
  handleMouseDown,
  handleMouseUp,
  handleVideoClick,
  renderDraggingItem,
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

  const videos = tracks.video;
  const render = useCallback(() => {
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
    tracks.video,
    thumbnailWidth,
    thumbnailHeight,
    groupGap,
    highlightTrackItemIdRef,
    animLineWidthRef,
  ]);
  const canvasRef = useResizableCanvas(render, thumbnailHeight, videos);
  const onContextMenu = (e: React.MouseEvent) =>
    handleContextMenuClick({
      e,
      canvasRef,
      videos,
      groupGap,
      thumbnailWidth,
      highlightTrackItemIdRef,
      animLineWidthRef,
      render,
      handleContextMenu,
    });

  const onVideoClick = (e: React.MouseEvent) => {
    if (isDragging) return; // ignore click khi đang drag

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

  const onMouseDown = (e: React.MouseEvent) => {
    handleMouseDown({
      e,
      canvasRef,
      videos: tracks.video,
      dragItemRef,
      dragStartXRef,
      setIsDragging,
    });
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragItemRef.current || !canvasRef.current) return;

    const currentX = getClickX(canvasRef.current, e);
    const deltaX = currentX - dragStartXRef.current;

    renderDraggingItem({
      canvasRef,
      tracks: tracks.video,
      dragItemRef,
      deltaX,
      thumbnailWidth,
      thumbnailHeight,
      groupGap,
      highlightTrackItemIdRef,
      animLineWidthRef,
    });
  };
  const onMouseUp = (e: React.MouseEvent) => {
    handleMouseUp({
      e,
      canvasRef,
      videos: tracks.video,
      dragItemRef,
      setTracks,
      setIsDragging,
      groupGap,
      thumbnailWidth,
    });
  };

  return (
    <canvas
      ref={canvasRef}
      onContextMenu={onContextMenu}
      onClick={onVideoClick}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      style={{
        display: "block",
        width: "100%",
        height: `${thumbnailHeight + 20}px`,
      }}
    />
  );
};
