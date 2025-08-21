import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import EditorMenu from "@/components/bars/editor-menu";
import AssetsPage from "@/pages/assets-page";
import SubtitlePage from "@/pages/subtitle-page";
import TextPage from "@/pages/text-page";
import { Asset } from "@/types";
import { CassetteTape } from "lucide-react";
import { TimelineSection } from "../timeline/time-section";
import { ProjectProvider } from "@/context/project-context";
import { useProject } from "@/hooks/use-project";
import { postTrack } from "@/api/track-api";
import { VideoProvider } from "@/context/video-context";
import { useEditorContext } from "@/hooks/use-editor";
import { EditorProvider } from "@/context/editor-context";
import VideoCanvas from "../timeline/video-canvas";

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
  const {
    assets,
    projectId,
    handleUploadFile,
    handleFileChange,
    fileInputRef,
  } = useProject();
  const { tracks, setTracks, asset, setAsset,fetchProject } = useEditorContext();

  const [item, setItem] = useState<ItemProps>({
    title: "Phương tiện",
    icon: CassetteTape,
    type: "asset",
  });
  const handleAddTrackItem = async (asset: Asset) => {
    if (asset.type !== "video" || !projectId) return;
    setAsset(asset);

    if (tracks.video.some((t) => t.assetId === asset.id)) return;
    console.log("asset",asset)
    const lastItem = tracks.video[tracks.video.length - 1];
    const start_time = lastItem ? lastItem.startTime + lastItem.endTime : 0;

    try {
      const res = await postTrack(asset, projectId, start_time);

      setTracks((prev) => ({
        ...prev,
        video: [...prev.video, res.data],
      }));
      await fetchProject();
    } catch (error) {
      console.log("Error posting track item", error);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, []);

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
            <VideoCanvas src={VITE_BASE_URL + asset.url} />
          ) : (
            <div className="w-[80%] h-[667px] flex flex-col justify-center items-center rounded-md"></div>
          )}
        </div>

        <TimelineSection />
      </div>
    </div>
  );
};
