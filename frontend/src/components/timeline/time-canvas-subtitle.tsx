import { useEditorContext } from "@/hooks/use-editor";
import { useTimelineContext } from "@/hooks/use-timeline";
import { drawSubtitleTimeline, resizeCanvas } from "@/lib/timeline-draw";
import { useRef, useCallback, useEffect } from "react";
import { handleSubtitleContextMenuClick } from "@/lib/timeline-subtitle-interaction";

interface TimeCanvasSubtitleProps {
  groupGap: number;
  thumbnailHeight?: number;
}

export const TimeCanvasSubtitle = ({
  groupGap,
  thumbnailHeight = 40,
}: TimeCanvasSubtitleProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { handleContextMenu, highlightTrackItemIdRef, animLineWidthRef } =
    useTimelineContext();
  const { tracks } = useEditorContext();
  const texts = tracks.text;

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    drawSubtitleTimeline({
      canvas,
      texts,
      groupGap,
      thumbnailHeight,
      highlightTrackItemId: highlightTrackItemIdRef.current,
      animLineWidth: animLineWidthRef.current,
    });
  }, [texts, groupGap, highlightTrackItemIdRef, animLineWidthRef]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        resizeCanvas(canvasRef.current, 20, render);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [render]);

  const onContextMenu = (e: React.MouseEvent) => {
    handleSubtitleContextMenuClick({
      e,
      canvasRef,
      texts,
      groupGap,
      highlightTrackItemIdRef,
      animLineWidthRef,
      render,
      handleContextMenu,
    });
  };

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", width: "100%" }}
      onContextMenu={onContextMenu}
    />
  );
};
