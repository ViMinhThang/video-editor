/**
 * @what Sidebar panel dedicated to subtitle management and SRT importing.
 * @why Enables accessibility and localized content by allowing users to upload standardized subtitle files.
 * @how Provides a hidden file input for .srt files and triggers the 'importSrt' API call.
 */

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Type, AlertCircle } from "lucide-react";
import { useEditorContext } from "../../hooks/useEditor";
import { useParams } from "react-router-dom";
import { importSrt } from "@/api/track-api";
import type { Asset } from "@/types";

interface SubtitleSidebarProps {
  asset: Asset;
}

export default function SubtitleSidebar({ asset }: SubtitleSidebarProps) {
  const { projectId } = useParams<{ projectId: string }>();
  const { fetchProject } = useEditorContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUploadSrt = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !projectId) return;
    try {
      await importSrt(file, projectId, asset.id);
      await fetchProject();
    } catch (err) {
      console.error("Failed to import subtitles:", err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b border-zinc-100">
        <h3 className="text-sm font-bold text-zinc-900 mb-4 px-1 uppercase tracking-tight">Subtitles</h3>
        
        <input
          type="file"
          className="hidden"
          accept=".srt"
          ref={inputRef}
          onChange={handleUploadSrt}
        />
        
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2 h-10 rounded-lg shadow-sm"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="w-4 h-4" />
          Upload SRT File
        </Button>
      </div>

      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
        <div className="bg-blue-50 rounded-full p-4 mb-4">
          <Type className="w-8 h-8 text-blue-500" />
        </div>
        <h4 className="text-sm font-semibold text-zinc-900 mb-2">Auto-Substitles Coming Soon</h4>
        <p className="text-xs text-zinc-500 leading-relaxed max-w-[200px]">
          Currently, you can upload standard .srt files to sync with your video tracks.
        </p>
        
        <div className="mt-8 p-3 bg-zinc-50 rounded-lg border border-zinc-100 flex items-start gap-3 text-left">
          <AlertCircle className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
          <p className="text-[11px] text-zinc-500">
            Make sure your SRT timing matches the video start time in the editor.
          </p>
        </div>
      </div>
    </div>
  );
}
