import { VideoFrame } from "@/types";
import { useRef, useEffect, useState } from "react";
import { TimelineRuler } from "./time-ruler";
import { drawRoundedImage } from "@/lib/utils";
import { ArrowBigDown } from "lucide-react";
import { TimelineCanvas } from "./time-canvas";

interface TimelineProps {
  frames: VideoFrame[];
  duration: number;
  zoom?: number;
  currentTime: number;
  cutTime?: number;
  onTimeChange: (newTime: number) => void;
}

export const ScrollTimeline: React.FC<TimelineProps> = ({
  frames,
  duration,
  zoom = 100,
  currentTime,
  onTimeChange,
}) => {
  const extraTime = 60;
  const totalDuration = duration + extraTime;
  const baseScale = 40;
  const scale = baseScale * (zoom / 100);
  const frameDuration = duration / frames.length;
  const thumbnailWidth = frameDuration * scale;
  const width = totalDuration * scale;
  const cursorX = currentTime * scale;

  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    trackItemId: number | null;
  }>({ visible: false, x: 0, y: 0, trackItemId: null });

  const highlightTrackItemIdRef = useRef<number | null>(null);
  const animLineWidthRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  // Close context menu on click outside
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

  const handleMouseDown = (e: React.MouseEvent) => {
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
    // Start animation
    const animate = () => {
      animLineWidthRef.current = Math.min(animLineWidthRef.current + 0.5, 6);
      if (animLineWidthRef.current < 6) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };
    animate();
  };

  const handleDownload = () => {
    if (!contextMenu.trackItemId) return;
    const trackItem = frames.find(f => f.track_item_id === contextMenu.trackItemId);
    if (!trackItem) return;
    const link = document.createElement("a");
    link.href = import.meta.env.VITE_API_BASE_URL + trackItem.url;
    link.download = trackItem.url.split("/").pop() || "file.mp4";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setContextMenu({ visible: false, x: 0, y: 0, trackItemId: null });
    highlightTrackItemIdRef.current = null;
    animLineWidthRef.current = 0;
  };

  return (
    <div className="w-full overflow-x-auto overflow-y-hidden whitespace-nowrap relative">
      <div style={{ width: `${width}px`, position: "relative" }} onMouseDown={handleMouseDown}>
        <TimelineRuler width={width} height={30} duration={totalDuration} scale={scale} />
        <TimelineCanvas
          frames={frames}
          scale={scale}
          thumbnailWidth={thumbnailWidth}
          groupGap={5}
          highlightTrackItemIdRef={highlightTrackItemIdRef}
          animLineWidthRef={animLineWidthRef}
          onRightClick={handleContextMenu}
        />

        {/* Cursor */}
        <div style={{ position: "absolute", top: 0, left: `${cursorX}px`, width: "2.5px", height: "100%", backgroundColor: "black", pointerEvents: "none" }}>
          <ArrowBigDown style={{ position: "absolute", zIndex: 99999, fill: "black", top: "-4px", left: "50%", width: "20px", transform: "translateX(-50%)" }} />
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu.visible && (
        <ul
          style={{
            position: "fixed",
            top: contextMenu.y,
            left: contextMenu.x,
            backgroundColor: "white",
            border: "1px solid gray",
            listStyle: "none",
            padding: "5px",
            margin: 0,
            zIndex: 9999,
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
          onMouseLeave={() => {
            setContextMenu({ visible: false, x: 0, y: 0, trackItemId: null });
            highlightTrackItemIdRef.current = null;
            animLineWidthRef.current = 0;
          }}
        >
          <li className="cursor-pointer px-2 py-1 hover:bg-gray-200" onClick={handleDownload}>Tải xuống</li>
        </ul>
      )}
    </div>
  );
};