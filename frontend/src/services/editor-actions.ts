import { takeDuration } from "@/lib/utils";
import { Asset, TrackItem, VideoFrame } from "@/types";
export enum TrackType {
  VIDEO = 1,
  TEXT = 2,
  AUDIO = 3,
}

export const processAssests = (assets: Asset[]) => {
  const videoTracks: TrackItem[] = [];
  const audioTracks: TrackItem[] = [];
  const textTracks: TrackItem[] = [];
  assets.forEach((asset) => {
    if (!asset.track_items) return;
    asset.track_items.forEach((ti) => {
        // avoid mutation
      const trackItem = { ...ti, loading: false };

      switch (trackItem.track_id) {
        case TrackType.VIDEO:
          videoTracks.push(trackItem);
          break;
        case TrackType.AUDIO:
          audioTracks.push(trackItem);
          break;
        case TrackType.TEXT:
          textTracks.push(trackItem);
          break;
        default:
          console.warn("Unknown track type:", trackItem.track_id);
      }
    });
  });
  const allTracks = [...videoTracks, ...audioTracks];
  const totalDuration = takeDuration(allTracks);
  const frames: VideoFrame[] = videoTracks.flatMap((t) => t.video_frames || []);
  return {
    tracks: {
      video: videoTracks,
      audio: audioTracks,
      text: textTracks,
    },
    totalDuration: totalDuration,
    frames: frames,
  };
};
