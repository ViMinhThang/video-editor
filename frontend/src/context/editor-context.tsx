import { fetchAssets, fetchProject, uploadAsset } from "@/services/assetsServices";
import { Asset, Project } from "@/types";
import { createContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

interface ProjectContextType {
  project: Project | null;
  assets: Asset[];
  reloadProject: (id: string) => Promise<void>;
  reloadAssets: (id: string) => Promise<void>;
  handleUploadFile: () => void;
  handleFileChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  loading: boolean;
}

export const ProjectContext = createContext<ProjectContextType | null>(null);

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(true);
  const reloadProject = async (id: string) => {
    const data = await fetchProject(id);
    setProject(data);
  };

  const reloadAssets = async (id: string) => {
    const data = await fetchAssets(id);
    setAssets(data);
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
      console.log(project);
      await uploadAsset(file, projectId);
      const updatedAssets = await fetchAssets(projectId);
      setAssets(updatedAssets);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!projectId) return;

    setLoading(true);

    Promise.all([reloadProject(projectId), reloadAssets(projectId)]).finally(
      () => setLoading(false)
    );
  }, [projectId]);

  return (
    <ProjectContext.Provider
      value={{
        project,
        assets,
        reloadProject,
        reloadAssets,
        handleUploadFile,
        handleFileChange,
        fileInputRef,
        loading,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};