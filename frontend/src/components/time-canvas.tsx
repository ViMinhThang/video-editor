import { drawRoundedImage } from "@/lib/utils";
import { VideoFrame } from "@/types";
import { useEffect, useRef } from "react";

export const TimelineCanvas: React.FC<{
  frames: VideoFrame[];
  scale: number;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
  groupGap: number;
}> = ({
  frames,
  scale,
  thumbnailWidth = 60,
  thumbnailHeight = 60,
  groupGap = 10,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    // Gom frame theo track_item_id
    const groups: Record<number, VideoFrame[]> = {};
    for (const f of frames) {
      (groups[f.track_item_id] ??= []).push(f);
    }

    const groupEntries = Object.entries(groups).sort(
      ([a], [b]) => Number(a) - Number(b)
    );

    const groupCount = groupEntries.length;
    const width = frames.length * thumbnailWidth + (groupCount - 1) * groupGap;
    const height = thumbnailHeight + 20;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    // Preload tất cả ảnh
    Promise.all(
      frames.map(
        (f) =>
          new Promise<HTMLImageElement>((resolve) => {
            const img = new Image();
            img.src = import.meta.env.VITE_API_BASE_URL + f.url;
            img.onload = () => resolve(img);
            img.onerror = () => resolve(new Image());
          })
      )
    ).then((images) => {
      const imageMap: Record<number, HTMLImageElement> = {};
      frames.forEach((f, i) => {
        imageMap[f.id] = images[i];
      });

      let xOffset = 0;

      groupEntries.forEach(([, group]) => {
        group.forEach((frame, idx) => {
          const img = imageMap[frame.id];
          const startX = xOffset + idx * thumbnailWidth;

          // VẼ tất cả frame bình thường
          drawRoundedImage(
            ctx,
            img,
            startX,
            20,
            thumbnailWidth,
            thumbnailHeight,
            8,
            idx === 0,
            idx === group.length - 1
          );
        });

        xOffset += group.length * thumbnailWidth + groupGap;
      });
    });
  }, [frames, scale, thumbnailWidth, thumbnailHeight, groupGap]);

  return <canvas ref={canvasRef} />;
};
