import React, { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Asset, TrackItem, VideoFrame } from "@/types";
import { loadProject } from "@/api/track-api";

interface EditorContextType {
  duration: number;
  frames: VideoFrame[];
  tracks: Record<string, TrackItem[]>;
  fetchProject: () => Promise<void>;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
  setTracks: React.Dispatch<React.SetStateAction<Record<string, TrackItem[]>>>;
}

export const EditorContext = createContext<EditorContextType | undefined>(
  undefined
);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { projectId } = useParams<{ projectId: string }>();

  const [duration, setDuration] = useState(0);
  const [frames, setFrames] = useState<VideoFrame[]>([]);
  const [tracks, setTracks] = useState<Record<string, TrackItem[]>>({
    video: [],
    audio: [],
    text: [],
  });

  const handleAssets = (assets: Asset[]) => {
    const videoTracks: TrackItem[] = [];
    const audioTracks: TrackItem[] = [];
    const textTracks: TrackItem[] = [];

    assets.forEach((asset) => {
      if (!asset.track_items) return;
      asset.track_items.forEach((ti) => {
        ti.loading = false;
        switch (ti.track_id) {
          case 1:
            videoTracks.push(ti);
            break;
          case 3:
            audioTracks.push(ti);
            break;
          case 2:
            textTracks.push(ti);
            break;
        }
      });
    });

    const durationByAsset: Record<number, number> = {};
    videoTracks.forEach((t) => {
      if (t.asset_id != null) {
        durationByAsset[t.asset_id] = Math.max(
          durationByAsset[t.asset_id] || 0,
          t.end_time || 0
        );
      }
    });
    const totalDuration = Object.values(durationByAsset).reduce(
      (sum, dur) => sum + dur,
      0
    );

    setTracks({
      video: videoTracks,
      audio: audioTracks,
      text: textTracks,
    });
    setDuration(totalDuration);
    setFrames(videoTracks.flatMap((t) => t.video_frames || []));
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
