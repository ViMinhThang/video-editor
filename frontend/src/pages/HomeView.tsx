/**
 * @what The default landing view for the project dashboard when no project is selected.
 * @why Provides a clean, welcoming interface that guides the user to start their first project.
 * @how Implements a centered layout with an iconography-based call to action in English.
 */

import React from "react";
import { FolderPlus, Video } from "lucide-react";

export default function HomeView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] h-full w-full text-zinc-400 bg-zinc-50/30 rounded-3xl border-2 border-dashed border-zinc-100">
      <div className="relative mb-6">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur opacity-20"></div>
        <div className="relative bg-white p-6 rounded-full shadow-sm border border-zinc-100">
          <Video className="w-12 h-12 text-blue-600" />
        </div>
      </div>
      
      <h2 className="text-xl font-bold text-zinc-900 mb-2">Welcome to Video Editor</h2>
      <p className="text-sm text-zinc-500 max-w-xs text-center leading-relaxed mb-8">
        Create a new project or select an existing one from the sidebar to start your editing journey.
      </p>

      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">
        <FolderPlus className="w-4 h-4" />
        Select a project to begin
      </div>
    </div>
  );
}
