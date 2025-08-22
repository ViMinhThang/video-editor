import { useEditorContext } from "@/hooks/use-editor";
import { useTimelineContext } from "@/hooks/use-timeline";
import { drawSubtitleTimeline } from "@/lib/timeline-draw";
import { useCallback } from "react";
import { useResizableCanvas } from "@/hooks/use-canvas-hooks";
import { TimeCanvasSubtitleProps } from "@/types/timeline";
import { handleMouseUp } from "@/lib/timeline-video-interaction";
import { findTrackAtX, getClickX } from "@/lib/canvas-utils";
import { useTimelineDragDrop } from "@/hooks/use-timeline-drag";

export const TimeCanvasSubtitle = ({
  groupGap,
  thumbnailHeight = 30,
}: TimeCanvasSubtitleProps) => {
  const { handleContextMenu, highlightRef } = useTimelineContext();
  const { tracks, setTracks } = useEditorContext();

  const texts = tracks.text ?? [];

  const thumbnailWidth = 60; // fixed cho subtitle block

  // render canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    drawSubtitleTimeline({
      canvas,
      texts,
      groupGap,
      thumbnailHeight,
      highlightTrackItemId:
        highlightRef.current.type === "subtitle"
          ? highlightRef.current.id
          : null,
    });
  }, [texts, groupGap, thumbnailHeight, highlightRef]);

  const canvasRef = useResizableCanvas(renderCanvas, thumbnailHeight, texts);

  // drag-drop hook
  const { isDragging, dragOverlay, onMouseDown, onMouseMove, onMouseUp } =
    useTimelineDragDrop({
      videos: texts, // reuse: videos = texts ở đây
      thumbnailWidth,
      thumbnailHeight,
      groupGap,
      canvasRef,
      onDrop: (track, e) =>
        handleMouseUp({
          e,
          canvasRef,
          videos: texts,
          dragItemRef: { current: track },
          setTracks,
          setIsDragging: () => {},
          groupGap,
          thumbnailWidth,
          trackType: "text",
        }),
    });

  // context menu
  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;

    const clickX = getClickX(canvasRef.current, e);
    const foundTrackId = findTrackAtX(texts, clickX, groupGap, thumbnailWidth);

    if (foundTrackId) {
      handleContextMenu(e, foundTrackId, "subtitle", renderCanvas);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%" }}
        onContextMenu={onContextMenu}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      />

      {dragOverlay && (
        <div
          style={{
            position: "absolute",
            left: dragOverlay.x,
            top: dragOverlay.y,
            width: dragOverlay.width,
            height: dragOverlay.height,
            backgroundColor: "rgba(255, 200, 0, 0.6)",
            borderRadius: "4px",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};
