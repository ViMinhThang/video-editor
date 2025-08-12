import axios from "axios";
import { Asset } from "@/types";

export const fetchAssets = async (projectId: string): Promise<Asset[]> => {
  const res = await axios.get(`/api/projects/${projectId}/assets`);
  return res.data;
};

export const uploadAsset = async (file: File, projectId: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("project_id", projectId);

  await axios.post("/api/upload", formData);
};

export const deleteAsset = async (assetId: number) => {
  await axios.delete(`/api/assets/${assetId}`);
};

export const fetchProject = async (projectId: string) => {
  const res = await axios.get(`/api/projects/${projectId}`);
  return res.data;
};
