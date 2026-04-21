/**
 * @what The core visual representation of the video timeline.
 * @why Renders tracks for video and subtitles, and manages a synchronized playhead ('cursor') across all tiers.
 * @how Coordinates spatial metrics (zoom, scale) and renders track-specific canvases ('TimeCanvasVideo', 'TimeCanvasSubtitle').
 */

import React, { useRef, useEffect } from "react";
import { useTimelineContext } from "@/hooks/use-timeline";
import { useVideo } from "../../hooks/useVideo";
import { getTimelineMetrics } from "@/lib/utils";
import { ArrowBigDown, Download } from "lucide-react";
import { TimeCanvasSubtitle } from "./TimeCanvasSubtitle";
import { TimeCanvasVideo } from "./TimeCanvasVideo";
import { TimeRuler } from "./TimeRuler";
import { useEditorContext } from "../../hooks/useEditor";

interface TimeLineProps {
  zoom?: number;
}

export const TimeLine = ({ zoom = 100 }: TimeLineProps) => {
  const {
    frames,
    contextMenu,
    handleMouseDown,
    handleDownload,
    setContextMenu,
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
      className="w-full overflow-x-auto overflow-y-hidden whitespace-nowrap relative scrollbar-hide bg-zinc-50 border border-zinc-100 rounded-xl shadow-inner scroll-smooth"
    >
      <div
        style={{ width: `${width}px`, position: "relative" }}
        onMouseDown={handleMouseDown}
        className="py-4"
      >
        <TimeRuler
          width={width}
          height={20}
          duration={totalDuration}
          scale={scale}
        />
        <TimeCanvasSubtitle
          groupGap={5}
        />
        <TimeCanvasVideo thumbnailWidth={thumbnailWidth} groupGap={5} />

        {/* Playhead Cursor */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: `${cursorX}px`,
            width: "2px",
            height: "100%",
            backgroundColor: "#3b82f6", // blue-500
            pointerEvents: "none",
            zIndex: 50,
          }}
        >
          <div className="absolute top-0 -left-2 text-blue-600">
            <ArrowBigDown className="w-5 h-5 fill-current" />
          </div>
        </div>
      </div>

      {/* Context Menu (English localized) */}
      {contextMenu.visible && (
        <div
          className="fixed bg-white border border-zinc-200 shadow-xl rounded-xl p-1 z-[100] min-w-[160px] animate-in fade-in zoom-in duration-150"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
          }}
          onMouseLeave={() =>
            setContextMenu({ visible: false, x: 0, y: 0, trackItemId: null })
          }
        >
          <button
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
            onClick={handleDownload}
          >
            <Download className="w-3.5 h-3.5" />
            Download Source
          </button>
        </div>
      )}
    </div>
  );
};
