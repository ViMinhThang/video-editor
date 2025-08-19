import React, { useEffect, useRef, useState } from "react";
import { useVideo } from "@/hooks/use-video";
import { useEditorContext } from "@/hooks/use-editor";
import axios from "axios";
import {
  drawTextItem,
  handleCanvasMouseDown,
  handleCanvasMouseMove,
  handleTextEditingKeyDown,
} from "@/lib/timeline-video-canvas";
import { updateText } from "@/api/track-api";
import { VideoCanvasProps } from "@/types/video";

const VideoCanvas = ({
  src,
  width = 1128.88,
  height = 635,
}: VideoCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { videoRef } = useVideo();
  const { tracks, setTracks } = useEditorContext();

  const texts = tracks.text;

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [rotatingId, setRotatingId] = useState<number | null>(null);
  const [offset, setOffset] = useState<{ x: number; y: number } | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>("");

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

      texts.forEach((t) => {
        if (
          video.currentTime >= t.start_time &&
          video.currentTime <= t.end_time
        ) {
          drawTextItem({ ctx, t, canvas, selectedId, editingId, editingText });
        }
      });

      handleId = video.requestVideoFrameCallback(() => render());
    };

    render();

    return () => {
      if (handleId) video.cancelVideoFrameCallback(handleId);
    };
  }, [videoRef, texts, selectedId, editingId, editingText]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    handleCanvasMouseDown({
      x,
      y,
      canvas: canvasRef.current,
      texts,
      setDraggingId,
      setRotatingId,
      setSelectedId,
      setOffset,
      setEditingId,
      setEditingText,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    handleCanvasMouseMove({
      x,
      y,
      draggingId,
      rotatingId,
      texts,
      setTracks,
    });
  };

  const handleMouseUp = async () => {
    setDraggingId(null);
    setRotatingId(null);
    setOffset(null);

    if (selectedId) {
      const track = texts.find((t) => t.id === selectedId);
      if (track) {
        try {
          const res = await updateText(track);
        } catch (err) {
          console.error("Update track failed:", err);
        }
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      handleTextEditingKeyDown({
        e,
        editingId,
        editingText,
        texts,
        setEditingText,
        setEditingId,
        setTracks,
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editingId, editingText, texts, setTracks]);

  return (
    <div className="relative flex justify-center items-center">
      <video ref={videoRef} src={src} style={{ display: "none" }} />
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};

export default VideoCanvas;
