import React, { useRef, useEffect } from "react";
import { drawTimelineRuler } from "@/lib/timeline-ruler-draw";
import { TimelineRulerProps } from "@/types/timeline";


export const TimelineRuler = ({
  width,
  height,
  duration,
  scale,
}:TimelineRulerProps) => {
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
