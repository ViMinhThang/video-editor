import { VideoFrame } from "@/types";
import { useRef } from "react";
import { TimelineRuler } from "./time-ruler";
import { TimelineCanvas } from "./time-canvas";

interface TimelineProps {
  frames: VideoFrame[];
  duration: number; // tổng thời gian video (giây)
  scale: number; // pixels per second
}

export const ScrollTimeline: React.FC<TimelineProps> = ({
  frames,
  duration,
  scale,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const width = duration * scale;

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        overflowX: "auto",
        overflowY: "hidden",
        border: "1px solid #ccc",
        whiteSpace: "nowrap",
      }}
    >
      <div style={{ width: width }}>
        <TimelineRuler
          width={width}
          height={30}
          duration={duration}
          scale={scale}
        />
        <TimelineCanvas
          frames={frames}
          groupGap={10}
          scale={scale}
          thumbnailWidth={80}
          thumbnailHeight={60}
        />{" "}
      </div>
    </div>
  );
};
