import { Asset, TrackItem } from "@/types";
import axios from "axios";

export const postTrack = async (
  asset: Asset,
  projectId: string,
  start_time: number
) => {
  console.log(asset)
  return  await axios.post("/api/track-items", {
    asset_id: asset.id,
    url: asset.url,
    project_id: projectId,
    track_id: 1,
    start_time,
  });
};
export const loadProject = async (projectId: string) => {
  if (!projectId) {
    console.log("There is no projectId");
  }
  return await axios.get(`/api/projects/${projectId}/full`);
};
export const downloadTrackItem = async (id: number) => {
  if (!id) {
    console.log("There is no track id");
  }
  return await axios.get(`/api/track-item/download?track_item_id=${id}`, {
    responseType: "blob",
  });
};
export const exportProject = async (projectId: string) => {
  if (!projectId) {
    console.log("There is no projectId");
  }
  return await axios.get(`/api/track-item/export?projectId=${projectId}`, {
    responseType: "blob",
  });
};
export const importSrt = async (
  file: File,
  projectId: string,
  assetId: number
) => {
  if (!projectId) return console.log("There is no project id");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("project_id", projectId);
  formData.append("asset_id", assetId.toString());

  return await axios.post(`/api/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const cutVideo = async (currentTime: number) => {
  const res = await axios.post("/api/track-item/cut-track-item", {
    currentTime: currentTime,
  });
  return res;
};
export const updateText = async (track: TrackItem) => {
  const res = await axios.put(`/api/track-item/${track.id}`, track);
  return res;
};
