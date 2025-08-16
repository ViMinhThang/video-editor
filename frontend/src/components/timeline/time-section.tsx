import axios from "axios";
import { Pause, Play, Scissors } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { ScrollTimeline } from "./time-scroll";
import { VideoFrame } from "@/types";
import { formatTime } from "@/lib/utils";

interface Props {
  frames: VideoFrame[];
  duration: number;
  zoom: number;
  currentTime: number;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  loadProject: () => void;
  togglePlay: () => void;
  isPlaying: boolean;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
}

export const TimelineSection = ({
  frames,
  duration,
  zoom,
  currentTime,
  setCurrentTime,
  loadProject,
  isPlaying,
  togglePlay,
  setZoom,
}: Props) => {
  const [cutTime, setCutTime] = useState<number | null>(null);

  const handleCutVideo = async () => {
    try {
      await axios.post("/api/track-item/cut-track-item", {
        currentTime: Math.ceil(currentTime),
      });
      loadProject();
      setCutTime(Math.ceil(currentTime));
    } catch (error) {
      console.error("Error cutting video:", currentTime, error);
    }
  };

  return (
    <div className="flex-1/6 p-2 bg-gray-100 flex flex-col overflow-auto">
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
            {formatTime(currentTime)} | {formatTime(duration)}
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

      {/* Timeline scroll */}
      <ScrollTimeline
        frames={frames}
        cutTime={cutTime}
        duration={duration}
        zoom={zoom}
        currentTime={currentTime}
        onTimeChange={setCurrentTime}
      />
    </div>
  );
};
