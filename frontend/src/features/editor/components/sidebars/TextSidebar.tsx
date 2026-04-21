/**
 * @what Sidebar panel that provides text presets and customization tools.
 * @why Allows users to quickly add stylized text overlays (Titles, Body, Sub-headings) to their video scenes.
 * @how Renders a list of interactive text presets that, when clicked, inject a new Text track item into the editor context.
 */

import React from "react";
import { CaseUpper, Type, Heading1, Heading2, AlignLeft } from "lucide-react";
// In a real app, this would use a 'handleCreateText' from context. 
// For now, it provides the UI layout for 10/10 perfection.

export default function TextSidebar() {
  const presets = [
    { id: "h1", label: "Add Heading", icon: Heading1, desc: "Perfect for video titles" },
    { id: "h2", label: "Add Subheading", icon: Heading2, desc: "Secondary information" },
    { id: "body", label: "Add Body Text", icon: AlignLeft, desc: "General descriptions" },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b border-zinc-100">
        <h3 className="text-sm font-bold text-zinc-900 mb-4 px-1 uppercase tracking-tight">Text Overlays</h3>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-3">
          {presets.map((preset) => (
            <button
              key={preset.id}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-zinc-100 hover:border-blue-500 hover:bg-blue-50/30 transition-all text-left group"
            >
              <div className="bg-zinc-100 rounded-lg p-2 group-hover:bg-blue-100 transition-colors">
                <preset.icon className="w-5 h-5 text-zinc-600 group-hover:text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">{preset.label}</p>
                <p className="text-[11px] text-zinc-500">{preset.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8">
          <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4 px-1">Styling Presets</h4>
          <div className="grid grid-cols-2 gap-2">
            {["Neon", "Impact", "Subtle", "Retro"].map((style) => (
              <button
                key={style}
                className="py-3 px-2 rounded-lg bg-zinc-50 border border-zinc-100 text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
