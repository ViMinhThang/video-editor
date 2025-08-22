import { TimelineRulerDrawOptions } from "@/types/timeline";

export const drawTimelineRuler = ({
  canvas,
  width,
  height,
  duration,
  scale,
}: TimelineRulerDrawOptions) => {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const majorInterval = 5; // major tick mỗi 5 giây
  const minorCount = 9; // số tick nhỏ giữa 2 major tick
  const minorInterval = majorInterval / (minorCount + 1);

  // ---- Minor ticks ----
  ctx.strokeStyle = "rgba(0,0,0,0.2)";
  for (let t = 0; t <= duration; t += minorInterval) {
    const x = t * scale;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height * 0.2);
    ctx.stroke();
  }

  // ---- Major ticks + labels ----
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = "12px Arial";

  for (let t = 0; t <= duration; t += majorInterval) {
    const x = t * scale;
    const label = `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

    // tick
    ctx.beginPath();
    ctx.moveTo(x, 3);
    ctx.lineTo(x, height * 0.9);
    ctx.stroke();

    // label
    ctx.fillText(label, x + 3, height * 0.3 + 2);
  }
};
