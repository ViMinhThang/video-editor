import { useState, useRef, useEffect } from "react";
import { VideoFrame } from "@/types";
import { downloadTrackItem } from "@/api/track-api";

export const useTimeline = (frames: VideoFrame[], duration: number, scale: number, onTimeChange: (newTime: number) => void) => {
  const highlightTrackItemIdRef = useRef<number | null>(null);
  const animLineWidthRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    trackItemId: null as number | null,
  });

  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu({ visible: false, x: 0, y: 0, trackItemId: null });
      highlightTrackItemIdRef.current = null;
      animLineWidthRef.current = 0;
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleTravel = (clientX: number, containerLeft: number) => {
    const clickX = clientX - containerLeft;
    const newTime = Math.max(0, Math.min(duration, clickX / scale));
    onTimeChange(newTime);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    handleTravel(e.clientX, rect.left);

    const onMove = (moveEvent: MouseEvent) => handleTravel(moveEvent.clientX, rect.left);
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const handleContextMenu = (clickX: number, clientX: number, clientY: number, trackItemId: number) => {
    setContextMenu({ visible: true, x: clientX, y: clientY, trackItemId });
    highlightTrackItemIdRef.current = trackItemId;
    animLineWidthRef.current = 0;

    const animate = () => {
      animLineWidthRef.current = Math.min(animLineWidthRef.current + 0.5, 6);
      if (animLineWidthRef.current < 6) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };
    animate();
  };

  const handleDownload =async () => {
    if (!contextMenu.trackItemId) return;
    const trackItem = frames.find(f => f.track_item_id === contextMenu.trackItemId);
    if (!trackItem) return;
    await downloadTrackItem(contextMenu.trackItemId)


    setContextMenu({ visible: false, x: 0, y: 0, trackItemId: null });
    highlightTrackItemIdRef.current = null;
    animLineWidthRef.current = 0;
  };

  return {
    contextMenu,
    highlightTrackItemIdRef,
    animLineWidthRef,
    handleMouseDown,
    handleContextMenu,
    handleDownload,
    setContextMenu,
  };
};
