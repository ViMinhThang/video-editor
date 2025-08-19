import axios from "axios";
import { Pause, Play, Scissors } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { ScrollTimeline } from "./scroll-timeline";
import { TimeDisplay } from "./time-display";
import { useVideo } from "@/hooks/use-video";
import { useEditorContext } from "@/hooks/use-editor";
import { TimelineProvider } from "@/context/timeline-context";
import { cutVideo } from "@/api/track-api";

export const TimelineSection = () => {
  const { duration, fetchProject, tracks } = useEditorContext();
  const { isPlaying, currentTime, togglePlay, setCurrentTime } = useVideo();

  const [cutTime, setCutTime] = useState<number | null>(null);
  const [zoom, setZoom] = useState(100);

  const frames = tracks.video.flatMap((t) => t.video_frames || []);

  const handleCutVideo = async () => {
    try {
      const formatedTime = Math.ceil(currentTime);
      await cutVideo(formatedTime);
      fetchProject();
      setCutTime(formatedTime);
    } catch (error) {
      console.error("Error cutting video:", currentTime, error);
    }
  };

  return (
    <div className="p-2 bg-gray-100 flex flex-col overflow-auto">
      {/* Controls */}
      <div className="flex justify-between mb-1 border-b-2 p-2 items-center">
        <Button onClick={handleCutVideo} className="cursor-pointer">
          <Scissors />
        </Button>
        <div className="flex justify-center items-center">
          <Button
            onClick={togglePlay}
            className="rounded-2xl cursor-pointer shadow-black w-8 h-8"
          >
            {isPlaying ? (
              <Pause className="text-white" />
            ) : (
              <Play className="text-white" />
            )}
          </Button>
          <div className="ml-2 text-sm font-light">
            <TimeDisplay currentTime={currentTime} duration={duration} />
          </div>
        </div>

        <label className="flex items-center gap-2">
          Zoom:
          <input
            type="range"
            min={50}
            max={200}
            step={5}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-48 h-1 bg-gray-200 rounded-lg accent-black
              appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:rounded-full
              [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:rounded-full"
          />
        </label>
      </div>

      {/* Timeline */}
      <TimelineProvider frames={frames} setCurrentTime={setCurrentTime}>
        <ScrollTimeline zoom={zoom} />
      </TimelineProvider>
    </div>
  );
};
