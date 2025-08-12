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
export const extractFrames = async (videoUrl: string, frameCount = 9) => {
  return new Promise<string[]>((resolve) => {
    const video = document.createElement("video");
    video.src = videoUrl;
    video.crossOrigin = "anonymous";
    video.muted = true;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const frames: string[] = [];

    video.addEventListener("loadeddata", async () => {
      const duration = video.duration;
      const interval = duration / frameCount;

      canvas.width = video.videoWidth / 4;
      canvas.height = video.videoHeight / 4;

      let currentFrame = 0;

      const capture = () => {
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        frames.push(canvas.toDataURL("image/jpeg"));

        currentFrame++;
        if (currentFrame < frameCount) {
          video.currentTime = interval * currentFrame;
        } else {
          resolve(frames);
        }
      };

      video.addEventListener("seeked", capture);
      capture();
    });
  });
};
export const splitIntoThree = (frames: string[]) => {
  const partSize = Math.ceil(frames.length / 3);
  return [
    frames.slice(0, partSize),
    frames.slice(partSize, partSize * 2),
    frames.slice(partSize * 2)
  ];
};
