import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import EditorMenu from "@/components/editor-menu";
import AssetsPage from "@/pages/assets-page";
import SubtitlePage from "@/pages/subtitle-page";
import TextPage from "@/pages/text-page";
import { Asset, VideoFrame } from "@/types";
import { CassetteTape, Scissors } from "lucide-react";
import { ScrollTimeline } from "@/components/timeline/time-scroll";
import { ProjectProvider } from "@/context/editor-context";
import { useProject } from "@/hooks/use-project";
import { useEditor } from "@/hooks/use-editor";

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

const TimelineSection = ({
  frames,
  duration,
  zoom,
  currentTime,
  setCurrentTime,
  loadProject,
}: {
  frames: VideoFrame[];
  duration: number;
  zoom: number;
  currentTime: number;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  loadProject: () => void;
}) => {
  const [cutTime, setCutTime] = useState<number | null>(null);

  const handleCutVideo = async () => {
    try {
      const response = await axios.post("/api/track-item/cut-track-item", {
        currentTime: Math.ceil(currentTime),
      });
      console.log(response.data);
      loadProject();
      const newCutTime = Math.ceil(currentTime);
      setCutTime(Math.ceil(currentTime));
      console.log("cutTime just set:", newCutTime);
    } catch (error) {
      console.log("error cutting" + currentTime);
    }
  };

  return (
    <div className="flex-1/5 p-2 bg-gray-100 overflow-x-auto whitespace-nowrap flex flex-col overflow-auto">
      <div className="mb-1 border-b-2 p-2">
        <Button className="cursor-pointer" onClick={handleCutVideo}>
          <Scissors />
        </Button>
      </div>

      <ScrollTimeline
        frames={frames}
        cutTime={cutTime}
        duration={duration}
        zoom={zoom}
        currentTime={currentTime}
        onTimeChange={setCurrentTime}
      />
    </div>
  );
};
const EditorLayout = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { assets, handleUploadFile, handleFileChange, fileInputRef } =
    useProject();
  const { duration, tracks, frames, loadProject } = useEditor(projectId);
  const [currentTime, setCurrentTime] = useState(0);

  const [zoom, setZoom] = useState(100);
  const [item, setItem] = useState<ItemProps>({
    title: "Phương tiện",
    icon: CassetteTape,
    type: "asset",
  });

  const handleAddTrackItem = async (asset: Asset) => {
    if (asset.type !== "video" || !projectId) return;

    const trackItems = tracks[asset.type];
    const lastItem = trackItems[trackItems.length - 1];
    const start_time = lastItem
      ? lastItem.start_time + lastItem.end_time // nối liền
      : 0;
    await axios.post("/api/trackItems/", {
      asset_id: asset.id,
      url: asset.url,
      project_id: projectId,
      track_id: 1,
      start_time,
    });
    await loadProject();
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <EditorMenu item={item} setItem={setItem} />

      {/* Panel */}
      <div className="w-[285px]">
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

      {/* Main Content */}
      <div className="flex flex-col w-full">
        {/* Toolbar */}
        <div className="bg-white p-3 flex gap-4 items-center">
          <Button className="bg-blue-500 rounded-sm">Export</Button>
          <label className="flex items-center gap-2">
            Zoom:
            <input
              type="range"
              min={50}
              max={200}
              step={5}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-48"
            />
          </label>
        </div>

        {/* Preview */}
        <div className="bg-gray-300 flex-1/2">Video Preview</div>

        {/* Timeline */}
        <TimelineSection
          frames={frames}
          duration={duration}
          zoom={zoom}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          loadProject={loadProject}
        />
      </div>
    </div>
  );
};
