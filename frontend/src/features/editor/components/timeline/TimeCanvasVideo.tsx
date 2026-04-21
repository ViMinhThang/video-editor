/**
 * @what A high-performance canvas intended for rendering video track thumbnails.
 * @why Provides a visual reference for video duration and content sequences within the timeline.
 * @how Leverages a low-level drawing utility to render frames onto a resizable HTML5 canvas element.
 */

import React, { useCallback } from "react";
import { useResizableCanvas } from "../../hooks/useCanvasHooks";
import { useEditorContext } from "../../hooks/useEditor";
import { useProject } from "@/hooks/use-project";
import { useTimelineContext } from "@/hooks/use-timeline";
import { drawTimeline } from "@/lib/timeline-draw";
import {
  handleContextMenuClick,
  handleVideoClick,
} from "@/lib/timeline-video-interaction";
import type { TimelineCanvasProps } from "@/types/timeline";

export const TimeCanvasVideo = ({
  thumbnailWidth = 60,
  thumbnailHeight = 60,
  groupGap = 10,
}: TimelineCanvasProps) => {
  const { handleContextMenu, highlightTrackItemIdRef, animLineWidthRef } =
    useTimelineContext();
  const { tracks, setAsset } = useEditorContext();
  const { assets } = useProject();
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
    videos,
    thumbnailWidth,
    thumbnailHeight,
    groupGap,
    highlightTrackItemIdRef,
    animLineWidthRef,
  ]);

  const canvasRef = useResizableCanvas(render, thumbnailHeight);
  
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

  const onVideoClick = (e: React.MouseEvent) =>
    handleVideoClick({
      e,
      canvasRef,
      tracks,
      assets,
      setAsset,
      groupGap,
      thumbnailWidth,
    });

  return (
    <canvas
      ref={canvasRef}
      onContextMenu={onContextMenu}
      onClick={onVideoClick}
      className="block w-full cursor-pointer hover:ring-2 hover:ring-blue-500/20 transition-all rounded-lg bg-zinc-900 shadow-sm"
      style={{
        height: `${thumbnailHeight + 20}px`,
      }}
    />
  );
};
