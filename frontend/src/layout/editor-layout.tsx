import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import EditorMenu from "@/components/editor-menu";
import AssetsPage from "@/pages/assets-page";
import SubtitlePage from "@/pages/subtitle-page";
import TextPage from "@/pages/text-page";
import { Asset, TrackItem, VideoFrame } from "@/types";
import { CassetteTape } from "lucide-react";
import { useEditor } from "@/hooks/use-editor";
import { EditorProvider } from "@/context/editor-context";
import { ScrollTimeline } from "@/components/scroll-time";

interface ItemProps {
  title: string;
  icon: React.ElementType;
  type: string;
}

export const EditorWrapper = () => (
  <EditorProvider>
    <EditorLayout />
  </EditorProvider>
);

const EditorLayout = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [scale, setScale] = useState(25);
  const [duration, setDuration] = useState(0);
  const [allFrames, setAllFrames] = useState<VideoFrame[]>([]);
  const [item, setItem] = useState<ItemProps>({
    title: "Phương tiện",
    icon: CassetteTape,
    type: "asset",
  });
  const { assets, handleUploadFile, handleFileChange, fileInputRef } =
    useEditor();
  const timelineRef = useRef<HTMLDivElement>(null);

  const [tracks, setTracks] = useState<Record<string, TrackItem[]>>({
    video: [],
    audio: [],
    text: [],
  });

  const handleLoadProjectState = (assets: Asset[]) => {
    const video_tracks: TrackItem[] = [];
    const audio_tracks: TrackItem[] = [];
    const text_tracks: TrackItem[] = [];

    assets.forEach((asset) => {
      if (!asset.track_items) return;

      asset.track_items.forEach((trackItem) => {
        trackItem.loading = false;
        if (asset.type === "video") {
          video_tracks.push(trackItem);
        } else if (asset.type === "audio") {
          audio_tracks.push(trackItem);
        } else if (asset.type === "text") {
          text_tracks.push(trackItem);
        }
      });
    });

    setTracks({
      video: video_tracks,
      audio: audio_tracks,
      text: text_tracks,
    });

    // Tính duration dựa trên video tracks
    const total_duration = video_tracks.reduce(
      (sum, video) => sum + (video.end_time || 0),
      0
    );
    setDuration(total_duration);
    console.log(total_duration);
    // Lấy tất cả frames từ video_tracks
    const frames = video_tracks.flatMap((item) => item.video_frames || []);
    setAllFrames(frames);
  };

  const loadFullProject = async () => {
    if (!projectId) return;
    try {
      const response = await axios.get(`/api/projects/${projectId}/full`);
      handleLoadProjectState(response.data.assets);
      if (timelineRef.current) timelineRef.current.scrollLeft = 0;
    } catch (error) {
      console.error("Load project failed", error);
    }
  };

  useEffect(() => {
    loadFullProject();
  }, [projectId]);

  const handleAddTrackItemToStart = async (asset: Asset) => {
    if (asset.type !== "video" || !projectId) return;

    try {
      await axios.post("/api/trackItems/", {
        asset_id: asset.id,
        url: asset.url,
        project_id: projectId,
        track_id: 1, // track video đầu tiên
      });
      // Reload toàn bộ project sau khi append
      await loadFullProject();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="border-r-0 h-full">
        <EditorMenu item={item} setItem={setItem} />
      </div>

      <div className="w-[285px]">
        {item.type === "asset" && (
          <AssetsPage
            assets={assets}
            handleUploadFile={handleUploadFile}
            handleFileChange={handleFileChange}
            fileInputRef={fileInputRef}
            handleAddToTrack={handleAddTrackItemToStart}
          />
        )}
        {item.type === "text" && <TextPage />}
        {item.type === "subtitle" && <SubtitlePage />}
      </div>

      <div className="flex flex-col w-full">
        <div className="bg-white p-3 flex gap-2">
          <Button className="bg-blue-500 rounded-sm">Export</Button>
          <Button onClick={() => setScale((s) => Math.min(s + 20, 200))}>
            Zoom +
          </Button>
          <Button onClick={() => setScale((s) => Math.max(s - 20, 20))}>
            Zoom -
          </Button>
        </div>

        <div className="bg-gray-300 flex-1/2">asdasd</div>

        <div
          ref={timelineRef}
          className="flex-1/5 p-2 bg-gray-100 overflow-x-auto whitespace-nowrap flex flex-col overflow-auto"
        >
          {/* <div className="flex justify-start items-center p-0 m-0">
            <TimelineRuler
              width={duration * scale}
              height={30}
              duration={duration}
              scale={scale}
            />
          </div>

          <div className="flex justify-start items-center">
            {allFrames.length > 0 ? (
              <TimelineCanvas
                frames={allFrames}
                width={duration * scale}
                height={144}
                thumbnailHeight={60}
                groupGap={10}
                scale={scale}
              />
            ) : (
              <div>Không có frame</div>
            )}
          </div>
        </div>
        <div
          className="scrollbar-container overflow-x-auto"
          style={{ width: "100%" }}
          onScroll={(e) => {
            const target = e.target as HTMLDivElement;
            if (timelineRef.current) {
              timelineRef.current.scrollLeft = target.scrollLeft;
            }
          }}
        >
          <div style={{ width: duration * scale, height: 1 }}></div> */}
          <ScrollTimeline
            frames={allFrames}
            duration={duration}
            scale={scale}
          />
        </div>
      </div>
    </div>
  );
};
