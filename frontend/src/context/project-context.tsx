import { fetchAssets, fetchProject, uploadAsset } from "@/api/asset-api";
import { loadProject } from "@/api/track-api";
import { Asset, Project } from "@/types";
import { createContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

interface ProjectContextType {
  project: Project | null;
  assets: Asset[];
  projectId:string
  handleUploadFile: () => void;
  handleFileChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
  fetchProject: () => void;
}

export const ProjectContext = createContext<ProjectContextType | null>(null);

export const ProjectProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      console.log(project);
      const asset = await uploadAsset(file, projectId);
      setAssets((prev) => [...prev, asset]);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchProject = async () => {
    if (!projectId) return;
    try {
      const res = await loadProject(projectId);
      setAssets(res.data.assets);
      // setProject(res.data.project);
    } catch (err) {
      console.error("Failed to load project", err);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        project,
        assets,
        handleUploadFile,
        projectId,
        handleFileChange,
        fileInputRef,
        setAssets,
        fetchProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
