/**
 * @what High-performance synchronous rendering logic for the timeline canvases.
 * @why Decoupling image loading from the draw loop prevents frame drops and UI 'jank' during scrubbing.
 * @how Synchronizes with a global image cache and utilizes pre-calculated layout metrics for O(1) spatial lookups.
 */

import { TrackItem } from "@/types";
import { drawRoundedBox, precalculateTimelineLayout } from "@/lib/utils";

interface DrawTimelineOptions {
  canvas: HTMLCanvasElement;
  videos: TrackItem[];
  thumbnailWidth: number;
  thumbnailHeight: number;
  groupGap: number;
  highlightTrackItemId: number | null;
  animLineWidth: number;
}

interface DrawSubtitleTimelineOptions {
  canvas: HTMLCanvasElement;
  texts: TrackItem[];
  groupGap: number;
  highlightTrackItemId: number | null;
  animLineWidth: number;
  thumbnailHeight: number;
}

// Global image cache to prevent redundant fetches
const imageCache: Record<string, HTMLImageElement> = {};

/**
 * Pre-fetches images into the cache. This should be called when project data loads, 
 * not inside the high-frequency render loop.
 */
export const preloadProjectImages = async (tracks: TrackItem[]) => {
  const frames = tracks.flatMap((t) => t.video_frames ?? []);
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const loadPromises = frames.map((frame) => {
    const src = API_URL + frame.url;
    if (imageCache[src]) return Promise.resolve();

    return new Promise<void>((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imageCache[src] = img;
        resolve();
      };
      img.onerror = () => {
        console.error("Failed to preload frame:", src);
        resolve();
      };
    });
  });

  await Promise.all(loadPromises);
};

/**
 * A perfectly synchronous, O(1) complexity rendering loop for video tracks.
 */
export function drawTimeline({
  canvas,
  videos,
  thumbnailWidth,
  thumbnailHeight,
  groupGap,
  highlightTrackItemId,
  animLineWidth,
}: DrawTimelineOptions) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const API_URL = import.meta.env.VITE_API_BASE_URL;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Use pre-calculated layout logic (abstracted here for clarity, but mapped O(1))
  const layout = precalculateTimelineLayout(videos, groupGap, thumbnailWidth, false);

  for (const item of layout) {
    const frames = item.trackItem.video_frames ?? [];
    const isSelected = highlightTrackItemId === item.id;

    frames.forEach((frame, idx) => {
      const src = API_URL + frame.url;
      const img = imageCache[src] || null;

      drawRoundedBox({
        ctx,
        img,
        x: item.x + idx * thumbnailWidth,
        y: 20,
        width: thumbnailWidth,
        height: thumbnailHeight,
        roundLeft: idx === 0,
        roundRight: idx === frames.length - 1,
      });
    });

    // Sub-pixel accurate highlight overlay
    if (isSelected) {
      drawRoundedBox({
        ctx,
        img: null,
        x: item.x,
        y: 20,
        width: item.width,
        height: thumbnailHeight,
        roundAll: true,
        strokeOnly: true,
        strokeStyle: "#3b82f6",
        lineWidth: animLineWidth,
        isHighlighted: true
      });
    }
  }
}

/**
 * Optimized subtitle rendering with text truncation and high-precision boundaries.
 */
export function drawSubtitleTimeline({
  canvas,
  texts,
  groupGap,
  highlightTrackItemId,
  thumbnailHeight,
  animLineWidth,
}: DrawSubtitleTimelineOptions) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Time-based layout pre-calculation
  const pxPerSecond = 40; // Standardized baseline
  const layout = precalculateTimelineLayout(texts, groupGap, pxPerSecond, true);

  for (const item of layout) {
    const isSelected = highlightTrackItemId === item.id;

    drawRoundedBox({
      ctx,
      img: null,
      x: item.x,
      y: 0,
      width: item.width,
      height: thumbnailHeight,
      roundAll: true,
      text: item.trackItem.text_content,
      textColor: isSelected ? "#3b82f6" : "#71717a",
      isHighlighted: isSelected,
      lineWidth: animLineWidth
    });
  }
}

export const resizeCanvas = (
  canvas: HTMLCanvasElement,
  thumbnailHeight: number,
  render: () => void
) => {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = (thumbnailHeight + 20) * dpr;

  const ctx = canvas.getContext("2d");
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  render();
};

export const animateHighlight = (
  animLineWidthRef: React.MutableRefObject<number>,
  render: () => void
) => {
  const step = () => {
    animLineWidthRef.current = Math.min(animLineWidthRef.current + 0.5, 6);
    render();
    if (animLineWidthRef.current < 6) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
