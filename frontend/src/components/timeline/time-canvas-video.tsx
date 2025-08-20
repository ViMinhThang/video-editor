import { useResizableCanvas } from "@/hooks/use-canvas-hooks";
import { useEditorContext } from "@/hooks/use-editor";
import { useProject } from "@/hooks/use-project";
import { useTimelineContext } from "@/hooks/use-timeline";
import { drawTimeline } from "@/lib/timeline-draw";
import {
  handleContextMenuClick,
  handleVideoClick,
} from "@/lib/timeline-video-interaction";
import { TimelineCanvasProps } from "@/types/timeline";
import { useCallback } from "react";

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
      style={{
        display: "block",
        width: "100%",
        height: `${thumbnailHeight + 20}px`,
      }}
    />
  );
};