import { drawRoundedImage } from "@/lib/utils";
import { VideoFrame } from "@/types";
import { useEffect, useRef } from "react";

// ---- Timeline Canvas ----
export const TimelineCanvas: React.FC<{
  frames: VideoFrame[];
  scale: number; // pixels per second
  thumbnailWidth?: number;
  thumbnailHeight?: number;
  groupGap: number;
}> = ({
  frames,
  scale,
  thumbnailWidth = 80,
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
    // Group theo track_item_id
    const groups: Record<number, VideoFrame[]> = {};
    frames.forEach((frame) => {
      if (!groups[frame.track_item_id]) groups[frame.track_item_id] = [];
      groups[frame.track_item_id].push(frame);
    });

    // Tính width canvas dựa trên số frame và thumbnailWidth
    const width = frames.length * thumbnailWidth;
    const height = thumbnailHeight + 20; // padding top

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);
    let xOffset = 0;
    Object.keys(groups)
      .sort((a, b) => Number(a) - Number(b))
      .forEach((trackItemId) => {
        const groupFrames = groups[Number(trackItemId)];

        groupFrames.forEach((frame, idx) => {
          const img = new Image();
          img.src = import.meta.env.VITE_API_BASE_URL + frame.url;

          // Vị trí x rounded để tránh khoảng trắng do số thập phân
          const posX = Math.round(xOffset + idx * thumbnailWidth);

          // Chiều rộng ảnh vẽ
          // Có thể cộng thêm 1px khi zoom để phủ khoảng trống
          const drawWidth = Math.round(thumbnailWidth) + 1;

          img.onload = () => {
            drawRoundedImage(
              ctx,
              img,
              posX,
              20,
              drawWidth,
              thumbnailHeight,
              8,
              idx == 0,
              idx == groupFrames.length - 1
            );
          };
        });

        // Tăng xOffset bằng tổng width nhóm + khoảng cách giữa nhóm
        xOffset += groupFrames.length * thumbnailWidth + groupGap;
      });
  }, [frames, scale, thumbnailWidth, thumbnailHeight]);

  return <canvas ref={canvasRef} />;
};
