import { useEditorContext } from "@/hooks/use-editor";
import { useProject } from "@/hooks/use-project";
import { useTimelineContext } from "@/hooks/use-timeline";
import {
  animateHighlight,
  drawTimeline,
  resizeCanvas,
} from "@/lib/timeline-draw";
import {
  handleContextMenuClick,
  handleVideoClick,
} from "@/lib/timeline-video-interaction";
import { TimelineCanvasProps } from "@/types/timeline";
import { useRef, useCallback, useEffect } from "react";

export const TimelineCanvas = ({
  thumbnailWidth = 60,
  thumbnailHeight = 60,
  groupGap = 10,
}: TimelineCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { handleContextMenu, highlightTrackItemIdRef, animLineWidthRef } =
    useTimelineContext();
  const { tracks, setAsset } = useEditorContext();

  const videos = tracks.video;
  const { assets } = useProject();

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

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        resizeCanvas(canvasRef.current, thumbnailHeight, render);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [thumbnailHeight, render]);

  useEffect(() => {
    render();
    if (highlightTrackItemIdRef.current != null) {
      animLineWidthRef.current = 0;
      animateHighlight(animLineWidthRef, render);
    }
  }, [tracks, render, highlightTrackItemIdRef, animLineWidthRef]);
  const onContextMenu = (e: React.MouseEvent) => {
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
  };

  const onVideoClick = (e: React.MouseEvent) => {
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
