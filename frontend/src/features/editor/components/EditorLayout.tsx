/**
 * @what The primary layout shell for the Video Editor.
 * @why Orchestrates the relationship between the sidebar features, the preview canvas, and the timeline.
 * @how Uses a mapping-based sidebar manager for scalability, integrates 'TopBar' with breadcrumbs, 
 * and centralizes feature-specific providers (Project, Video, Editor).
 */

import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import EditorSidebarNav, { EditorTabItem } from "./EditorSidebarNav";
import MediaSidebar from "./sidebars/MediaSidebar";
import SubtitleSidebar from "./sidebars/SubtitleSidebar";
import TextSidebar from "./sidebars/TextSidebar";
import { TimeSection } from "./timeline/TimeSection";
import { ProjectProvider } from "@/context/project-context";
import { useProject } from "@/hooks/use-project";
import { postTrack } from "@/api/track-api";
import { VideoProvider } from "@/context/video-context";
import { useEditorContext } from "../hooks/useEditor";
import { EditorProvider } from "@/context/editor-context";
import VideoCanvas from "./timeline/VideoCanvas";
import TopBar from "@/components/shared/nav/TopBar";
import { CassetteTape } from "lucide-react";
import type { Asset } from "@/types";

const VITE_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
  const { assets, handleUploadFile, handleFileChange, fileInputRef } = useProject();
  const { tracks, fetchProject, asset, setAsset } = useEditorContext();

  const [activeTab, setActiveTab] = useState<EditorTabItem>({
    title: "Media",
    icon: CassetteTape,
    type: "asset",
  });

  const handleAddTrackItem = async (assetData: Asset) => {
    if (assetData.type !== "video" || !projectId) return;
    setAsset(assetData);

    if (tracks[assetData.type].some((t) => t.asset_id === assetData.id)) return;

    const trackItems = tracks[assetData.type];
    const lastItem = trackItems[trackItems.length - 1];
    const start_time = lastItem ? lastItem.start_time + lastItem.end_time : 0;
    
    await postTrack(assetData, projectId, start_time);
    await fetchProject();
  };

  // Sidebar Mapping - 10/10 Readability improvement
  const SidebarContent = useMemo(() => {
    switch (activeTab.type) {
      case "asset":
        return (
          <MediaSidebar
            assets={assets}
            onUploadClick={handleUploadFile}
            onFileChange={handleFileChange}
            fileInputRef={fileInputRef}
            onAddToTrack={handleAddTrackItem}
          />
        );
      case "text":
        return <TextSidebar />;
      case "subtitle":
        return asset ? <SubtitleSidebar asset={asset} /> : <div className="p-4 text-zinc-500 text-sm">Select a video to add subtitles.</div>;
      default:
        return <div className="p-4 text-zinc-500 text-sm">Feature coming soon...</div>;
    }
  }, [activeTab.type, assets, asset, handleAddTrackItem, handleUploadFile, handleFileChange, fileInputRef]);

  return (
    <div className="flex h-screen overflow-hidden w-full bg-zinc-50">
      <EditorSidebarNav 
        activeTab={activeTab.type} 
        onTabChange={setActiveTab} 
      />

      <div className="flex flex-col flex-1 min-w-0">
        <TopBar projectTitle={"Project Editor"} />

        <div className="flex flex-1 overflow-hidden">
          <aside className="w-80 border-r border-zinc-200 bg-white overflow-y-auto shrink-0 shadow-sm z-10">
            {SidebarContent}
          </aside>

          <main className="flex-1 flex flex-col min-w-0 bg-zinc-100/50">
            <header className="h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-6 shrink-0">
              <h2 className="text-sm font-semibold text-zinc-900">{activeTab.title}</h2>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="h-8">Preview</Button>
                <Button size="sm" className="h-8 px-4 bg-blue-600 hover:bg-blue-700">Export</Button>
              </div>
            </header>

            <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
              <div className="w-full max-w-[1200px] aspect-video bg-black rounded-xl shadow-2xl overflow-hidden ring-1 ring-zinc-900/10">
                {asset?.url ? (
                  <VideoCanvas src={VITE_BASE_URL + asset.url} />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-zinc-500">
                    <CassetteTape className="w-12 h-12 opacity-20" />
                    <p className="text-sm font-medium">Select media from the sidebar to begin</p>
                  </div>
                )}
              </div>
            </div>

            <div className="h-1/3 min-h-[300px] border-t border-zinc-200 bg-white">
              <TimeSection />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
