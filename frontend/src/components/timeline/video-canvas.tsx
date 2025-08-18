import { useVideo } from "@/hooks/use-video";
import React, { useEffect, useRef } from "react";

interface VideoCanvasProps {
  src: string;
  width?: number;
  height?: number;
  overlayText?: string;
  currentTime?: number;
}

const VideoCanvas: React.FC<VideoCanvasProps> = ({
  src,
  width = 1128.88,
  height = 635,
  overlayText = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { videoRef } = useVideo();

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

      // tiếp tục render frame khi video chạy
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

    const handlePlay = () => render();

    video.addEventListener("play", handlePlay);
    video.addEventListener("seeked", drawFrame); // khi tua thì vẽ frame mới
    video.addEventListener("loadeddata", drawFrame);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("seeked", drawFrame);
      video.removeEventListener("loadeddata", drawFrame);
      if (handleId) video.cancelVideoFrameCallback(handleId);
    };
  }, [videoRef, overlayText]);

  return (
    <div className="relative flex justify-center items-center">
      {/* video bị ẩn hoàn toàn, chỉ để lấy frame */}
      <video ref={videoRef} src={src} style={{ display: "none" }} />
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
      />
    </div>
  );
};

export default VideoCanvas;
