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
  img: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  roundLeft: boolean,
  roundRight: boolean
) {
  ctx.save();
  ctx.beginPath();

  // Vẽ path bo góc bên trái nếu cần
  if (roundLeft) {
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
  }
  // Vẽ path bo góc bên phải nếu cần
  else if (roundRight) {
    ctx.moveTo(x, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x, y + height);
    ctx.closePath();
  } else {
    // Không bo góc
    ctx.rect(x, y, width, height);
  }

  ctx.clip();
  ctx.drawImage(img, x, y, width, height);
  ctx.restore();
}
