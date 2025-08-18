import { useEditorContext } from "@/hooks/use-editor";
import { drawTimeline } from "@/lib/timeline-draw";
import { findTrackAtX } from "@/lib/utils";
import { useRef, useCallback, useEffect } from "react";

interface TimelineCanvasProps {
  thumbnailWidth?: number;
  thumbnailHeight?: number;
  groupGap: number;
  highlightTrackItemIdRef: React.RefObject<number | null>;
  animLineWidthRef: React.MutableRefObject<number>;
  onRightClick: (e: React.MouseEvent, trackItemId: number) => void; // 👈 đổi string -> number
}
export const TimelineCanvas: React.FC<TimelineCanvasProps> = ({
  thumbnailWidth = 60,
  thumbnailHeight = 60,
  groupGap = 10,
  highlightTrackItemIdRef,
  animLineWidthRef,
  onRightClick,
}) => {
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

    const foundTrackItemId = findTrackAtX(
      videos,
      clickX,
      groupGap,
      thumbnailWidth
    );

    highlightTrackItemIdRef.current = foundTrackItemId;
    animLineWidthRef.current = 0;
    render();

    if (foundTrackItemId != null) {
      onRightClick?.(e, foundTrackItemId);
    }
  };

  // ✅ return JSX ở đây, không return trong handleContextMenu
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
