import React, { useRef, useEffect } from "react";
import { drawTimelineRuler } from "@/lib/timeline-ruler-draw";

interface TimelineRulerProps {
  width: number;
  height: number;
  duration: number;
  scale: number;
}

export const TimelineRuler: React.FC<TimelineRulerProps> = ({
  width,
  height,
  duration,
  scale,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    drawTimelineRuler({
      canvas: canvasRef.current,
      width,
      height,
      duration,
      scale,
    });
  }, [width, height, duration, scale]);

  return <canvas ref={canvasRef} />;
};
