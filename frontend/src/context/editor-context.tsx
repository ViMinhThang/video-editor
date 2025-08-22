// context/editor-context.tsx
import React, { createContext, useEffect, useReducer, useState } from "react";
import { useParams } from "react-router-dom";
import { addText, loadProject, postTrack } from "@/api/track-api";
import { uploadAsset } from "@/api/asset-api";
import { Asset, Project } from "@/types";
import { TrackItem, VideoFrame } from "@/types/track_item";
import { processAssests } from "@/services/editor-actions";
import { EditorContextType } from "@/types/editor";
import { takeDuration } from "@/lib/utils";
import { tracksReducer, TracksState } from "@/types/track";

export const EditorContext = createContext<EditorContextType | null>(null);
const initialTracks: TracksState = { video: [], audio: [], text: [] };

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { projectId } = useParams<{ projectId: string }>();

  const [project, setProject] = useState<Project | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [asset, setAsset] = useState<Asset | null>(null);
  const [tracks, dispatchTracks] = useReducer(tracksReducer, initialTracks);
  const [frames, setFrames] = useState<VideoFrame[]>([]);
  const [duration, setDuration] = useState(0);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const fetchProject = async () => {
    if (!projectId) return;
    try {
      const res = await loadProject(projectId);
      const { tracks } = processAssests(res.data.assets);
      setAssets(res.data.assets);
      updateProjectState(tracks.video, tracks.audio, tracks.text);
    } catch (err) {
      console.error("Failed to load project", err);
    }
  };

  const updateProjectState = (
    videoTracks: TrackItem[],
    audioTracks: TrackItem[] = [],
    textTracks: TrackItem[] = []
  ) => {
    dispatchTracks({
      type: "SET_TRACKS",
      payload: { video: videoTracks, audio: audioTracks, text: textTracks },
    });
    setFrames(videoTracks.flatMap((t) => t.video_frames || []));
    setDuration(takeDuration([...videoTracks, ...audioTracks, ...textTracks]));
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
  useEffect(() => {
    const allTracks = [...tracks.video, ...tracks.audio, ...tracks.text];

    setFrames(tracks.video.flatMap((t) => t.video_frames || []));
    setDuration(takeDuration(allTracks));
  }, [tracks]); // tracks thay đổi → tính lại frames & duration
  const addTrackItem = async (asset: Asset) => {
    if (asset.type !== "video" || !projectId) return;
    setAsset(asset);

    if (tracks.video.some((t) => t.assetId === asset.id)) return;

    const lastItem = tracks.video[tracks.video.length - 1];
    const start_time = lastItem ? lastItem.startTime + lastItem.endTime : 0;

    try {
      const tempTrack = await postTrack(asset, projectId, start_time);
      dispatchTracks({
        type: "ADD_TRACK",
        trackType: "video",
        payload: tempTrack,
      });
      setFrames([
        ...tracks.video.flatMap((t) => t.video_frames || []),
        ...(tempTrack.video_frames || []),
      ]);
      setDuration(
        takeDuration([
          ...tracks.video,
          tempTrack,
          ...tracks.audio,
          ...tracks.text,
        ])
      );
      // if (tracks.video.length === 0) {
      //   await fetchProject();
      // } else {
      //   dispatchTracks({ type: "ADD_TRACK", trackType: "video", payload: tempTrack });
      //   // setFrames([...tracks.video.flatMap((t) => t.video_frames || []), ...(tempTrack.video_frames || [])]);
      //   // setDuration(takeDuration([...tracks.video, tempTrack, ...tracks.audio, ...tracks.text]));
      // }
    } catch (error) {
      console.error("Error posting track item", error);
    }
  };

  const addTextItem = async (time: number, asset_id: number) => {
    if (!projectId) return;
    try {
      await addText(time, asset_id, Number(projectId));
      await fetchProject();
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

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
        updateProjectState,
        dispatchTracks,
        setDuration,
        fetchProject,
        addTextItem,
        handleUploadFile,
        handleFileChange,
        addTrackItem,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};
