import React, { useRef, useEffect } from "react";

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
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvasRef.current.width = width * dpr;
    canvasRef.current.height = height * dpr;
    canvasRef.current.style.width = width + "px";
    canvasRef.current.style.height = height + "px";
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const majorInterval = 5; // major tick mỗi 5 giây
    const minorCount = 9; // số tick nhỏ giữa 2 major tick
    const minorInterval = majorInterval / (minorCount + 1);

    // ---- Minor ticks trên đầu ----
    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    for (let t = 0; t <= duration; t += minorInterval) {
      const x = t * scale;
      ctx.beginPath();
      ctx.moveTo(x, 0); // từ trên cùng
      ctx.lineTo(x, height * 0.2); // dài 20% chiều cao
      ctx.stroke();
    }

    // ---- Major ticks bên trái số ----
    ctx.strokeStyle = "rgba(0,0,0,0.3)";
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.textAlign = "left"; // chữ bắt đầu bên phải tick
    ctx.textBaseline = "top";
    ctx.font = "12px Arial";

    for (let t = 0; t <= duration; t += majorInterval) {
      const x = t * scale;
      const label = `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(
        Math.floor(t % 60)
      ).padStart(2, "0")}`;

      // Vẽ tick ngắn, sát bên trái chữ
      ctx.beginPath();
      ctx.moveTo(x, 3);
      ctx.lineTo(x, height * 0.9); // tick ngắn
      ctx.stroke();

      // Vẽ chữ bên phải tick
      ctx.fillText(label, x + 3, height * 0.3 + 2); // +2 px để cách tick
    }
  }, [width, height, duration, scale]);

  return <canvas ref={canvasRef} />;
};
