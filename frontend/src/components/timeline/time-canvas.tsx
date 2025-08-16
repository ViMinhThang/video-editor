import { VideoFrame } from "@/types";
import { useEffect, useRef, useCallback } from "react";
import { drawTimeline } from "@/lib/timeline-draw";

interface TimelineCanvasProps {
  frames: VideoFrame[];
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

export const TimelineCanvas: React.FC<TimelineCanvasProps> = ({
  frames,
  thumbnailWidth = 60,
  thumbnailHeight = 60,
  groupGap = 10,
  highlightTrackItemIdRef,
  animLineWidthRef,
  onRightClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /** Hàm render lại timeline */
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawTimeline({
      canvas,
      frames,
      thumbnailWidth,
      thumbnailHeight,
      groupGap,
      highlightTrackItemId: highlightTrackItemIdRef.current,
      animLineWidth: animLineWidthRef.current,
    });
  }, [
    frames,
    thumbnailWidth,
    thumbnailHeight,
    groupGap,
    highlightTrackItemIdRef,
    animLineWidthRef,
  ]);

  /** Resize handler → chỉ set lại width/height khi mount hoặc khi window resize */
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      // gán size theo container thay vì reset mỗi lần render
      canvas.width = rect.width * dpr;
      canvas.height = (thumbnailHeight + 20) * dpr;

      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      render();
    };

    handleResize(); // init
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [thumbnailHeight, render]);

  /** Animate border highlight */
  useEffect(() => {
    const step = () => {
      if (highlightTrackItemIdRef.current == null) return;
      animLineWidthRef.current = Math.min(animLineWidthRef.current + 0.5, 6);
      render();
      if (animLineWidthRef.current < 6) requestAnimationFrame(step);
    };

    render();
    requestAnimationFrame(step);
  }, [frames, render, highlightTrackItemIdRef, animLineWidthRef]);

  /** Context menu → chọn group bằng clickX */
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;

    const groups: Record<number, VideoFrame[]> = {};
    for (const f of frames) (groups[f.track_item_id] ??= []).push(f);
    const groupEntries = Object.entries(groups).sort(
      ([a], [b]) => Number(a) - Number(b)
    );

    let xOffset = 0;
    let foundTrackItemId: number | null = null;

    for (const [trackIdStr, group] of groupEntries) {
      const groupWidth = group.length * thumbnailWidth;
      if (clickX >= xOffset && clickX <= xOffset + groupWidth) {
        foundTrackItemId = Number(trackIdStr);
        break;
      }
      xOffset += groupWidth + groupGap;
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
        width: "100%", // auto theo container
        height: `${thumbnailHeight + 20}px`,
      }}
    />
  );
};
