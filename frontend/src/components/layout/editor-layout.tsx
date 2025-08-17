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
import { ProjectProvider } from "@/context/project-context";
import { useProject } from "@/hooks/use-project";
import { postTrack } from "@/api/track-api";
import { useVideo } from "@/hooks/use-video";
import { VideoProvider } from "@/context/video-context";
import { useEditorContext } from "@/hooks/use-editor";
import { EditorProvider } from "@/context/editor-context";

const VITE_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface ItemProps {
  title: string;
  icon: React.ElementType;
  type: string;
}

export const EditorWrapper = () => (
  <ProjectProvider>
    <EditorProvider>
      <VideoProvider>
        <EditorLayout />
      </VideoProvider>
    </EditorProvider>
  </ProjectProvider>
);

const EditorLayout = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { assets, handleUploadFile, handleFileChange, fileInputRef } =
    useProject();
  const { tracks, fetchProject } = useEditorContext();

  const [asset, setAsset] = useState<Asset | null>(null);
  const [item, setItem] = useState<ItemProps>({
    title: "Phương tiện",
    icon: CassetteTape,
    type: "asset",
  });
  const { videoRef } = useVideo();
  const handleAddTrackItem = async (asset: Asset) => {
    if (asset.type !== "video" || !projectId) return;
    setAsset(asset);

    // Không add nếu cùng asset id đã có trong tracks
    if (tracks[asset.type].some((t) => t.asset_id === asset.id)) return;

    const trackItems = tracks[asset.type];
    const lastItem = trackItems[trackItems.length - 1];
    const start_time = lastItem ? lastItem.start_time + lastItem.end_time : 0;
    await postTrack(asset, projectId, start_time);
    await fetchProject();
    console.log("fetchted");
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
        {item.type === "subtitle" && asset && <SubtitlePage asset={asset} />}
      </div>

      {/* Main content */}
      <div className="flex flex-col w-[80%]">
        {/* Top bar */}
        <div className="bg-white p-3 flex gap-4 items-center justify-between">
          <div>asdasdsd</div>
          <Button className="rounded-sm">Export</Button>
        </div>

        {/* Video preview */}
        <div className="bg-gray-200 flex p-5 justify-center items-center min-h-[400px]">
          {asset?.url ? (
            <video
              ref={videoRef}
              className="w-[80%] rounded-md shadow-md"
              src={VITE_BASE_URL + asset.url}
            />
          ) : (
            <div className="w-[80%] h-[667px] flex flex-col justify-center items-center rounded-md"></div>
          )}
        </div>

          <TimelineSection />
      </div>
    </div>
  );
};
