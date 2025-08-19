import React, { createContext, ReactNode, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Asset, TrackItem, VideoFrame } from "@/types";
import { loadProject } from "@/api/track-api";
import { processAssests } from "@/services/editor-actions";
import { EditorContextType } from "@/types/editor";

export const EditorContext = createContext<EditorContextType | undefined>(
  undefined
);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const { projectId } = useParams<{ projectId: string }>();

  const [duration, setDuration] = useState(0);
  const [frames, setFrames] = useState<VideoFrame[]>([]);
  const [tracks, setTracks] = useState<Record<string, TrackItem[]>>({
    video: [],
    audio: [],
    text: [],
  });

  const handleAssets = (assets: Asset[]) => {
    const { tracks, totalDuration, frames } = processAssests(assets);

    setTracks(tracks);
    setDuration(totalDuration);
    setFrames(frames);
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
      value={{ duration, frames, tracks, fetchProject, setDuration, setTracks }}
    >
      {children}
    </EditorContext.Provider>
  );
};
