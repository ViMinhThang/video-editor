/**
 * @what High-precision time feedback display.
 * @why Provides users with numeric confirmation of their exact position in the timeline and the total video length.
 * @how Formats seconds into HH:MM:SS:FF (or similar) using mono-spaced fonts to prevent layout jitter during playback.
 */

import React, { useEffect, useState } from "react";
import { formatTime } from "@/lib/utils";
import type { TimeDisplayProps } from "@/types/timeline";

export const TimeDisplay = ({ currentTime, duration }: TimeDisplayProps) => {
  const [displayTime, setDisplayTime] = useState({
    current: formatTime(currentTime),
    total: formatTime(duration),
  });

  useEffect(() => {
    setDisplayTime({ 
      current: formatTime(currentTime), 
      total: formatTime(duration) 
    });
  }, [currentTime, duration]);

  return (
    <div className="text-xs font-mono font-bold text-white tracking-widest flex items-center gap-2">
      <span className="text-blue-400">{displayTime.current}</span>
      <span className="text-zinc-600">/</span>
      <span className="text-zinc-400">{displayTime.total}</span>
    </div>
  );
};
