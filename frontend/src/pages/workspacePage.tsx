import Cardmodi from "@/components/card-custom";
import { CreateCardButton } from "@/components/CreateButtons";
import { Button } from "@/components/ui/button";
import { useProject } from "@/hooks/use-project";
import { deleteAsset } from "@/api/asset-api";
import { FileUp, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function WorkspacePage() {
  const {
    project,
    assets,
    setAssets,
    handleUploadFile,
    projectId,
    handleFileChange,
    fileInputRef,
    fetchProject,
  } = useProject();

  const navigate = useNavigate();

  const handleDeleteAsset = async (assetId: number) => {
    try {
      await deleteAsset(assetId);
      setAssets((prev) => prev.filter((asset) => asset.id !== assetId));
    } catch (error) {
      console.error("Failed to delete asset", error);
    }
  };

  const handleCreateVideo = () => {
    navigate(`/projects/${projectId}/editor`);
  };
  useEffect(()=>{
    if(projectId){
      fetchProject()
    }
  },[])

  return (
    <div className="w-[1600px]">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*,video/*"
        onChange={handleFileChange}
      />
      <div className="flex flex-col mt-[80px] ml-5">
        <h1 className="font-bold text-lg mb-5">{project?.title}</h1>
        <div className="flex gap-4 mb-5">
          <CreateCardButton type="video" onClick={handleCreateVideo} />
          <CreateCardButton type="image" />
        </div>
      </div>
      <hr className="ml-5" />
      <div className="ml-5">
        <Button
          onClick={handleUploadFile}
          variant="ghost"
          className="flex items-center justify-between px-4 py-3 w-60 h-20 rounded-2xl transition bg-gray-100 hover:bg-gray-200 mt-5"
        >
          <div className="flex items-center gap-2">
            <FileUp className="w-5 h-5" />
            <span className="font-semibold text-black text-sm">
              Tải lên phương tiện
            </span>
          </div>
          <span className="flex items-center justify-center w-6 h-6 rounded-full border text-lg font-bold text-black">
            <Plus className="w-4 h-4" />
          </span>
        </Button>

        <Cardmodi assets={assets} onDelete={handleDeleteAsset} />
      </div>
    </div>
  );
}
