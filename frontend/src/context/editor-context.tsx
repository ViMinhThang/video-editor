// context/editor-context.tsx
import React, { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { loadProject, postTrack } from "@/api/track-api";
import { uploadAsset } from "@/api/asset-api";
import { Asset, Project } from "@/types";
import { TrackItem, VideoFrame } from "@/types/track_item";
import { processAssests } from "@/services/editor-actions";
import { EditorContextType } from "@/types/editor";

export const EditorContext = createContext<EditorContextType | null>(null);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { projectId } = useParams<{ projectId: string }>();

  const [project, setProject] = useState<Project | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [asset, setAsset] = useState<Asset | null>(null);
  const [tracks, setTracks] = useState<Record<string, TrackItem[]>>({
    video: [],
    audio: [],
    text: [],
  });
  const [frames, setFrames] = useState<VideoFrame[]>([]);
  const [duration, setDuration] = useState(0);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const fetchProject = async () => {
    if (!projectId) return;
    try {
      const res = await loadProject(projectId);
      setAssets(res.data.assets);
      setProject(res.data.project ?? null);

      const { tracks, totalDuration, frames } = processAssests(res.data.assets);
      setTracks(tracks);
      setDuration(totalDuration);
      setFrames(frames);
    } catch (err) {
      console.error("Failed to load project", err);
    }
  };

  const handleUploadFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !projectId) return;
    try {
      const newAsset = await uploadAsset(file, projectId);
      setAssets((prev) => [...prev, newAsset]);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const addTrackItem = async (asset: Asset) => {
    if (asset.type !== "video" || !projectId) return;
    setAsset(asset);

    if (tracks.video.some((t) => t.assetId === asset.id)) return;

    const lastItem = tracks.video[tracks.video.length - 1];
    const start_time = lastItem ? lastItem.startTime + lastItem.endTime : 0;

    try {
      const tempTrack = await postTrack(asset, projectId, start_time);
      console.log("tempTrack", tempTrack);

      setTracks((prev) => ({
        ...prev,
        video: [...(prev.video ?? []), tempTrack],
      }));

      // sau đó fetch để đồng bộ thumbnail
      // await fetchProject();
    } catch (error) {
      console.error("Error posting track item", error);
    }
  };
  useEffect(() => {
    fetchProject();
  }, [projectId, tracks]);

  return (
    <EditorContext.Provider
      value={{
        project,
        projectId: projectId!,
        assets,
        asset,
        tracks,
        frames,
        duration,
        fileInputRef,
        setAsset,
        setAssets,
        setTracks,
        setDuration,
        fetchProject,
        handleUploadFile,
        handleFileChange,
        addTrackItem,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};
