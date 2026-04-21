/**
 * @what A unified Konva-based Stage for the multi-track video timeline.
 * @why Replaces separate HTML5 canvases with a single, highly-interactive playground supporting magnetic dragging.
 * @how Orchestrates Stage, Layers, and the Draggable Clips while maintaining sync with the global EditorContext.
 */

import React, { useState, useMemo, useCallback } from "react";
import { Stage, Layer, Rect, Line, Group, Arrow } from "react-konva";
import { TimelineClip } from "./TimelineClip";
import { useEditorContext } from "@/features/editor/hooks/useEditor";
import { useTimelineContext } from "@/hooks/useTimeline";
import { useProject } from "@/hooks/useProject";
import { precalculateTimelineLayout, getTimelineMetrics, imageCache } from "@/lib/utils";
import { calculateMagneticShift } from "@/features/editor/services/MagneticLayout";
import { useVideo } from "@/features/editor/hooks/useVideo";

interface TimelineStageProps {
  zoom: number;
}

export const TimelineStage = ({ zoom }: TimelineStageProps) => {
  const { tracks, duration, setAsset } = useEditorContext();
  const { assets } = useProject();
  const { currentTime } = useVideo();
  const { 
    highlightTrackItemIdRef, 
    handleContextMenu 
  } = useTimelineContext();

  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragX, setDragX] = useState(0);

  // Constants for 10/10 layout
  const groupGap = 10;
  const trackHeight = 80;
  const headerHeight = 30;

  // Layout Metrics
  const { scale, thumbnailWidth, width, cursorX } = getTimelineMetrics({
    framesLength: tracks.video.reduce((acc, t) => acc + (t.video_frames?.length || 0), 0),
    duration,
    zoom,
    currentTime,
  });

  // Pre-calculate layouts
  const videoLayout = useMemo(() => 
    precalculateTimelineLayout(tracks.video, groupGap, thumbnailWidth, false),
    [tracks.video, groupGap, thumbnailWidth]
  );

  const subtitleLayout = useMemo(() => 
    precalculateTimelineLayout(tracks.text, groupGap, scale, true),
    [tracks.text, groupGap, scale]
  );

  // Magnetic Shift for Videos - The "Make room for me" logic
  const { shiftedItems: shiftedVideos } = useMemo(() => {
    const draggingItem = videoLayout.find(h => h.id === draggingId);
    return calculateMagneticShift(
      videoLayout, 
      draggingId, 
      dragX, 
      draggingItem?.width || 0, 
      groupGap
    );
  }, [videoLayout, draggingId, dragX, groupGap]);

  const handleDragMove = (e: any, id: number) => {
    // Only track X movement for the magnetic calculation
    setDragX(e.target.x());
    setDraggingId(id);
  };

  const handleDragEnd = async (e: any, id: number) => {
    setDraggingId(null);
    // TODO: Update the start_time in the backend/context based on the new drop position
    console.log("Magnetic Drop completed for", id);
  };

  const onClipClick = (item: any) => {
    const foundAsset = assets.find(a => a.id === item.asset_id);
    if (foundAsset) setAsset(foundAsset);
    highlightTrackItemIdRef.current = item.id;
  };

  return (
    <div className="w-full h-full bg-zinc-950 rounded-xl overflow-x-auto overflow-y-hidden scrollbar-hide shadow-2xl ring-1 ring-white/5">
      <Stage 
        width={width} 
        height={trackHeight * 3 + headerHeight} 
      >
        {/* Background Grid Layer */}
        <Layer listening={false}>
           <Rect width={width} height={trackHeight * 3 + headerHeight} fill="#09090b" />
           {/* Subtle Time Ticks could go here */}
        </Layer>

        {/* Tracks Layer */}
        <Layer>
          {/* Video Track Background */}
          <Group y={headerHeight + 10}>
            <Rect 
              width={width} 
              height={trackHeight} 
              fill="rgba(255,255,255,0.02)" 
              cornerRadius={8}
            />
            {shiftedVideos.map((item) => (
              <TimelineClip
                key={item.id}
                item={item.trackItem}
                x={item.shiftedX}
                y={0}
                width={item.width}
                height={trackHeight}
                isSelected={highlightTrackItemIdRef.current === item.id}
                type="video"
                thumbnailWidth={thumbnailWidth}
                imageCache={imageCache}
                onDragMove={(e) => handleDragMove(e, item.id)}
                onDragEnd={(e) => handleDragEnd(e, item.id)}
                onClick={() => onClipClick(item.trackItem)}
              />
            ))}
          </Group>

          {/* Subtitle Track Background */}
          <Group y={headerHeight + trackHeight + 30}>
            <Rect 
              width={width} 
              height={50} 
              fill="rgba(255,255,255,0.02)" 
              cornerRadius={8}
            />
            {subtitleLayout.map((item) => (
              <TimelineClip
                key={item.id}
                item={item.trackItem}
                x={item.x}
                y={5}
                width={item.width}
                height={40}
                isSelected={highlightTrackItemIdRef.current === item.id}
                type="text"
                imageCache={imageCache}
                onClick={() => onClipClick(item.trackItem)}
              />
            ))}
          </Group>
        </Layer>

        {/* Playhead Layer - High performance rendering */}
        <Layer listening={false}>
          <Group x={cursorX}>
             <Line
               points={[0, 0, 0, trackHeight * 3 + headerHeight]}
               stroke="#3b82f6"
               strokeWidth={2}
               shadowBlur={5}
               shadowColor="#3b82f6"
             />
             <Arrow
               points={[0, 0, 0, 15]}
               pointerLength={10}
               pointerWidth={10}
               fill="#3b82f6"
               stroke="#3b82f6"
               strokeWidth={2}
             />
          </Group>
        </Layer>
      </Stage>
    </div>
  );
};
