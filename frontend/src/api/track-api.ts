import { Asset, TrackItem } from "@/types";
import axios from "axios";

export const postTrack = async (
  asset: Asset,
  projectId: string,
  start_time: number
) => {
  await axios.post("/api/trackItems/", {
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
  return await axios.get(`/api/track-item/download?track_item_id=${id}`,{responseType:"blob"});
};
export const exportProject = async (projectId: string) => {
  if (!projectId) {
    console.log("There is no projectId");
  }
  return await axios.get(`/api/track-item/export?projectId=${projectId}`,{responseType:"blob"});
};
