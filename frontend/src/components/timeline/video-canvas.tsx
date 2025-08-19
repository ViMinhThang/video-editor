import React, { useEffect, useRef, useState } from "react";
import { useVideo } from "@/hooks/use-video";
import { useEditorContext } from "@/hooks/use-editor";
import axios from "axios";

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
  const { tracks, setTracks } = useEditorContext();

  const texts = tracks.text;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [rotatingId, setRotatingId] = useState<string | null>(null);
  const [offset, setOffset] = useState<{ x: number; y: number } | null>(null);

  // state edit text trực tiếp
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");

  // 🎥 render video + texts
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
          ctx.save();
          ctx.translate(t.x ?? canvas.width / 2, t.y ?? canvas.height - 20);
          ctx.rotate((t.rotation ?? 0) * (Math.PI / 180));

          ctx.fillStyle = t.color || "white";
          ctx.font = `${t.fontSize || 24}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // nếu đang edit text này
          if (t.id === editingId) {
            const cursor = Math.floor(Date.now() / 500) % 2 === 0 ? "|" : "";
            ctx.fillText(editingText + cursor, 0, 0);
          } else {
            ctx.fillText(t.text_content, 0, 0);
          }

          // highlight nếu chọn
          if (t.id === selectedId) {
            const metrics = ctx.measureText(t.text_content);
            const textWidth = metrics.width;
            const textHeight =
              metrics.actualBoundingBoxAscent +
                metrics.actualBoundingBoxDescent ||
              t.fontSize ||
              24;

            ctx.strokeStyle = "lightblue";
            ctx.lineWidth = 2;
            const paddingX = 8;
            const paddingY = 6;

            ctx.strokeRect(
              -textWidth / 2 - paddingX,
              -textHeight / 2 - paddingY,
              textWidth + paddingX * 2,
              textHeight + paddingY * 2
            );

            // đường nối tới chấm xoay
            const handleY = -textHeight / 2 - 30;
            ctx.beginPath();
            ctx.moveTo(0, -textHeight / 2);
            ctx.lineTo(0, handleY);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(0, handleY, 6, 0, Math.PI * 2);
            ctx.fillStyle = "lightblue";
            ctx.fill();
          }

          ctx.restore();
        }
      });

      handleId = video.requestVideoFrameCallback(() => render());
    };

    render();

    return () => {
      if (handleId) video.cancelVideoFrameCallback(handleId);
    };
  }, [videoRef, texts, selectedId, editingId, editingText]);

  // 📌 chọn hoặc drag/rotate
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    let found: string | null = null;

    for (let t of texts) {
      const tx = t.x ?? canvasRef.current.width / 2;
      const ty = t.y ?? canvasRef.current.height - 20;

      ctx.save();
      ctx.translate(tx, ty);
      ctx.rotate((t.rotation ?? 0) * (Math.PI / 180));

      ctx.font = `${t.fontSize || 24}px sans-serif`;
      const metrics = ctx.measureText(t.text_content);
      const textWidth = metrics.width;
      const textHeight =
        (metrics.actualBoundingBoxAscent || t.fontSize || 24) +
        (metrics.actualBoundingBoxDescent || 0);

      const invX =
        (x - tx) * Math.cos(-(t.rotation ?? 0) * (Math.PI / 180)) -
        (y - ty) * Math.sin(-(t.rotation ?? 0) * (Math.PI / 180));
      const invY =
        (x - tx) * Math.sin(-(t.rotation ?? 0) * (Math.PI / 180)) +
        (y - ty) * Math.cos(-(t.rotation ?? 0) * (Math.PI / 180));

      const handleX = 0;
      const handleY = -textHeight / 2 - 30;
      const dist = Math.sqrt((invX - handleX) ** 2 + (invY - handleY) ** 2);
      if (dist < 10) {
        found = t.id;
        setRotatingId(t.id);
        ctx.restore();
        return;
      }

      const left = -textWidth / 2 - 4;
      const right = textWidth / 2 + 4;
      const top = -textHeight / 2;
      const bottom = textHeight / 2;
      if (invX >= left && invX <= right && invY >= top && invY <= bottom) {
        found = t.id;
        setDraggingId(t.id);
        setOffset({ x: invX, y: invY });
        setEditingId(t.id);
        setEditingText(t.text_content);
        ctx.restore();
        break;
      }

      ctx.restore();
    }

    setSelectedId(found);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (draggingId) {
      setTracks((prev) => ({
        ...prev,
        text: prev.text.map((t) =>
          t.id === draggingId ? { ...t, x, y } : t
        ),
      }));
    }

    if (rotatingId) {
      const t = texts.find((tt) => tt.id === rotatingId);
      if (!t) return;
      const angle = (Math.atan2(y - t.y!, x - t.x!) * 180) / Math.PI + 90;
      setTracks((prev) => ({
        ...prev,
        text: prev.text.map((tt) =>
          tt.id === rotatingId ? { ...tt, rotation: angle } : tt
        ),
      }));
    }
  };

  const handleMouseUp = async () => {
    setDraggingId(null);
    setRotatingId(null);
    setOffset(null);

    if (selectedId) {
      const track = texts.find((t) => t.id === selectedId);
      if (track) {
        try {
          await axios.put(`/api/track-item/${track.id}`, track);
        } catch (err) {
          console.error("Update track failed:", err);
        }
      }
    }
  };

  // 📌 keyboard edit trực tiếp
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!editingId) return;
      if (e.key === "Backspace") {
        setEditingText((prev) => prev.slice(0, -1));
      } else if (e.key === "Enter") {
        const t = texts.find((tt) => tt.id === editingId);
        if (!t) return;
        setTracks((prev) => ({
          ...prev,
          text: prev.text.map((tt) =>
            tt.id === editingId ? { ...tt, text_content: editingText } : tt
          ),
        }));
        axios.put(`/api/track-item/${t.id}`, { ...t, text_content: editingText }).catch(console.error);
        setEditingId(null);
        
      } else if (e.key === "Escape") {
        setEditingId(null);
      } else if (e.key.length === 1) {
        setEditingText((prev) => prev + e.key);
      }
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
