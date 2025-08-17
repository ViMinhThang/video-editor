import { TrackItem } from "@/types";
import { useEffect, useRef, useCallback } from "react";
import { drawTimeline } from "@/lib/timeline-draw";
import { useParams } from "react-router-dom";
import { useEditorContext } from "@/hooks/use-editor";

interface TimelineCanvasProps {
  thumbnailWidth?: number;
  thumbnailHeight?: number;
  groupGap: number;
  highlightTrackItemIdRef: React.MutableRefObject<number | null>;
  animLineWidthRef: React.MutableRefObject<number>;
  onRightClick?: (
    clickX: number,
    clientX: number,
    clientY: number,
    trackItemId: number
  ) => void;
}

export const TimelineCanvas = ({
  thumbnailWidth = 60,
  thumbnailHeight = 60,
  groupGap = 10,
  highlightTrackItemIdRef,
  animLineWidthRef,
  onRightClick,
}: TimelineCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { tracks } = useEditorContext();
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

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = (thumbnailHeight + 20) * dpr;

      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      render();
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [thumbnailHeight, render]);

  useEffect(() => {
    const step = () => {
      if (highlightTrackItemIdRef.current == null) return;
      animLineWidthRef.current = Math.min(animLineWidthRef.current + 0.5, 6);
      render();
      if (animLineWidthRef.current < 6) requestAnimationFrame(step);
    };

    render();
    requestAnimationFrame(step);
  }, [tracks, render, highlightTrackItemIdRef, animLineWidthRef]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;

    let xOffset = 0;
    let foundTrackItemId: number | null = null;

    // loop từng track theo thứ tự start_time
    const sortedTracks = [...videos].sort(
      (a, b) => a.start_time - b.start_time
    );
    for (const track of sortedTracks) {
      const trackWidth = (track.video_frames?.length ?? 0) * thumbnailWidth;
      if (clickX >= xOffset && clickX <= xOffset + trackWidth) {
        foundTrackItemId = track.id;
        break;
      }
      xOffset += trackWidth + groupGap;
    }

    if (foundTrackItemId != null) {
      highlightTrackItemIdRef.current = foundTrackItemId;
      animLineWidthRef.current = 0;
      render();
      onRightClick?.(clickX, e.clientX, e.clientY, foundTrackItemId);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onContextMenu={handleContextMenu}
      style={{
        display: "block",
        width: "100%",
        height: `${thumbnailHeight + 20}px`,
      }}
    />
  );
};
