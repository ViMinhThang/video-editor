import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AssetModel } from "@/pages/workspacePage";
import { Ellipsis } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface CardmodiProps {
  assets: AssetModel[];
  onDelete: (trackId: number) => void;
}
function AssetThumbnail({ asset }: { asset: AssetModel }) {
  const mimeType = asset.mime_type;

  if (mimeType === "video/mp4") {
    return (
      <img
        src={API_BASE_URL + asset.thumbnail}
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

export default function Cardmodi({ assets, onDelete }: CardmodiProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
      {assets?.map((asset, index) => (
        <Card
          key={index}
          className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl bg-gray-100"
        >
          <CardContent className="p-2">
            <AssetThumbnail asset={asset} />
          </CardContent>
          <CardFooter className="px-4 py-1 flex items-center gap-3">
            <h1 className="font-semibold text-sm truncate max-w-[180px]">
              {asset.original_name}
            </h1>
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
