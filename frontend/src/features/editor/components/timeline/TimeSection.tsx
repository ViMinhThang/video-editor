/**
 * @what Main timeline interface container.
 * @why Provides a central place for playback controls (Play, Pause, Split) and hosts the interactive visual timeline.
 * @how Orchestrates the relationship between the 'VideoContext', 'EditorContext', and 'TimeLine' visualization.
 */

import React, { useState } from "react";
import { Pause, Play, Scissors, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TimeDisplay } from "./TimeDisplay";
import { useVideo } from "../../hooks/useVideo";
import { useEditorContext } from "../../hooks/useEditor";
import { TimelineProvider } from "@/context/timeline-context";
import { cutVideo } from "@/api/track-api";
import { TimeLine } from "./TimeLine";

export const TimeSection = () => {
  const { duration, fetchProject, tracks } = useEditorContext();
  const { isPlaying, currentTime, togglePlay, setCurrentTime } = useVideo();

  const [zoom, setZoom] = useState(100);

  const frames = tracks.video.flatMap((t) => t.video_frames || []);

  const handleSplitVideo = async () => {
    try {
      const formattedTime = Math.ceil(currentTime);
      await cutVideo(formattedTime);
      await fetchProject();
    } catch (error) {
      console.error("Error splitting video:", currentTime, error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Playback & Tools Header */}
      <div className="flex items-center justify-between px-6 py-2 border-b border-zinc-100 bg-zinc-50/50">
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleSplitVideo} 
            variant="outline"
            size="sm"
            className="h-8 gap-2 border-zinc-200 hover:text-blue-600 transition-colors"
          >
            <Scissors className="w-4 h-4" />
            <span className="text-xs font-semibold">Split</span>
          </Button>
        </div>

        {/* Global Playback Controls */}
        <div className="flex items-center gap-4">
          <Button
            onClick={togglePlay}
            className="rounded-full w-10 h-10 bg-zinc-900 hover:bg-black text-white shadow-md hover:shadow-lg transition-all"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </Button>
          <div className="px-4 py-1.5 bg-zinc-900 rounded-lg shadow-inner">
            <TimeDisplay currentTime={currentTime} duration={duration} />
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-lg border border-zinc-200 shadow-sm">
          <ZoomOut className="w-3.5 h-3.5 text-zinc-400" />
          <input
            type="range"
            min={50}
            max={200}
            step={5}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-32 h-1 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <ZoomIn className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-[10px] font-bold text-zinc-400 w-8">{zoom}%</span>
        </div>
      </div>

      {/* Scrollable Timeline Area */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <TimelineProvider frames={frames} setCurrentTime={setCurrentTime}>
          <div className="min-w-max p-6">
             <TimeLine />
          </div>
        </TimelineProvider>
      </div>
    </div>
  );
};
