import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import EditorMenu from "@/components/bars/editor-menu";
import AssetsPage from "@/pages/assets-page";
import SubtitlePage from "@/pages/subtitle-page";
import TextPage from "@/pages/text-page";
import { Asset, VideoFrame } from "@/types";
import { CassetteTape } from "lucide-react";
import { TimelineSection } from "../timeline/time-section";
import { ProjectProvider } from "@/context/editor-context";
import { useProject } from "@/hooks/use-project";
import { useEditor } from "@/hooks/use-editor";
import { exportProject, postTrack } from "@/api/track-api";
import { useVideo } from "@/hooks/use-video";
import VideoCanvas from "../timeline/video-canvas";

const VITE_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface ItemProps {
  title: string;
  icon: React.ElementType;
  type: string;
}

export const EditorWrapper = () => (
  <ProjectProvider>
    <EditorLayout />
  </ProjectProvider>
);

const EditorLayout = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { assets, handleUploadFile, handleFileChange, fileInputRef } =
    useProject();
  const { duration, tracks, frames, fetchProject } = useEditor(projectId);

  const [asset, setAsset] = useState<Asset | null>(null);
  const [zoom, setZoom] = useState(100);
  const [item, setItem] = useState<ItemProps>({
    title: "Phương tiện",
    icon: CassetteTape,
    type: "asset",
  });
  const { videoRef, isPlaying, currentTime, togglePlay, setCurrentTime } =
    useVideo();
  const handleAddTrackItem = async (asset: Asset) => {
    if (asset.type !== "video" || !projectId) return;
    setAsset(asset);

    // Không add nếu cùng asset id đã có trong tracks
    if (tracks[asset.type].some((t) => t.asset_id === asset.id)) return;

    const trackItems = tracks[asset.type];
    console.log(trackItems);
    const lastItem = trackItems[trackItems.length - 1];
    const start_time = lastItem ? lastItem.start_time + lastItem.end_time : 0;
    console.log(start_time);
    await postTrack(asset, projectId, start_time);
    await fetchProject();
  };

  const handleExportProject = async (projectId: string) => {
    try {
      const response = await exportProject(projectId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `project_${projectId}.mp4`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden w-full">
      <EditorMenu item={item} setItem={setItem} />

      {/* Sidebar */}
      <div className="w-[20%]">
        {item.type === "asset" && (
          <AssetsPage
            assets={assets}
            handleUploadFile={handleUploadFile}
            handleFileChange={handleFileChange}
            fileInputRef={fileInputRef}
            handleAddToTrack={handleAddTrackItem}
          />
        )}
        {item.type === "text" && <TextPage />}
        {item.type === "subtitle" && <SubtitlePage />}
      </div>

      {/* Main content */}
      <div className="flex flex-col w-[80%]">
        {/* Top bar */}
        <div className="bg-white p-3 flex gap-4 items-center justify-between">
          <div>asdasdsd</div>
          <Button
            className="rounded-sm"
            onClick={() => handleExportProject(projectId)}
          >
            Export
          </Button>
        </div>

        {/* Video preview */}
        <div className="bg-gray-200 flex p-5 justify-center items-center min-h-[400px]">
          {asset?.url ? (
            <VideoCanvas
              videoRef={videoRef}
              src={VITE_BASE_URL + asset.url}
              overlayText="Hello world!" // hoặc lấy từ subtitle track
              currentTime={currentTime}
            />
          ) : (
            <div className="w-[80%] h-[667px] flex flex-col justify-center items-center rounded-md"></div>
          )}
        </div>

        {/* Timeline */}
        <TimelineSection
          frames={frames}
          duration={duration}
          zoom={zoom}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime} // kéo timeline sẽ seek video
          loadProject={fetchProject}
          isPlaying={isPlaying}
          setZoom={setZoom}
          togglePlay={togglePlay}
        />
      </div>
    </div>
  );
};
