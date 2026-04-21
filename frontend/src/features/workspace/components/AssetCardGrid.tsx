/**
 * @what A responsive grid component for displaying project media assets.
 * @why Provides a consistent and aesthetic way to browse and manage media files in the workspace.
 * @how Renders a collection of 'AssetCard' items with dynamic thumbnail generation based on mime-type and English context menus.
 */

import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Trash2, Calendar } from "lucide-react";
import { timeSince } from "@/lib/utils";
import type { Asset } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface AssetCardGridProps {
  assets: Asset[];
  onDelete: (assetId: number) => void;
}

export function AssetThumbnail({ asset }: { asset: Asset }) {
  const mimeType = asset.mime_type;

  if (asset.thumbnail) {
    return (
      <img
        src={API_BASE_URL + asset.thumbnail}
        alt={asset.original_name}
        className="w-full h-40 object-cover rounded-xl shadow-inner transition-transform group-hover:scale-105 duration-500"
      />
    );
  }

  return (
    <div className="w-full h-40 bg-zinc-100 flex items-center justify-center rounded-xl border border-zinc-200">
      <span className="text-zinc-400 text-xs font-medium uppercase tracking-widest">No Preview</span>
    </div>
  );
}

export default function AssetCardGrid({ assets, onDelete }: AssetCardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {assets?.map((asset) => (
        <Card
          key={asset.id}
          className="group pt-0 border-none bg-white rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
          <CardContent className="p-2">
            <div className="relative overflow-hidden rounded-xl">
               <AssetThumbnail asset={asset} />
               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
            </div>
          </CardContent>
          <CardFooter className="px-5 py-4 flex items-center justify-between gap-3">
            <div className="flex flex-col min-w-0">
              <h3 className="font-bold text-sm text-zinc-900 truncate" title={asset.original_name}>
                {asset.original_name}
              </h3>
              <div className="flex items-center gap-1.5 text-zinc-400 mt-1">
                 <Calendar className="w-3 h-3" />
                 <span className="text-[10px] font-medium uppercase tracking-tighter">
                   {timeSince(asset.created_at)}
                 </span>
              </div>
            </div>

            <div className="shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                  <Ellipsis className="w-5 h-5 text-zinc-500" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 p-1 rounded-xl shadow-xl border-zinc-100" align="end">
                  <DropdownMenuLabel
                    className="flex items-center gap-2 text-sm text-red-500 cursor-pointer hover:bg-red-50 rounded-lg p-2 transition-colors"
                    onClick={() => onDelete(asset.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Asset
                  </DropdownMenuLabel>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
