import { TrackItem, VideoFrame } from "@/types";
import { drawRoundedImage } from "@/lib/utils";

interface DrawTimelineOptions {
  canvas: HTMLCanvasElement;
  videos: TrackItem[];
  thumbnailWidth: number;
  thumbnailHeight: number;
  groupGap: number;
  highlightTrackItemId: number | null;
  animLineWidth: number;
  borderColor?: string;
}
interface DrawSubtitleTimelineOptions {
  canvas: HTMLCanvasElement;
  texts: TrackItem[]; // track_item dạng text
  groupGap: number;
  highlightTrackItemId: number | null;
  animLineWidth: number;
  borderColor?: string;
  thumbnailHeight: number;
}
// cache ảnh global để ko load lại nhiều lần
const imageCache: Record<string, HTMLImageElement> = {};

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve) => {
    if (imageCache[src]) return resolve(imageCache[src]);

    const img = new Image();
    img.src = src;
    img.onload = () => {
      imageCache[src] = img;
      resolve(img);
    };
    img.onerror = () => resolve(new Image()); // fallback rỗng
  });

export async function drawTimeline({
  canvas,
  videos,
  thumbnailWidth,
  thumbnailHeight,
  groupGap,
  highlightTrackItemId,
  animLineWidth,
  borderColor = "red",
}: DrawTimelineOptions) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // sort track theo start_time
  const sortedTracks = [...videos].sort((a, b) => a.start_time - b.start_time);

  // preload tất cả ảnh trong tracks
  const frames = sortedTracks.flatMap((t) => t.video_frames ?? []);
  const images = await Promise.all(
    frames.map((f) => loadImage(import.meta.env.VITE_API_BASE_URL + f.url))
  );
  const imageMap: Record<number, HTMLImageElement> = {};
  frames.forEach((f, i) => (imageMap[f.id] = images[i]));

  let xOffset = 0;

  for (const track of sortedTracks) {
    const framesInTrack = track.video_frames ?? [];
    framesInTrack.sort((a, b) => a.start_time - b.start_time);

    framesInTrack.forEach((frame, idx) => {
      const img = imageMap[frame.id];
      drawRoundedImage(
        ctx,
        img,
        xOffset + idx * thumbnailWidth,
        20,
        thumbnailWidth,
        thumbnailHeight,
        8,
        idx === 0,
        idx === framesInTrack.length - 1
      );
    });

    // highlight track
    if (highlightTrackItemId === Number.parseInt(track.id)) {
      drawRoundedImage(
        ctx,
        null,
        xOffset,
        20,
        framesInTrack.length * thumbnailWidth,
        thumbnailHeight,
        8,
        true,
        true,
        true,
        borderColor,
        animLineWidth,
        true
      );
    }

    xOffset += framesInTrack.length * thumbnailWidth + groupGap;
  }
}
export function drawSubtitleTimeline({
  canvas,
  texts,
  groupGap,
  highlightTrackItemId,
  thumbnailHeight,
  animLineWidth,
  borderColor = "red",
}: DrawSubtitleTimelineOptions) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const radius = 6;

  let xOffset = 0;
  const sortedTexts = [...texts].sort((a, b) => a.start_time - b.start_time);
  for (const item of sortedTexts) {
    const x = xOffset + item.start_time * 40;
    const width = (item.end_time - item.start_time) * 40;
    // vẽ subtitle block
    drawRoundedImage(
      ctx,
      null, // không có image
      x,
      0,
      width,
      thumbnailHeight,
      radius,
      true,
      true,
      false,
      "red", // strokeStyle
      2, // lineWidth
      false,
      item.text_content, // text
      "black", // textColor
      "10px Arial" // font
    );

    // highlight border nếu match
    if (highlightTrackItemId === Number.parseInt(item.id)) {
      drawRoundedImage(
        ctx,
        null,
        x,
        0,
        width,
        thumbnailHeight,
        radius,
        true,
        true,
        true,
        borderColor,
        animLineWidth,
        true
      );
    }

    xOffset += groupGap;
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
  animLineWidthRef: React.RefObject<number>,
  render: () => void
) => {
  const step = () => {
    animLineWidthRef.current = Math.min(animLineWidthRef.current + 0.5, 6);
    render();
    if (animLineWidthRef.current < 6) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
