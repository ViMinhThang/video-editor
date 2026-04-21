/**
 * @what Primary navigation bar for the editor features (Media, Text, Subtitles, etc.).
 * @why Provides a consistent, tool-based navigation experience.
 * @how Uses a vertical stack of buttons with English labels and Lucide icons.
 */

import React from "react";
import {
  CaseUpper,
  CassetteTape,
  ClosedCaption,
  Music,
  Type,
  Wand2,
  Video,
} from "lucide-react";

export interface EditorTabItem {
  title: string;
  icon: React.ElementType;
  type: string;
}

interface EditorSidebarNavProps {
  activeTab: string;
  onTabChange: (item: EditorTabItem) => void;
}

export default function EditorSidebarNav({ activeTab, onTabChange }: EditorSidebarNavProps) {
  const items: EditorTabItem[] = [
    { title: "Media", icon: CassetteTape, type: "asset" },
    { title: "Text", icon: CaseUpper, type: "text" },
    { title: "Subtitles", icon: ClosedCaption, type: "subtitle" },
    { title: "Audio", icon: Music, type: "audio" },
    { title: "Effects", icon: Wand2, type: "effect" },
    { title: "Filters", icon: Type, type: "filter" },
  ];

  return (
    <div className="flex flex-col h-screen w-24 bg-zinc-950 text-zinc-400 border-r border-zinc-900 pt-6 items-center shrink-0">
      <div className="mb-8 text-blue-500">
        <Video className="w-8 h-8" />
      </div>
      
      <div className="flex flex-col gap-2 w-full px-2">
        {items.map((tab) => {
          const isActive = activeTab === tab.type;
          return (
            <button
              key={tab.type}
              className={`flex flex-col items-center justify-center py-4 rounded-xl transition-all duration-200 cursor-pointer group ${
                isActive 
                  ? "bg-zinc-900 text-white shadow-sm" 
                  : "hover:bg-zinc-900/50 hover:text-zinc-200"
              }`}
              onClick={() => onTabChange(tab)}
            >
              <tab.icon className={`w-5 h-5 mb-2 transition-transform group-hover:scale-110 ${
                isActive ? "text-blue-500" : ""
              }`} />
              <span className="text-[10px] font-medium uppercase tracking-wider">
                {tab.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
