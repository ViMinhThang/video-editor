import { useRef, useEffect } from "react";
import { resizeCanvas } from "@/lib/timeline-draw";
import { TrackItem } from "@/types/track_item";

export function useResizableCanvas(
  renderFn: () => void,
  height: number,
  tracks: TrackItem[]
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) resizeCanvas(canvasRef.current, height, renderFn);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderFn, height, tracks]);

  return canvasRef;
}
