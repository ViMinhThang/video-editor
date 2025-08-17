import React, { useEffect, useRef } from "react";

interface VideoCanvasProps {
  src: string;
  width?: number;
  height?: number;
  overlayText?: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  currentTime?: number;
}

const VideoCanvas: React.FC<VideoCanvasProps> = ({
  src,
  width = 1280,
  height = 720,
  overlayText = "",
  videoRef,
  currentTime,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let handleId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (overlayText) {
        ctx.fillStyle = "white";
        ctx.font = "24px sans-serif";
        ctx.fillText(overlayText, 50, canvas.height - 50);
      }

      // Gọi tiếp khi video render xong frame
      handleId = video.requestVideoFrameCallback(() => render());
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (overlayText) {
        ctx.fillStyle = "white";
        ctx.font = "24px sans-serif";
        ctx.fillText(overlayText, 50, canvas.height - 50);
      }
    };
    // Khi video play thì bắt đầu render
    const handlePlay = () => render();

    video.addEventListener("play", handlePlay);
    video.addEventListener("seeked", handlePlay); // seek xong cũng render frame
    video.addEventListener("loadeddata", drawFrame); // 👈 load xong thì vẽ frame đầu

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("seeked", handlePlay);
      if (handleId) video.cancelVideoFrameCallback(handleId);
    };
  }, [videoRef, overlayText]);

  return (
    <div className="relative flex justify-center items-center">
      <video ref={videoRef} src={src} style={{ display: "none" }} />
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="rounded-md shadow-md"
      />
    </div>
  );
};

export default VideoCanvas;
