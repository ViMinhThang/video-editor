import { useEditorContext } from "@/hooks/use-editor";
import { useTimelineContext } from "@/hooks/use-timeline";
import { drawSubtitleTimeline } from "@/lib/timeline-draw";
import { useCallback } from "react";
import { useResizableCanvas } from "@/hooks/use-canvas-hooks";
import { getClickX, findTrackAtX } from "@/lib/utils";
import { TimeCanvasSubtitleProps } from "@/types/timeline";

export const TimeCanvasSubtitle = ({
  groupGap,
  thumbnailHeight = 30,
}: TimeCanvasSubtitleProps) => {
  const { handleContextMenu, highlightRef, animLineWidthRef } =
    useTimelineContext();
  const { tracks } = useEditorContext();

  const texts = tracks.text;

  // Render canvas
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    drawSubtitleTimeline({
      canvas,
      texts,
      groupGap,
      thumbnailHeight,
      highlightTrackItemId:
        highlightRef.current.type === "subtitle" ? highlightRef.current.id : null,
    });
  }, [texts, groupGap, thumbnailHeight, highlightRef]);

  const canvasRef = useResizableCanvas(render, thumbnailHeight, texts);

  // Right-click để select + mở context menu
  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;

    const clickX = getClickX(canvasRef.current, e);
    const foundTrackId = findTrackAtX(texts, clickX, groupGap, 60);
    if (foundTrackId) {
      handleContextMenu(e, foundTrackId, "subtitle",render);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", width: "100%" }}
      onContextMenu={onContextMenu}
    />
  );
};
