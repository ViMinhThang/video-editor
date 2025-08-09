import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Track } from "@/pages/workspacePage";
import axios from "axios";
import { Ellipsis } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface CardmodiProps {
  tracks: Track[];
  onDelete: (trackId: number) => void;
}
function TrackThumbnail({ track }: { track: Track }) {
  const mimeType = track.items[0].AssetModel.mime_type;

  if (mimeType === "video/mp4") {
    return (
      <img
        src={API_BASE_URL + track.items[0].AssetModel.thumbnail}
        alt="Video thumbnail"
        className="w-full h-40 object-cover rounded"
      />
    );
  }

  if (mimeType.startsWith("image/")) {
    return (
      <img
        src="/placeholder-image.png"
        alt="Image placeholder"
        className="w-full h-40 object-cover rounded"
      />
    );
  }

  if (mimeType === "text/plain") {
    return null;
  }

  return (
    <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded">
      <span className="text-gray-500">No preview available</span>
    </div>
  );
}

export default function Cardmodi({ tracks, onDelete }: CardmodiProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
      {tracks?.map((track, index) => (
        <Card
          key={index}
          className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl bg-gray-100"
        >
          <CardContent className="p-2">
            <TrackThumbnail track={track} />
          </CardContent>
          <CardFooter className="px-4 py-3 flex items-center gap-3">
            <h1 className="font-semibold text-sm truncate max-w-[180px]">
              {track.items[0].AssetModel.original_name}
            </h1>
            <div className="ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger className="hover:bg-gray-100 p-2 rounded-full">
                  <Ellipsis className="w-5 h-5 text-gray-600" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="z-50">
                  <DropdownMenuLabel
                    className="text-sm text-red-500 cursor-pointer hover:bg-red-50"
                    onClick={() => onDelete(track.id)}
                  >
                    Xóa
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
