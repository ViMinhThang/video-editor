import { VideoFrame } from "@/types";
import { drawRoundedImage } from "@/lib/utils";

interface DrawTimelineOptions {
  canvas: HTMLCanvasElement;
  frames: VideoFrame[];
  thumbnailWidth: number;
  thumbnailHeight: number;
  groupGap: number;
  highlightTrackItemId: number | null;
  animLineWidth: number;
  borderColor?: string;
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
  frames,
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

  // nhóm frame theo track_item_id
  const groups: Record<number, VideoFrame[]> = {};
  for (const f of frames) (groups[f.track_item_id] ??= []).push(f);

  const groupEntries = Object.entries(groups).sort(
    ([a], [b]) => Number(a) - Number(b)
  );

  // preload tất cả ảnh 1 lượt
  const images = await Promise.all(
    frames.map((f) => loadImage(import.meta.env.VITE_API_BASE_URL + f.url))
  );
  const imageMap: Record<number, HTMLImageElement> = {};
  frames.forEach((f, i) => (imageMap[f.id] = images[i]));

  let xOffset = 0;

  for (const [trackIdStr, group] of groupEntries) {
    group.sort((a, b) => a.start_time - b.start_time);
    const trackItemId = Number(trackIdStr);

    group.forEach((frame, idx) => {
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
        idx === group.length - 1
      );
    });

    // highlight group
    if (highlightTrackItemId === trackItemId) {
      drawRoundedImage(
        ctx,
        null,
        xOffset,
        20,
        group.length * thumbnailWidth,
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

    xOffset += group.length * thumbnailWidth + groupGap;
  }
}
