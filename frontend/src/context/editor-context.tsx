/**
 * @what The primary state provider for the video editor scene.
 * @why Manages project-level data including visual tracks, total duration, and currently selected assets.
 * @how Synchronizes with the backend API and processes raw asset data into usable track models for the timeline.
 */

import React, { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { ReactNode } from "react";
import type { Asset, TrackItem, VideoFrame } from "@/types";
import { loadProject } from "@/api/track-api";
import { processAssets } from "../features/editor/services/EditorActions";
import { preloadProjectImages } from "../lib/timeline-draw";
import type { EditorContextType } from "@/types/editor";

export const EditorContext = createContext<EditorContextType | undefined>(
  undefined
);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [duration, setDuration] = useState(0);
  const [frames, setFrames] = useState<VideoFrame[]>([]);
  const [tracks, setTracks] = useState<Record<string, TrackItem[]>>({
    video: [],
    audio: [],
    text: [],
  });

  const handleAssets = async (assets: Asset[]) => {
    const { tracks: processedTracks, totalDuration, frames: processedFrames } = processAssets(assets);

    setTracks(processedTracks);
    setDuration(totalDuration);
    setFrames(processedFrames);

    // Optimized: Pre-load all frames for the timeline once per data change
    // This allows the canvas render loop to stay synchronous and jank-free
    await preloadProjectImages(processedTracks.video);
  };

  const fetchProject = async () => {
    if (!projectId) return;
    try {
      const res = await loadProject(projectId);
      handleAssets(res.data.assets);
    } catch (err) {
      console.error("Failed to load project", err);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  return (
    <EditorContext.Provider
      value={{ duration, frames, asset, tracks, fetchProject, setDuration, setTracks, setAsset }}
    >
      {children}
    </EditorContext.Provider>
  );
};
