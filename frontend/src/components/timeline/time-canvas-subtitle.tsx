import { TrackItem } from "@/types";
import React, { useEffect, useRef } from "react";

interface TimeCanvasSubtitleProps {
  tracks: TrackItem[];
  highlightTrackItemIdRef: React.RefObject<number | null>;
  animLineWidthRef: React.RefObject<number>;
}

const TimeCanvasSubtitle = ({ tracks }: TimeCanvasSubtitleProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // resize canvas
    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = 30 * window.devicePixelRatio; // ví dụ chiều cao track

    // draw background
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw a simple "Hello" text
    ctx.fillStyle = "#fff";
    ctx.font = "12px Arial";
    ctx.fillText("Hello Subtitle!", 10, 20);
  }, []);

  return <canvas ref={canvasRef} style={{ display: "block", width: "100%" }} />;
};
export default TimeCanvasSubtitle;
