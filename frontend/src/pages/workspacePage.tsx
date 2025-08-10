import {
  fetchAssets,
  uploadAsset,
  deleteAsset as deleteAssetService,
} from "@/services/assetsServices";
import { Asset, Project } from "@/types";
import { FileUp, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cardmodi from "@/components/card-custom";
import { CreateCardButton } from "@/components/CreateButtons";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function WorkspacePage({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<Project | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const fetchProject = async () => {
    try {
      const res = await axios.get(`/api/project/${projectId}`);
      setProject(res.data);
    } catch {
      console.log("Project not found");
    }
  };

  const handleUploadFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadAsset(file, projectId);
      const updatedAssets = await fetchAssets(projectId);
      setAssets(updatedAssets);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAsset = async (assetId: number) => {
    try {
      await deleteAssetService(assetId);
      const updatedAssets = await fetchAssets(projectId);
      setAssets(updatedAssets);
    } catch (error) {
      console.error("Failed to delete asset", error);
    }
  };

  useEffect(() => {
    fetchProject();
    fetchAssets(projectId).then(setAssets).catch(console.log);
  }, [projectId]);

  const handleCreateVideo = () => {
    navigate(`/projects/${projectId}/editor`);
  };

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
