import React, { useEffect, useRef } from "react";
import { VideoFrame } from "@/types";

interface TimelineCanvasProps {
  frames: VideoFrame[];
  width: number;
  height: number;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
  groupGap?: number;
}

const TimelineCanvas: React.FC<TimelineCanvasProps> = ({
  frames,
  width,
  height,
  thumbnailWidth = 80,
  thumbnailHeight = 48,
  groupGap = 10, // khoảng cách giữa các nhóm frame
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Xóa canvas cũ
    ctx.clearRect(0, 0, width, height);

    // Group frames theo group_index
    const groups: Record<number, VideoFrame[]> = {};
    frames.forEach((frame) => {
      if (!groups[frame.group_index]) groups[frame.group_index] = [];
      groups[frame.group_index].push(frame);
    });

    // Vẽ từng nhóm với khoảng cách groupGap
    let x = 0;
    Object.keys(groups)
      .sort((a, b) => Number(a) - Number(b))
      .forEach((groupKey) => {
        const groupFrames = groups[Number(groupKey)];

        groupFrames.forEach((frame) => {
          const currentX = x; // giữ vị trí x riêng cho từng ảnh
          const img = new Image();
          img.src = import.meta.env.VITE_API_BASE_URL + frame.url;
          img.onload = () => {
            if (!ctx) return;
            ctx.drawImage(img, currentX, 0, thumbnailWidth, thumbnailHeight);
          };
          x += thumbnailWidth;
        });

        x += groupGap; // khoảng cách giữa các nhóm
      });
  }, [frames, width, height, thumbnailWidth, thumbnailHeight, groupGap]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};

export default TimelineCanvas;
