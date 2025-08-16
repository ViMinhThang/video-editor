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
  roundAllCorners = false  // thêm
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

  return { totalDuration, scale, frameDuration, thumbnailWidth, width, cursorX };
};


export function splitTrackItems(trackItems: TrackItem[]): TrackItem[] {
  const result: TrackItem[] = [];

  for (const t of trackItems) {
    if (!t.video_frames) continue;

    // sort frames theo start_time để an toàn
    const sortedFrames = [...t.video_frames].sort(
      (a, b) => a.start_time - b.start_time
    );

    let currentStart = t.start_time;

    for (const f of sortedFrames) {
      if (currentStart < f.start_time) {
        // có gap → tạo segment trước frame này
        result.push({
          ...t,
          id: result.length + 1, // id tạm, để không clash
          start_time: currentStart,
          end_time: f.start_time,
          video_frames: [],
        });
        currentStart = f.start_time;
      }

      result.push({
        ...t,
        id: result.length + 1,
        start_time: f.start_time,
        end_time: f.end_time,
        video_frames: [f],
      });

      currentStart = f.end_time;
    }

    // nếu còn dư tới end_time → push nốt
    if (currentStart < t.end_time) {
      result.push({
        ...t,
        id: result.length + 1,
        start_time: currentStart,
        end_time: t.end_time,
        video_frames: [],
      });
    }
  }

  // sort theo start_time
  result.sort((a, b) => a.start_time - b.start_time);

  return result;
}