import Cardmodi from "@/components/card-custom";
import { CreateCardButton } from "@/components/CreateButtons";
import axios from "axios";
import { useEffect, useState } from "react";

interface ProjectType {
  id: number;
  title: string;
  tracks: any[];
}

export default function WorkspacePage({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<ProjectType | null>(null);
  const fetchProject = async () => {
    try {
      const response = await axios.get(`/api/project/${projectId}`);
      setProject(response.data);
    } catch (error) {
      console.log("Project not found");
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);
  return (
    <div className="w-[1600px]">
      <div className="flex flex-col mt-[80px] ml-5">
        <h1 className="font-bold text-lg mb-5">{project && project.title}</h1>
        <div className="flex gap-4 mb-5">
          <CreateCardButton type="video" />
          <CreateCardButton type="image" />
        </div>
      </div>
      <hr className="ml-5" />
      <div className="ml-5">
        <CreateCardButton type="media" />
        <Cardmodi />
      </div>
    </div>
  );
}
