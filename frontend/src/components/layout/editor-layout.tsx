// components/editor/editor-layout.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import EditorMenu from "@/components/bars/editor-menu";
import AssetsPage from "@/pages/assets-page";
import SubtitlePage from "@/pages/subtitle-page";
import TextPage from "@/pages/text-page";
import { CassetteTape } from "lucide-react";
import { TimelineSection } from "../timeline/time-section";
import { useEditorContext } from "@/hooks/use-editor";
import VideoCanvas from "../timeline/video-canvas";
import { EditorProvider } from "@/context/editor-context";
import { VideoProvider } from "@/context/video-context";

const VITE_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface ItemProps {
  title: string;
  icon: React.ElementType;
  type: string;
}
export const EditorWrapper = () => (
  <EditorProvider>
    <VideoProvider>
      <EditorLayout />
    </VideoProvider>
  </EditorProvider>
);

const EditorLayout: React.FC = () => {
  const {
    assets,
    asset,
    projectId,
    handleUploadFile,
    handleFileChange,
    fileInputRef,
    addTrackItem,
  } = useEditorContext();

  const [item, setItem] = useState<ItemProps>({
    title: "Phương tiện",
    icon: CassetteTape,
    type: "asset",
  });

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
            handleAddToTrack={addTrackItem}
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
