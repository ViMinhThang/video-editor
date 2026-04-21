/**
 * @what A draggable Konva component representing a single video or subtitle clip.
 * @why Provides a declarative way to handle clip rendering, selection, and drag-and-drop movement.
 * @how Wraps Konva 'Group', 'Rect', and 'Image' components with React state for interaction feedback.
 */

import React, { useMemo } from "react";
import { Group, Rect, Image, Text } from "react-konva";
import type { TrackItem } from "@/types";

interface TimelineClipProps {
  item: TrackItem;
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected?: boolean;
  type: "video" | "text" | "audio";
  thumbnailWidth?: number;
  imageCache: Record<string, HTMLImageElement>;
  onDragStart?: (e: any) => void;
  onDragMove?: (e: any) => void;
  onDragEnd?: (e: any) => void;
  onClick?: (e: any) => void;
}

export const TimelineClip = React.memo(({
  item,
  x,
  y,
  width,
  height,
  isSelected,
  type,
  thumbnailWidth = 60,
  imageCache,
  onDragStart,
  onDragMove,
  onDragEnd,
  onClick
}: TimelineClipProps) => {
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  // Render video frames as a collection of Images inside the group
  const frames = useMemo(() => {
    if (type !== "video" || !item.video_frames) return null;
    return item.video_frames.map((frame, idx) => {
      const src = API_URL + frame.url;
      const img = imageCache[src];
      if (!img) return null;

      return (
        <Image
          key={`${item.id}-frame-${idx}`}
          image={img}
          x={idx * thumbnailWidth}
          y={0}
          width={thumbnailWidth}
          height={height}
          listening={false} // Performance optimization
        />
      );
    });
  }, [type, item.video_frames, imageCache, thumbnailWidth, height, API_URL]);

  return (
    <Group
      x={x}
      y={y}
      draggable
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onClick={onClick}
      onTap={onClick}
    >
      {/* Background/Stroke */}
      <Rect
        width={width}
        height={height}
        fill={type === "text" ? (isSelected ? "rgba(59, 130, 246, 0.1)" : "#f4f4f5") : "transparent"}
        stroke={isSelected ? "#3b82f6" : "transparent"}
        strokeWidth={isSelected ? 3 : 0}
        cornerRadius={8}
        // Shadow during dragging
        shadowBlur={isSelected ? 10 : 0}
        shadowColor="rgba(0,0,0,0.1)"
      />

      {/* Frames (Videos only) */}
      {type === "video" && (
        <Group clipFunc={(ctx) => {
          // Manually draw the rounded clip path for the frame group
          ctx.beginPath();
          ctx.roundRect(0, 0, width, height, 8);
          ctx.closePath();
        }}>
          {frames}
        </Group>
      )}

      {/* Text (Subtitles only) */}
      {type === "text" && item.text_content && (
        <Text
          text={item.text_content.length > 20 ? item.text_content.substring(0, 20) + "..." : item.text_content}
          width={width}
          height={height}
          align="center"
          verticalAlign="middle"
          fontSize={12}
          fontFamily="Inter, sans-serif"
          fontStyle="600"
          fill={isSelected ? "#3b82f6" : "#71717a"}
          listening={false}
        />
      )}
    </Group>
  );
});
