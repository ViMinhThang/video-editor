import { TimelineMetricsParams } from "@/types";
import { TextConfig, TrackItem } from "@/types/track_item";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function timeSince(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);

  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const months = Math.floor(diffDays / 30);
  const days = diffDays % 30;

  return `Đã tạo vào ${months} tháng ${days} ngày trước`;
}
export function getAssetType(mime: string) {
  if (mime.startsWith("video")) return "video";
  if (mime.startsWith("audio")) return "audio";
  if (mime.startsWith("image")) return "image";
  return "text";
}
export function drawRoundedImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  roundLeft: boolean,
  roundRight: boolean,
  strokeOnly = false,
  strokeStyle = "red",
  lineWidth = 3,
  roundAllCorners = false,
  text?: TrackItem, // thêm text
  textColor = "black", // màu chữ
  font = "12px Arial" // font chữ
) {
  ctx.save();
  ctx.beginPath();

  if (roundAllCorners) {
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
  } else if (roundLeft) {
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
  } else if (roundRight) {
    ctx.moveTo(x, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x, y + height);
    ctx.closePath();
  } else {
    ctx.rect(x, y, width, height);
  }

  if (strokeOnly) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  } else if (img) {
    ctx.clip();
    ctx.drawImage(img, x, y, width, height);
  } else {
    // background fill (nếu không có img thì dùng màu nhạt)
    ctx.fillStyle = "#f2dede";
    ctx.fill();

    // vẽ text nếu có
    if (text) {
      // ctx.fillStyle = textColor;
      // ctx.font = font;
      // ctx.textBaseline = "middle";
      // ctx.fillText(text.config.text, x + 6, y + height / 2);
      drawSubtitle(ctx, text, x, height);
    }
  }

  ctx.restore();
}

export const getTimelineMetrics = ({
  framesLength,
  duration,
  zoom,
  currentTime,
  extraTime = 60,
  baseScale = 40,
}: TimelineMetricsParams) => {
  const totalDuration = duration + extraTime;
  const scale = baseScale * (zoom / 100);
  const frameDuration = duration / framesLength;
  const thumbnailWidth = frameDuration * scale;
  const width = totalDuration * scale;
  const cursorX = currentTime * scale;

  return {
    totalDuration,
    scale,
    frameDuration,
    thumbnailWidth,
    width,
    cursorX,
  };
};

export const formatTime = (time: number) => {
  const hrs = Math.floor(time / 3600);
  const mins = Math.floor((time % 3600) / 60);
  const secs = Math.floor(time % 60);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
};
export function findTrackAtX<
  T extends {
    id: number;
    startTime: number; // tính bằng giây
    endTime?: number; // tính bằng giây
    video_frames?: any[];
  }
>(
  items: T[],
  clickX: number,
  groupGap: number,
  thumbnailWidth: number = 0,
  pxPerSecond: number = 40
): number | null {
  const sorted = [...items].sort((a, b) => a.startTime - b.startTime);

  for (const track of sorted) {
    let width = 0;
    let startX = 0;

    if (track.video_frames && track.video_frames.length > 0) {
      // Video: tính theo số frame
      width = track.video_frames.length * thumbnailWidth;
      startX = track.startTime * pxPerSecond;
    } else if (track.endTime !== undefined) {
      // Subtitle/Text: tính theo khoảng thời gian
      width = (track.endTime - track.startTime) * pxPerSecond;
      startX = track.startTime * pxPerSecond;
    }

    const endX = startX + width;
    if (clickX >= startX && clickX <= endX) {
      return track.id;
    }
  }

  return null;
}

export const takeDuration = (tracks: TrackItem[]) => {
  const durationByAsset: Record<number, number> = {};
  tracks.forEach((t) => {
    if (t.assetId != null) {
      durationByAsset[t.assetId] = Math.max(
        durationByAsset[t.assetId] || 0,
        t.endTime - t.startTime || 0
      );
    }
  });
  const totalDuration = Object.values(durationByAsset).reduce(
    (sum, dur) => sum + dur,
    0
  );
  return totalDuration;
};
export const getClickX = (canvas: HTMLCanvasElement, e: React.MouseEvent) => {
  const rect = canvas.getBoundingClientRect();
  return e.clientX - rect.left;
};
function drawSubtitle(
  ctx: CanvasRenderingContext2D,
  item: TrackItem,
  xOffset: number,
  height: number
) {
  if (item.type !== "text" || !item.config) return;

  const cfg = item.config as TextConfig;
  const text = cfg.text ?? "";
  if (!text) return;

  // Config
  const color = cfg.color ?? "#FFFFFF";
  const fontFamily = cfg.font ?? "Arial";
  const fontSize = cfg.fontSize ?? 12;
  console.log("drawed" + text);
  // Nếu user chưa custom toạ độ → mặc định canh trong rect
  const x = xOffset + 6;
  const y = height / 2;
  ctx.fillStyle = color;
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left"; // giữ giống cách cũ, chữ từ trái sang phải

  ctx.fillText(text, x, y);
}
export const takeLastItemStart = (texts: TrackItem[]) => {
  if (texts.length > 0) {
    return texts[texts.length - 1].endTime;
  } else {
    return 0;
  }
};
export const applyHighlight = (
  highlightTrackItemIdRef: React.MutableRefObject<number | null>,
  animLineWidthRef: React.MutableRefObject<number>,
  render: () => void,
  trackItemId: number | null
) => {
  highlightTrackItemIdRef.current = trackItemId;
  animLineWidthRef.current = 0;
  render();
};
