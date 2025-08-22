import { useResizableCanvas } from "@/hooks/use-canvas-hooks";
import { useEditorContext } from "@/hooks/use-editor";
import { useTimelineContext } from "@/hooks/use-timeline";
import { useTimelineDragDrop } from "@/hooks/use-timeline-drag";
import { findTrackAtX, getClickX } from "@/lib/canvas-utils";
import { drawTimeline } from "@/lib/timeline-draw";
import {
  handleMouseUp,
  handleVideoClick,
} from "@/lib/timeline-video-interaction";
import { TimelineCanvasProps } from "@/types/timeline";
import { useCallback } from "react";

export const TimeCanvasVideo = ({
  thumbnailWidth = 60,
  thumbnailHeight = 60,
  groupGap = 10,
}: TimelineCanvasProps) => {
  const { handleContextMenu, highlightRef } = useTimelineContext();
  const { tracks, setTracks, setAsset, assets } = useEditorContext();

  const videos = tracks.video ?? [];

  // canvas render
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || videos.length === 0) return;

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

  // hook drag-drop
  const {
    isDragging,
    mouseDown,
    dragOverlay,
    onMouseDown,
    onMouseMove,
    onMouseUp,
  } = useTimelineDragDrop({
    videos,
    thumbnailWidth,
    thumbnailHeight,
    groupGap,
    canvasRef,
    onDrop: (track, e) =>
      handleMouseUp({
        e,
        canvasRef,
        videos: videos,
        dragItemRef: { current: track },
        setTracks,
        setIsDragging: () => {},
        groupGap,
        thumbnailWidth,
        trackType: "video",
      }),
  });

  // context menu
  const onContextMenu = (e: React.MouseEvent) => {
    if (isDragging) return;
    const clickX = getClickX(canvasRef.current, e); // gọn hơn
    const foundTrackId = findTrackAtX(videos, clickX, groupGap, thumbnailWidth);
    if (foundTrackId) {
      handleContextMenu(e, foundTrackId, "video", renderCanvas);
    }
  };

  // click
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

      {/* drag overlay */}
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
