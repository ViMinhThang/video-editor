import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { timeSince } from "@/lib/utils";
import { Asset } from "@/types";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface CardmodiProps {
  assets: Asset[];
  onDelete: (trackId: number) => void;
}
export function AssetThumbnail({ asset }: { asset: Asset }) {
  const mimeType = asset.mime_type;

  if (mimeType === "video/mp4") {
    return (
      <img
        src={API_BASE_URL + asset.thumbnail}
        alt="Video thumbnail"
        className="w-full h-40 object-cover rounded-sm"
      />
    );
  }

  if (mimeType.startsWith("image/")) {
    return (
      <img
        src="/placeholder-image.png"
        alt="Image placeholder"
        className="w-full h-40 object-cover rounded-xl"
      />
    );
  }

  if (mimeType === "text/plain") {
    return null;
  }

  return (
    <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-xl">
      <span className="text-gray-500">No preview available</span>
    </div>
  );
}

export default function Cardmodi({ assets, onDelete }: CardmodiProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
      {assets?.map((asset, index) => (
        <Card
          key={index}
          className="w-[300px] pt-0 shadow-none border-white rounded-xl hover:bg-blue-100 p-2 duration-200 cursor-pointer"
        >
          <CardContent className="bg-gray-100 p-2 rounded-xl">
            <AssetThumbnail asset={asset} />
          </CardContent>
          <CardFooter className="px-4 flex items-center gap-3">
            <div className="flex flex-col">
              <h1 className="font-semibold text-sm truncate max-w-[180px]">
                {asset.original_name}
              </h1>
              <p className="text-sm"> {timeSince(asset.created_at)}</p>
            </div>

            <div className="ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger className="hover:bg-gray-100 p-2 rounded-full">
                  <Ellipsis className="w-5 h-5 text-gray-600" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="z-50">
                  <DropdownMenuLabel
                    className="text-sm text-red-500 cursor-pointer hover:bg-red-50"
                    onClick={() => onDelete(asset.id)}
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
