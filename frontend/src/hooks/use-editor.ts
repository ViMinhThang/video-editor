import { splitTrackItems } from "@/lib/utils";
import { Asset, TrackItem, VideoFrame } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

export const useEditor = (projectId?: string) => {
  const [duration, setDuration] = useState(0);
  const [frames, setFrames] = useState<VideoFrame[]>([]);
  const [tracks, setTracks] = useState<Record<string, TrackItem[]>>({
    video: [],
    audio: [],
    text: [],
  });
  const loadProject = async () => {
    if (!projectId) {
      console.log("There is no projectId");
    } else {
      const res = await axios.get(`/api/projects/${projectId}/full`);
      handleAssets(res.data.assets);
    }
  };
  const handleAssets = (assests: Asset[]) => {
    const videoTracks: TrackItem[] = [];
    const audioTracks: TrackItem[] = [];
    const textTracks: TrackItem[] = [];
    assests.forEach((assest) => {
      if (!assest.track_items) {
        console.log(`This asset ${assest.id} has no track items`);
      } else {
        assest.track_items.forEach((ti) => {
          ti.loading = false;
          if (assest.type === "video") videoTracks.push(ti);
          if (assest.type === "audio") audioTracks.push(ti);

          if (assest.type === "text") textTracks.push(ti);
        });
      }
    });

    const durationByAsset: Record<number, number> = {};
    videoTracks.forEach((t) => {
      if (t.asset_id != null) {
        durationByAsset[t.asset_id] = Math.max(
          durationByAsset[t.asset_id] || 0,
          t.end_time || 0
        );
      }
    });
    const totalDuration = Object.values(durationByAsset).reduce(
      (sum, dur) => sum + dur,
      0
    );

    setTracks({
      video: splitTrackItems(splitTrackItems(videoTracks)),
      audio: splitTrackItems(splitTrackItems(audioTracks)),
      text: splitTrackItems(splitTrackItems(textTracks)),
    });
    console.log(videoTracks);
    setDuration(totalDuration);

    videoTracks.forEach((vi) => {
      vi.video_frames.forEach((frame) => {
        frame.start_time = vi.start_time;
      });
    });

    setFrames(videoTracks.flatMap((t) => t.video_frames || []));
  };
  useEffect(() => {
    loadProject();
  }, [projectId]);
  return { duration, frames, tracks, loadProject };
};
