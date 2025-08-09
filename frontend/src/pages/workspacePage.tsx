import Cardmodi from "@/components/card-custom";
import { CreateCardButton } from "@/components/CreateButtons";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { FileUp, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AssetModel {
  mime_type: string;
  thumbnail: string;
  original_name: string;
}

interface TrackItem {
  AssetModel: AssetModel;
}

export interface Track {
  id: number;
  items: TrackItem[];
}

interface ProjectType {
  id: number;
  title: string;
}

export default function WorkspacePage({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<ProjectType | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadFile = () => {
    fileInputRef.current?.click();
  };

  const fetchProject = async () => {
    try {
      const res = await axios.get(`/api/project/${projectId}`);
      setProject(res.data);
    } catch (error) {
      console.log("Project not found");
    }
  };

  const fetchTracks = async () => {
    try {
      const res = await axios.get(`/api/projects/${projectId}/tracks-preview`);
      setTracks(res.data);
      console.log(res.data);
    } catch (error) {
      console.log("Error fetching tracks");
    }
  };
  const deleteTrack = async (trackId: number) => {
    try {
      await axios.delete(`/api/tracks/${trackId}`);
      await fetchTracks();
    } catch (error) {
      console.error("Failed to delete track", error);
    }
  };

  useEffect(() => {
    fetchProject();
    fetchTracks();
  }, [projectId]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("project_id", projectId);

    try {
      await axios.post("/api/upload", formData);
      await fetchTracks(); // Refresh danh sách ngay lập tức
    } catch (error) {
      console.log(error);
    }
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
          <CreateCardButton type="video" />
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

        <Cardmodi tracks={tracks} onDelete={deleteTrack} />
      </div>
    </div>
  );
}
