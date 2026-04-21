/**
 * @what A canvas-based visualizer for subtitle tracks.
 * @why Provides a compact, time-aligned view of text overlays and subtitles to assist in precise editing.
 * @how Renders subtitle segments as interactive blocks on an HTML5 canvas, supporting context menus and selection.
 */

import React, { useCallback } from "react";
import { useEditorContext } from "../../hooks/useEditor";
import { useTimelineContext } from "@/hooks/use-timeline";
import { useResizableCanvas } from "../../hooks/useCanvasHooks";
import { drawSubtitleTimeline } from "@/lib/timeline-draw";
import { handleSubtitleContextMenuClick } from "@/lib/timeline-subtitle-interaction";
import type { TimeCanvasSubtitleProps } from "@/types/timeline";


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
  }, [texts, groupGap, thumbnailHeight, highlightTrackItemIdRef, animLineWidthRef]);

  const canvasRef = useResizableCanvas(render, 20);

  const onContextMenu = (e: React.MouseEvent) =>
    handleSubtitleContextMenuClick({ 
      e, 
      canvasRef, 
      texts, 
      groupGap, 
      highlightTrackItemIdRef, 
      animLineWidthRef, 
      render, 
      handleContextMenu 
    });

  return (
    <canvas 
      ref={canvasRef} 
      onContextMenu={onContextMenu} 
      className="block w-full h-[30px] bg-zinc-800/5 hover:bg-blue-50/30 transition-all rounded-md mb-1 cursor-pointer"
    />
  );
};
