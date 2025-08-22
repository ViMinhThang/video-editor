import { takeDuration } from "@/lib/utils";
import { Asset } from "@/types";
import { TrackItem, VideoFrame } from "@/types/track_item";

export const processAssests = (assets: Asset[]) => {
  const videoTracks: TrackItem[] = [];
  const audioTracks: TrackItem[] = [];
  const textTracks: TrackItem[] = [];
  assets.forEach((asset) => {
    if (!asset.trackItems) return;
    asset.trackItems.forEach((ti) => {
      // avoid mutation
      const trackItem = { ...ti, loading: false };

      switch (trackItem.type) {
        case "video":
          videoTracks.push(trackItem);
          break;
        case "audio":
          audioTracks.push(trackItem);
          break;
        case "text":
          textTracks.push(trackItem);
          break;
        default:
          console.warn("Unknown track type:", trackItem.type);
      }
    });
  });

  return {
    tracks: {
      video: videoTracks,
      audio: audioTracks,
      text: textTracks,
    },
  };
};
