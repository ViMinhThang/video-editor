/**
 * @what Main dashboard view for an individual project's assets and workspace.
 * @why Serves as the high-level entry point where users can upload media, see project summaries, and launch the editor.
 * @how Coordinates data from 'useProject' and 'AssetCardGrid' while providing skeleton loading and English UI labels.
 */

import React from "react";
import AssetCardGrid from "./AssetCardGrid";
import { CreateCardButton } from "./CreateButtons";
import { Button } from "@/components/ui/button";
import { useProject } from "@/hooks/use-project";
import { deleteAsset } from "@/api/asset-api";
import { FileUp, Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WorkspaceDashboard() {
  const {
    project,
    assets,
    reloadAssets,
    handleUploadFile,
    handleFileChange,
    fileInputRef,
    loading,
  } = useProject();

  const navigate = useNavigate();

  const handleDeleteAsset = async (assetId: number) => {
    try {
      await deleteAsset(assetId);
      if (project?.id) {
        await reloadAssets(project.id);
      }
    } catch (error) {
      console.error("Failed to delete asset", error);
    }
  };

  const handleCreateVideo = () => {
    if (project?.id) {
      navigate(`/projects/${project.id}/editor`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center gap-4 text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-sm font-medium">Loading project workspace...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*,video/*"
        onChange={handleFileChange}
      />
      
      {/* Header Section */}
      <div className="flex flex-col mb-10">
        <div className="flex items-end gap-3 mb-8">
          <div className="bg-blue-600 w-2 h-8 rounded-full"></div>
          <h1 className="font-extrabold text-3xl text-zinc-900 tracking-tight">
            {project?.title || "Untitled Project"}
          </h1>
        </div>

        <div className="flex gap-4">
          <CreateCardButton type="video" onClick={handleCreateVideo} />
          <CreateCardButton type="image" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <h2 className="text-lg font-bold text-zinc-800">Media Library</h2>
          
          <Button
            onClick={handleUploadFile}
            variant="outline"
            className="flex items-center gap-2 px-6 py-5 rounded-xl transition-all border-zinc-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 text-zinc-600 group"
          >
            <FileUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            <span className="font-semibold text-sm">Upload Media</span>
            <Plus className="w-3 h-3 opacity-40 ml-1" />
          </Button>
        </div>

        <div className="min-h-[400px]">
          {assets && assets.length > 0 ? (
            <AssetCardGrid assets={assets} onDelete={handleDeleteAsset} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-zinc-50 border-2 border-dashed border-zinc-100 rounded-3xl">
              <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <FileUp className="w-8 h-8 text-zinc-300" />
              </div>
              <p className="text-zinc-900 font-semibold">No media found</p>
              <p className="text-zinc-500 text-sm mt-1 max-w-xs text-center">
                Your media library is currently empty. Upload your first video or image to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
