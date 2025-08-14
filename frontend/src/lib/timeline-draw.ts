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

export const drawTimeline = ({
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
  const groupEntries = Object.entries(groups).sort(([a], [b]) => Number(a) - Number(b));

  const width = frames.length * thumbnailWidth + (groupEntries.length - 1) * groupGap;
  const height = thumbnailHeight + 20;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  Promise.all(
    frames.map(f =>
      new Promise<HTMLImageElement>(resolve => {
        const img = new Image();
        img.src = import.meta.env.VITE_API_BASE_URL + f.url;
        img.onload = () => resolve(img);
        img.onerror = () => resolve(new Image());
      })
    )
  ).then(images => {
    const imageMap: Record<number, HTMLImageElement> = {};
    frames.forEach((f, i) => (imageMap[f.id] = images[i]));

    let xOffset = 0;
    groupEntries.forEach(([trackIdStr, group]) => {
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

      const trackIdNum = Number(trackIdStr);
      if (highlightTrackItemId === trackIdNum) {
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
    });
  });
};
