import { TimelineMetricsParams } from "@/types";
import { TextConfig, TrackItem } from "@/types/track_item";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAssetType(mime: string) {
  if (mime.startsWith("video")) return "video";
  if (mime.startsWith("audio")) return "audio";
  if (mime.startsWith("image")) return "image";
  return "text";
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


export const takeLastItemStart = (texts: TrackItem[]) => {
  if (texts.length > 0) {
    return texts[texts.length - 1].endTime;
  } else {
    return 0;
  }
};
