import { useTimelineContext } from "@/hooks/use-timeline";
import { useVideo } from "@/hooks/use-video";
import { getTimelineMetrics } from "@/lib/utils";
import { ArrowBigDown } from "lucide-react";
import { useRef, useEffect } from "react";
import { TimeCanvasSubtitle } from "./time-canvas-subtitle";
import { TimelineCanvas } from "./time-canvas-video";
import { TimelineRuler } from "./time-ruler";
import { useEditorContext } from "@/hooks/use-editor";

export const ScrollTimeline = ({ zoom = 100 }: { zoom?: number }) => {
  const {
    frames,
    contextMenu,
    handleMouseDown,
    handleContextMenu,
    handleDownload,
    setContextMenu,
    highlightTrackItemIdRef,
    animLineWidthRef,
  } = useTimelineContext();
  const { duration } = useEditorContext();
  const { currentTime } = useVideo();

  const { totalDuration, scale, thumbnailWidth, width, cursorX } =
    getTimelineMetrics({
      framesLength: frames.length,
      duration,
      zoom,
      currentTime,
    });
  console.log("duration:" + totalDuration);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cursorPadding = container.clientWidth / 2;
    const scrollLeft = cursorX - cursorPadding;

    container.scrollTo({
      left: scrollLeft > 0 ? scrollLeft : 0,
      behavior: "smooth",
    });
  }, [cursorX]);

  return (
    <div
      ref={scrollRef}
      className="w-full overflow-x-auto overflow-y-hidden whitespace-nowrap relative"
    >
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
        <TimeCanvasSubtitle
          groupGap={10}
          highlightTrackItemIdRef={highlightTrackItemIdRef}
          animLineWidthRef={animLineWidthRef}
          onRightClick={handleContextMenu}
        />
        <TimelineCanvas
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
