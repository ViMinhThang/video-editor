/**
 * @what The core visual representation of the video timeline.
 * @why Renders tracks for video and subtitles, and manages a synchronized playhead ('cursor') across all tiers.
 * @how Coordinates spatial metrics and renders the unified 'TimelineStage' which replaces legacy canvases.
 */

import React, { useRef, useEffect } from "react";
import { useTimelineContext } from "@/hooks/useTimeline";
import { useVideo } from "../../hooks/useVideo";
import { getTimelineMetrics } from "@/lib/utils";
import { Download } from "lucide-react";
import { TimeRuler } from "./TimeRuler";
import { useEditorContext } from "../../hooks/useEditor";
import { TimelineStage } from "./konva/TimelineStage";

interface TimeLineProps {
  zoom?: number;
}

export const TimeLine = ({ zoom = 100 }: TimeLineProps) => {
  const {
    frames,
    contextMenu,
    handleDownload,
    setContextMenu,
  } = useTimelineContext();
  const { duration } = useEditorContext();
  const { currentTime } = useVideo();

  const { totalDuration, scale, width, cursorX } =
    getTimelineMetrics({
      framesLength: frames.length,
      duration,
      zoom,
      currentTime,
    });
    
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic to follow the playhead
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
      className="w-full overflow-x-auto overflow-y-hidden whitespace-nowrap relative scrollbar-hide bg-zinc-950 border border-white/5 rounded-2xl shadow-2xl scroll-smooth"
    >
      <div
        style={{ width: `${width}px`, position: "relative" }}
        className="py-4"
      >
        {/* Time Ruler remains a separate canvas for now for architectural separation */}
        <div className="px-4">
           <TimeRuler
             width={width}
             height={20}
             duration={totalDuration}
             scale={scale}
           />
        </div>

        {/* The New Unified Konva Stage - Replaces separate canvases */}
        <div className="mt-2">
           <TimelineStage zoom={zoom} />
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
