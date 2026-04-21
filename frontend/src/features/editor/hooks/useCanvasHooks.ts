import { useRef, useEffect } from "react";
import { resizeCanvas } from "@/lib/timeline-draw";
import { animateHighlight } from "@/lib/timeline-draw";

export function useResizableCanvas(renderFn: () => void, height: number) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) resizeCanvas(canvasRef.current, height, renderFn);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderFn, height]);

  return canvasRef;
}
