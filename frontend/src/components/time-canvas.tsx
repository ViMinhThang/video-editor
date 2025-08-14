import { drawRoundedImage } from "@/lib/utils";
import { VideoFrame } from "@/types";
import { useEffect, useRef } from "react";

interface TimelineCanvasProps {
  frames: VideoFrame[];
  scale: number;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
  groupGap: number;
  highlightTrackItemIdRef: React.MutableRefObject<number | null>;
  animLineWidthRef: React.MutableRefObject<number>;
  onRightClick?: (clickX: number, clientX: number, clientY: number, trackItemId: number) => void;
}

export const TimelineCanvas: React.FC<TimelineCanvasProps> = ({
  frames,
  scale,
  thumbnailWidth = 60,
  thumbnailHeight = 60,
  groupGap = 10,
  highlightTrackItemIdRef,
  animLineWidthRef,
  onRightClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawTimeline = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;

    const groups: Record<number, VideoFrame[]> = {};
    for (const f of frames) (groups[f.track_item_id] ??= []).push(f);
    const groupEntries = Object.entries(groups).sort(([a], [b]) => Number(a) - Number(b));

    const width = frames.length * thumbnailWidth + (groupEntries.length - 1) * groupGap;
    const height = thumbnailHeight + 20;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    Promise.all(
      frames.map(f => new Promise<HTMLImageElement>(resolve => {
        const img = new Image();
        img.src = import.meta.env.VITE_API_BASE_URL + f.url;
        img.onload = () => resolve(img);
        img.onerror = () => resolve(new Image());
      }))
    ).then(images => {
      const imageMap: Record<number, HTMLImageElement> = {};
      frames.forEach((f, i) => (imageMap[f.id] = images[i]));

      let xOffset = 0;
      groupEntries.forEach(([trackIdStr, group]) => {
        group.forEach((frame, idx) => {
          const img = imageMap[frame.id];
          const startX = xOffset + idx * thumbnailWidth;
          drawRoundedImage(ctx, img, startX, 20, thumbnailWidth, thumbnailHeight, 8, idx === 0, idx === group.length - 1);
        });

        const trackIdNum = Number(trackIdStr);
        if (highlightTrackItemIdRef.current === trackIdNum) {
          drawRoundedImage(ctx, null, xOffset, 20, group.length * thumbnailWidth, thumbnailHeight, 8, true, true, true, "red", animLineWidthRef.current, true);
        }
        xOffset += group.length * thumbnailWidth + groupGap;
      });
    });
  };

  // Animate border
  useEffect(() => {
    const step = () => {
      if (highlightTrackItemIdRef.current == null) return;
      animLineWidthRef.current = Math.min(animLineWidthRef.current + 0.5, 6);
      drawTimeline();
      if (animLineWidthRef.current < 6) requestAnimationFrame(step);
    };
    drawTimeline();
    requestAnimationFrame(step);
  }, [frames, scale, thumbnailWidth, thumbnailHeight, groupGap]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = canvasRef.current!.getBoundingClientRect();
    const clickX = e.clientX - rect.left;

    const groups: Record<number, VideoFrame[]> = {};
    for (const f of frames) (groups[f.track_item_id] ??= []).push(f);
    const groupEntries = Object.entries(groups).sort(([a], [b]) => Number(a) - Number(b));

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
      drawTimeline();
      onRightClick?.(clickX, e.clientX, e.clientY, foundTrackItemId);
    }
  };

  return <canvas ref={canvasRef} onContextMenu={handleContextMenu} style={{ display: "block" }} />;
};