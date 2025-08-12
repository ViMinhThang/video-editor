import { Button } from "@/components/ui/button";
import { Ellipsis, Upload } from "lucide-react";
import React from "react";
import { Asset } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { timeSince } from "@/lib/utils";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AssetThumbnail } from "@/components/card-custom";

interface Props {
  assets: Asset[];
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleUploadFile: () => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddToTrack: (asset: Asset) => void;
}


const AssetsPage = ({
  assets,
  fileInputRef,
  handleUploadFile,
  handleFileChange,
  handleAddToTrack,
}: Props) => {
  return (
    <div className="border-none bg-black text-white px-5 w-full h-full">
      <div className="text-white font-bold border-b-1 border-gray-800 px-5 py-2">
        <h1>Alice's project</h1>
      </div>
      <div className="mt-5">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*,video/*"
          onChange={handleFileChange}
        />
        <Button className="w-60 cursor-pointer" onClick={handleUploadFile}>
          <Upload /> Tải lên
        </Button>
      </div>
      <div className="mt-5 flex flex-wrap">
        {assets?.map((asset, index) => (
          <div
            key={index}
            className="w-[120px] h-[90px] flex-shrink-0 flex flex-col hover:bg-gray-200 p-2 rounded-sm hover:text-black cursor-pointer"
            onClick={() => handleAddToTrack(asset)}
          >
            <AssetThumbnail asset={asset} />
            <h1
              className="text-sm mt-1 font-light truncate pb-5"
              title={asset.original_name}
            >
              {asset.original_name}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetsPage;
