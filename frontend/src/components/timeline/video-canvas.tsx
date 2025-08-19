import { useEditorContext } from "@/hooks/use-editor";
import { useVideo } from "@/hooks/use-video";
import React, { useEffect, useRef } from "react";

interface VideoCanvasProps {
  src: string;
  width?: number;
  height?: number;
}

const VideoCanvas: React.FC<VideoCanvasProps> = ({
  src,
  width = 1128.88,
  height = 635,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { videoRef } = useVideo();
  const { tracks } = useEditorContext();
  const texts = tracks.text;
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let handleId: number;

    const render = () => {
      drawFrame()

      handleId = video.requestVideoFrameCallback(() => render());
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const currentTime = video.currentTime;
      texts.forEach((t) => {
        if (currentTime >= t.start_time && currentTime <= t.end_time) {

          ctx.fillStyle = t.color || "white";
          ctx.font = `${t.fontSize || 24}px sans-serif`;

          // 👇 quan trọng
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";

          ctx.fillText(
            t.text_content,
            canvas.width / 2,
            canvas.height - 20
          );

        }
      });
    };

    video.addEventListener("play", render);
    video.addEventListener("seeked", drawFrame);
    video.addEventListener("loadeddata", drawFrame);

    return () => {
      video.removeEventListener("play", render);
      video.removeEventListener("seeked", drawFrame);
      video.removeEventListener("loadeddata", drawFrame);
      if (handleId) video.cancelVideoFrameCallback(handleId);
    };
  }, [videoRef, texts]);

  return (
    <div className="relative flex justify-center items-center">
      <video ref={videoRef} src={src} style={{ display: "none" }} />
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
};

export default VideoCanvas;
