import EditorMenu from "@/components/editor-menu";
import { EditorProvider } from "@/context/editor-context";
import { useEditor } from "@/hooks/use-editor";
import AssetsPage from "@/pages/assets-page";
import SubtitlePage from "@/pages/subtitle-page";
import TextPage from "@/pages/text-page";
import { LucideIcon, CassetteTape } from "lucide-react";
import { useState } from "react";

export interface ItemProps {
  title: string;
  icon: LucideIcon;
  type: string;
}

export const EditorWrapper = () => {
  return (
    <EditorProvider>
      <EditorLayout />
    </EditorProvider>
  );
};

const EditorLayout = () => {
  const [item, setItem] = useState<ItemProps>({
    title: "Phương tiện",
    icon: CassetteTape,
    type: "asset",
  });

  const { assets, handleUploadFile, handleFileChange, project, fileInputRef } =
    useEditor();

  return (
    <div className="flex h-screen">
      <div className="border-r-0 h-full">
        <EditorMenu item={item} setItem={setItem} />
      </div>
      <div className="w-[285px]">
        {item.type === "asset" && (
          <AssetsPage
            assets={assets}
            handleUploadFile={handleUploadFile}
            handleFileChange={handleFileChange}
            fileInputRef={fileInputRef}
          />
        )}
        {item.type === "text" && <TextPage />}
        {item.type === "subtitle" && <SubtitlePage />}
      </div>
      <div>{project?.title}</div>
    </div>
  );
};
