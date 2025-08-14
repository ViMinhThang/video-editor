import { VideoFrame } from "@/types";
import { useRef } from "react";
import { TimelineRuler } from "./time-ruler";
import { TimelineCanvas } from "./time-canvas";
import { ArrowBigDown } from "lucide-react";

interface TimelineProps {
  frames: VideoFrame[];
  duration: number;
  zoom?: number;
  currentTime: number;
  cutTime?: number; // giây
  onTimeChange: (newTime: number) => void;
}

export const ScrollTimeline: React.FC<TimelineProps> = ({
  frames,
  duration,
  zoom = 100,
  currentTime,
  cutTime,
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

  const cutX =
    cutTime != null
      ? (() => {
          // xác định frame chứa cut
          const cutFrameIndex = Math.floor(cutTime / frameDuration);
          const cutOffset = cutTime % frameDuration;
          return cutFrameIndex * thumbnailWidth + (cutOffset / frameDuration) * thumbnailWidth;
        })()
      : 0;

  const handleTravel = (clientX: number, containerLeft: number) => {
    const clickX = clientX - containerLeft;
    const newTime = Math.max(0, Math.min(duration, clickX / scale));
    onTimeChange(newTime);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    handleTravel(e.clientX, rect.left);

    const onMove = (moveEvent: MouseEvent) => {
      handleTravel(moveEvent.clientX, rect.left);
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  return (
    <div className="w-[100%] overflow-x-auto overflow-y-hidden whitespace-nowrap relative">
      <div
        style={{ width: `${width}px`, position: "relative" }}
        onMouseDown={handleMouseDown}
      >
        <TimelineRuler
          width={width}
          height={30}
          duration={totalDuration}
          scale={scale}
        />

        <TimelineCanvas
          frames={frames}
          scale={scale}
          thumbnailWidth={thumbnailWidth}
          groupGap={5}
        />

        {/* Cursor */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: `${cursorX}px`,
            width: "2.5px",
            height: "100%",
            backgroundColor: "black",
            pointerEvents: "none",
          }}
        >
          <ArrowBigDown
            style={{
              position: "absolute",
              zIndex: "99999",
              fill: "black",
              top: "-4px",
              left: "50%",
              width: "20px",
              transform: "translateX(-50%)",
            }}
          />
        </div>

        {/* Cut marker */}
        {cutTime != null && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: `${cutX}px`,
              width: "2px",
              height: "100%",
              backgroundColor: "red",
              pointerEvents: "none",
            }}
          />
        )}
      </div>
    </div>
  );
};
