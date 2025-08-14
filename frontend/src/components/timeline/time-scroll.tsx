import { useTimeline } from "@/hooks/use-timeline";
import { TimelineCanvas } from "./time-canvas";
import { TimelineRuler } from "./time-ruler";
import { ArrowBigDown } from "lucide-react";
import { VideoFrame } from "@/types";
import { getTimelineMetrics } from "@/lib/utils";

interface ScrollTimelineProps {
  frames: VideoFrame[];
  duration: number;
  zoom?: number;
  currentTime: number;
  onTimeChange: (newTime: number) => void;
  cutTime?: number;
}

export const ScrollTimeline = ({
  frames,
  duration,
  zoom = 100,
  currentTime,
  onTimeChange,
  cutTime,
}: ScrollTimelineProps) => {
  
const { totalDuration, scale, thumbnailWidth, width, cursorX } = getTimelineMetrics({
  framesLength: frames.length,
  duration,
  zoom,
  currentTime,
});


  const {
    contextMenu,
    highlightTrackItemIdRef,
    animLineWidthRef,
    handleMouseDown,
    handleContextMenu,
    handleDownload,
    setContextMenu,
  } = useTimeline(frames, duration, scale, onTimeChange);

  return (
    <div className="w-full overflow-x-auto overflow-y-hidden whitespace-nowrap relative">
      <div
        style={{ width: `${width}px`, position: "relative" }}
        onMouseDown={handleMouseDown}
      >
        <TimelineRuler
          width={width}
          height={20}
          duration={totalDuration}
          scale={scale}
        />

        <TimelineCanvas
          frames={frames}
          thumbnailWidth={thumbnailWidth}
          groupGap={5}
          highlightTrackItemIdRef={highlightTrackItemIdRef}
          animLineWidthRef={animLineWidthRef}
          onRightClick={handleContextMenu}
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
              zIndex: 99999,
              fill: "black",
              top: "-4px",
              left: "50%",
              width: "20px",
              transform: "translateX(-50%)",
            }}
          />
        </div>
      </div>

      {/* Context menu */}
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
          onMouseLeave={() =>
            setContextMenu({ visible: false, x: 0, y: 0, trackItemId: null })
          }
        >
          <li
            className="cursor-pointer px-2 py-1 hover:bg-gray-200"
            onClick={handleDownload}
          >
            Tải xuống
          </li>
        </ul>
      )}
    </div>
  );
};
