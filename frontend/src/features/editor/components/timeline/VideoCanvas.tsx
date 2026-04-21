/**
 * @what This file defines the 'VideoCanvas' component, the primary interface for video and overlay manipulation.
 * @why It replaces the manual imperative drawing loop with a declarative Konva-based system. This allows for complex 
 * interactions (dragging, resizing, rotating) with built-in selection handling and high-quality rendering.
 * @how It integrates 'EditorStage', 'VideoElement', and multiple 'TextElement' components. It manages the 
 * global selection state and orchestrates persistent updates to the backend via the track API.
 */

import React, { useState } from "react";
import { useVideo } from "../../hooks/useVideo";
import { useEditorContext } from "../../hooks/useEditor";
import { updateText } from "@/api/track-api";
import { VideoCanvasProps } from "@/types/video";
import { EditorStage } from "../canvas/Stage";
import { VideoElement } from "../canvas/VideoElement";
import { TextElement } from "../canvas/TextElement";
import type { TrackItem } from "@/types";

const VideoCanvas: React.FC<VideoCanvasProps> = ({
  src,
  width = 1128.88,
  height = 635,
}) => {
  const { videoRef, currentTime } = useVideo();
  const { tracks, setTracks } = useEditorContext();
  
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const texts = tracks.text;

  // Handle changes from the Konva canvas and sync back to state/API
  const handleItemChange = async (newAttrs: Partial<TrackItem>) => {
    setTracks((prev) => ({
      ...prev,
      text: prev.text.map((t) => (t.id === newAttrs.id ? { ...t, ...newAttrs } : t)),
    }));

    // Persist to backend if it's a final change (onDragEnd/onTransformEnd)
    const track = texts.find((t) => t.id === newAttrs.id);
    if (track) {
      try {
        await updateText({ ...track, ...newAttrs } as TrackItem);
      } catch (err) {
        console.error("Failed to persist track update:", err);
      }
    }
  };

  return (
    <div className="relative flex justify-center items-center shadow-2xl rounded-lg overflow-hidden bg-black">
      {/* 
          Hidden video source. In a production app, we might move this 
          to a global manager, but keeping it here for continuity with existing hooks.
      */}
      <video ref={videoRef} src={src} style={{ display: "none" }} />
      
      <EditorStage 
        width={width} 
        height={height}
        onStageClick={(e) => {
          // Deselect if clicking on empty stage
          const clickedOnEmpty = e.target === e.target.getStage();
          if (clickedOnEmpty) {
            setSelectedId(null);
          }
        }}
      >
        {/* Background Video Layer */}
        <VideoElement 
          videoElement={videoRef.current} 
          width={width} 
          height={height} 
        />

        {/* Dynamic Text Layers */}
        {texts.map((t) => {
          // Only render text if it falls within the current timeline visibility
          const isVisible = currentTime >= t.start_time && currentTime <= t.end_time;
          
          if (!isVisible) return null;

          return (
            <TextElement
              key={t.id}
              item={t}
              isSelected={t.id === selectedId}
              onSelect={() => setSelectedId(t.id)}
              onChange={handleItemChange}
            />
          );
        })}
      </EditorStage>
    </div>
  );
};

export default VideoCanvas;
