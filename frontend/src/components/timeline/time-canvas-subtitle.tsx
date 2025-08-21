import { useEditorContext } from "@/hooks/use-editor";
import { useTimelineContext } from "@/hooks/use-timeline";
import { drawSubtitleTimeline } from "@/lib/timeline-draw";
import { useCallback } from "react";
import { handleSubtitleContextMenuClick } from "@/lib/timeline-subtitle-interaction";
import { TimeCanvasSubtitleProps } from "@/types/timeline";
import { useResizableCanvas } from "@/hooks/use-canvas-hooks";


export const TimeCanvasSubtitle = ({ groupGap, thumbnailHeight = 40 }: TimeCanvasSubtitleProps) => {
  const { handleContextMenu, highlightTrackItemIdRef, animLineWidthRef } = useTimelineContext();
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

  const canvasRef = useResizableCanvas(render, 20);


  const onContextMenu = (e: React.MouseEvent) =>
    handleSubtitleContextMenuClick({ e, canvasRef, texts, groupGap, highlightTrackItemIdRef, animLineWidthRef, render, handleContextMenu });

  return <canvas ref={canvasRef} style={{ display: "block", width: "100%" }} onContextMenu={onContextMenu} />;
};
