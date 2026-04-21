/**
 * @what Sidebar panel that manages the project's media library (Videos, Images, Audio).
 * @why Provides a central place for users to upload new assets and add existing ones to the timeline tracks.
 * @how Implements an upload trigger via a hidden file input and renders a grid of media thumbnails with add-to-track functionality.
 */

import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, Plus, FileVideo, Image as ImageIcon } from "lucide-react";
import type { Asset } from "@/types";

interface MediaSidebarProps {
  assets: Asset[];
  fileInputRef: React.RefObject<HTMLInputElement>;
  onUploadClick: () => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAddToTrack: (asset: Asset) => void;
}

export const AssetThumbnail = ({ asset }: { asset: Asset }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  if (asset.thumbnail) {
    return (
      <img
        src={API_BASE_URL + asset.thumbnail}
        alt={asset.original_name}
        className="w-full h-full object-cover rounded-md shadow-sm"
      />
    );
  }

  return (
    <div className="w-full h-full bg-zinc-100 flex items-center justify-center rounded-md border border-zinc-200">
      {asset.type === "video" ? <FileVideo className="w-6 h-6 text-zinc-400" /> : <ImageIcon className="w-6 h-6 text-zinc-400" />}
    </div>
  );
};

export default function MediaSidebar({
  assets,
  fileInputRef,
  onUploadClick,
  onFileChange,
  onAddToTrack,
}: MediaSidebarProps) {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Search & Header */}
      <div className="p-4 border-b border-zinc-100">
        <h3 className="text-sm font-bold text-zinc-900 mb-4 px-1 uppercase tracking-tight">Project Assets</h3>
        
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*,video/*"
          onChange={onFileChange}
        />
        
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2 h-10 rounded-lg shadow-sm" 
          onClick={onUploadClick}
        >
          <Upload className="w-4 h-4" />
          Import Media
        </Button>
      </div>

      {/* Assets Grid */}
      <div className="flex-1 p-4 overflow-y-auto">
        {assets && assets.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-zinc-200 cursor-pointer hover:border-blue-500 transition-colors bg-zinc-50"
                onClick={() => onAddToTrack(asset)}
              >
                <AssetThumbnail asset={asset} />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white rounded-full p-1 shadow-lg">
                    <Plus className="w-4 h-4 text-blue-600" />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-[10px] text-white truncate px-1 font-medium">
                    {asset.original_name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-center px-6">
            <div className="bg-zinc-50 rounded-full p-4 mb-3 border border-zinc-100">
              <Upload className="w-6 h-6 text-zinc-300" />
            </div>
            <p className="text-sm font-medium text-zinc-900">Your media is empty</p>
            <p className="text-xs text-zinc-400 mt-1">Upload videos or images to start editing</p>
          </div>
        )}
      </div>
    </div>
  );
}
