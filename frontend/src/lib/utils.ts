import { TimelineMetricsParams, TrackItem } from "@/types";
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
  text?: string, // thêm text
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
      ctx.fillStyle = textColor;
      ctx.font = font;
      ctx.textBaseline = "middle";
      ctx.fillText(text, x + 6, y + height / 2);
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
    start_time: number;
    end_time?: number;
    video_frames?: any[];
  }
>(
  items: T[],
  clickX: number,
  groupGap: number,
  thumbnailWidth: number = 0,
  pxPerSecond: number = 40
): number | null {
  let xOffset = 0;

  const sorted = [...items].sort((a, b) => a.start_time - b.start_time);

  for (const track of sorted) {
    let width = 0;

    // Nếu là video (có video_frames)
    if (track.video_frames) {
      width = (track.video_frames?.length ?? 0) * thumbnailWidth;
      if (clickX >= xOffset && clickX <= xOffset + width) {
        return track.id;
      }
      xOffset += width + groupGap;
    }
    // Nếu là subtitle (dựa vào start_time, end_time)
    else if (track.end_time !== undefined) {
      width = (track.end_time - track.start_time) * pxPerSecond;
      const x = xOffset + track.start_time * pxPerSecond;
      if (clickX >= x && clickX <= x + width) {
        return track.id;
      }
      xOffset += width + groupGap;
    }
  }

  return null;
}
