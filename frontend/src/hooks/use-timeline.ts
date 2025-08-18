import { TimelineContext } from "@/context/timeline-context";
import { useContext } from "react";

export const useTimelineContext = () => {
  const ctx = useContext(TimelineContext);
  if (!ctx) {
    throw new Error("useTimelineContext must be used inside TimelineProvider");
  }
  return ctx;
};
