import { useEditorContext } from "@/hooks/use-editor";
import { drawSubtitleTimeline } from "@/lib/timeline-draw";
import { findTrackAtX } from "@/lib/utils";
import { useRef, useCallback, useEffect } from "react";

interface TimeCanvasSubtitleProps {
  groupGap: number;
  highlightTrackItemIdRef: React.RefObject<number | null>; // 👈 sửa lại number
  animLineWidthRef: React.RefObject<number>;
  onRightClick: (e: React.MouseEvent, trackItemId: number) => void; // 👈 sửa lại number
}

export const TimeCanvasSubtitle = ({
  groupGap,
  highlightTrackItemIdRef,
  animLineWidthRef,
  onRightClick,
}: TimeCanvasSubtitleProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { tracks } = useEditorContext();
  const texts = tracks.text;

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    drawSubtitleTimeline({
      canvas,
      texts,
      groupGap,
      highlightTrackItemId: highlightTrackItemIdRef.current, // 👈 bây giờ là number | null
      animLineWidth: animLineWidthRef.current,
    });
  }, [texts, groupGap, highlightTrackItemIdRef, animLineWidthRef]);
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = 50 * dpr;

      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      render();
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [render]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;

    // 👇 đảm bảo hàm này return number
    const foundTrackItemId = findTrackAtX(texts, clickX, groupGap, 0, 40);

    highlightTrackItemIdRef.current = foundTrackItemId; // number | null
    animLineWidthRef.current = 0;
    render();

    if (foundTrackItemId != null) {
      onRightClick?.(e, foundTrackItemId); // 👈 truyền number
    }
  };

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", width: "100%" }}
      onContextMenu={handleContextMenu}
    />
  );
};
