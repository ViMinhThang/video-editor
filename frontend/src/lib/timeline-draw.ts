import { VideoFrame } from "@/types";
import { drawRoundedImage } from "@/lib/utils";

export interface TimelineDrawOptions {
  canvas: HTMLCanvasElement;
  frames: VideoFrame[];
  thumbnailWidth: number;
  thumbnailHeight: number;
  groupGap: number;
  highlightTrackItemId?: number | null;
  animLineWidth?: number;
  borderColor?: string;
}

export const drawTimeline = async ({
  canvas,
  frames,
  thumbnailWidth,
  thumbnailHeight,
  groupGap,
  highlightTrackItemId = null,
  animLineWidth = 0,
  borderColor = "red",
}: TimelineDrawOptions) => {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;

  // Nhóm frame theo track_item_id
  const groups: Record<number, VideoFrame[]> = {};
  for (const f of frames) (groups[f.track_item_id] ??= []).push(f);

  // Sort group theo track_item_id
  const groupEntries = Object.entries(groups).sort(([, g1], [, g2]) => {
    const min1 = Math.min(...g1.map((f) => f.start_time));
    const min2 = Math.min(...g2.map((f) => f.start_time));
    return min1 - min2;
  });
  // Sort frames trong group theo start_time
  groupEntries.forEach(([id, group]) => {
    group.sort((a, b) => a.start_time - b.start_time);
    console.log(
      "Track",
      id,
      group.map((f) => f.start_time)
    );
  });

  // Tính tổng width
  const totalWidth = groupEntries.reduce(
    (sum, [, group], i) =>
      sum + group.length * thumbnailWidth + (i > 0 ? groupGap : 0),
    0
  );
  const height = thumbnailHeight + 20;

  canvas.width = totalWidth * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${totalWidth}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, totalWidth, height);

  // Preload image cache
  const imageCache: Record<string, HTMLImageElement> = {};
  const loadImage = (src: string) =>
    new Promise<HTMLImageElement>((resolve) => {
      if (imageCache[src]) return resolve(imageCache[src]);
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imageCache[src] = img;
        resolve(img);
      };
      img.onerror = () => resolve(new Image());
    });

  const images = await Promise.all(
    frames.map((f) => loadImage(import.meta.env.VITE_API_BASE_URL + f.url))
  );
  const imageMap: Record<number, HTMLImageElement> = {};
  frames.forEach((f, i) => (imageMap[f.id] = images[i]));

  // Draw từng group
  let xOffset = 0;
  for (const [trackItemIdStr, group] of groupEntries) {
    const trackItemId = Number(trackItemIdStr);

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

    // Highlight cả group nếu cần
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
};
