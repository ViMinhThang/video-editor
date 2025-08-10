import EditorMenu from "@/components/editor-menu";
import AssetsPage from "@/pages/assets-page";
import SubtitlePage from "@/pages/subtitle-page";
import TextPage from "@/pages/text-page";
import { fetchAssets, uploadAsset } from "@/services/assetsServices";
import { Asset } from "@/types";
import { CassetteTape, LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export interface ItemProps {
  title: string;
  icon: LucideIcon;
  type: string;
}

export default function EditorLayout() {
  const [item, setItem] = useState<ItemProps>({
    title: "Phương tiện",
    icon: CassetteTape,
    type: "asset",
  });
  const [assets, setAssets] = useState<Asset[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { id } = useParams();

  const handleUploadFile = () => {
    fileInputRef.current?.click();
    
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadAsset(file, id);
      const updatedAssets = await fetchAssets(id);
      setAssets(updatedAssets);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAssets(id).then(setAssets).catch(console.log);
  }, [id]);

  return (
    <div className="flex h-screen">
      <div className="border-r-0 h-full">
        <EditorMenu item={item} setItem={setItem} />
      </div>
      <div className="w-[285px]">
        {item.type == "asset" && <AssetsPage assets={assets} handleUploadFile={handleUploadFile} handleFileChange={handleFileChange} fileInputRef={fileInputRef} />}
        {item.type == "text" && <TextPage />}
        {item.type == "subtitle" && <SubtitlePage />}
      </div>
      <div>asdasd</div>
    </div>
  );
}
