import { TextConfig, TrackItem } from "@/types/track_item";

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
export const getClickX = (canvas: HTMLCanvasElement, e: React.MouseEvent) => {
  const rect = canvas.getBoundingClientRect();
  return e.clientX - rect.left;
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
