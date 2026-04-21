/**
 * @what A visual ruler used to indicate time increments (seconds, frames) along the top of the timeline.
 * @why Provides essential spatial-temporal context, allowing users to accurately place and trim clips.
 * @how Renders high-resolution tick marks and timestamps onto a canvas, scaling dynamically with the zoom level.
 */

import React, { useRef, useEffect } from "react";
import { drawTimelineRuler } from "@/lib/timeline-ruler-draw";
import type { TimelineRulerProps } from "@/types/timeline";

export const TimeRuler = ({
  width,
  height,
  duration,
  scale,
}: TimelineRulerProps) => {
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

  return (
    <canvas 
      ref={canvasRef} 
      className="block w-full border-b border-zinc-200 mb-2"
      width={width}
      height={height}
    />
  );
};
