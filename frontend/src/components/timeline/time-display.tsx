import { formatTime } from "@/lib/utils";
import { TimeDisplayProps } from "@/types/timeline";
import { useEffect, useState } from "react";



export const TimeDisplay = ({ currentTime, duration }: TimeDisplayProps) => {
  const [displayTime, setDisplayTime] = useState({
    current: formatTime(currentTime),
    total: formatTime(duration),
  });

  useEffect(() => {
    setDisplayTime({ current: formatTime(currentTime), total: formatTime(duration) });
  }, [currentTime, duration]);

  return (
    <div className="text-sm font-mono">
      {displayTime.current} | {displayTime.total}
    </div>
  );
};
