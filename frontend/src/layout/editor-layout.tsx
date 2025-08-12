import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import EditorMenu from "@/components/editor-menu";
import AssetsPage from "@/pages/assets-page";
import SubtitlePage from "@/pages/subtitle-page";
import TextPage from "@/pages/text-page";
import {
  Asset,
  AssetWithFrames,
  FullProjectState,
  Project,
  TrackItem,
  VideoFrame,
} from "@/types";
import { CassetteTape, LoaderCircle } from "lucide-react";
import { useEditor } from "@/hooks/use-editor";
import { EditorProvider } from "@/context/editor-context";
import TimelineCanvas from "@/components/time-canvas";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
interface ItemProps {
  title: string;
  icon: React.ElementType; // LucideIcon type or React.FC<SVGProps>
  type: string;
}

export const EditorWrapper: React.FC = () => (
  <EditorProvider>
    <EditorLayout />
  </EditorProvider>
);

const EditorLayout: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [state, setState] = useState<FullProjectState | null>(null);
  const [item, setItem] = useState<ItemProps>({
    title: "Phương tiện",
    icon: CassetteTape,
    type: "asset",
  });
  const timelineRef = useRef<HTMLDivElement>(null);

  // Initialize tracks with proper types
  const [tracks, setTracks] = useState<Record<string, AssetWithFrames[]>>({
    video: [],
    audio: [],
    text: [],
  });

  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.scrollLeft = 0;
    }
  }, [tracks.video]);

  const handleAddToTrack = async (asset: Asset) => {
    const type = asset.type;
    if (type === "video") {
      setTracks((prev) => ({
        ...prev,
        [type]: [{ ...asset, frames: [], loading: true }, ...prev[type]],
      }));
      try {
        const response = await axios.post("/api/trackItems/", {
          asset_id: asset.id,
          url: asset.url,
          project_id: projectId,
          track_id: 1,
        });
        setTracks((prev) => ({
          ...prev,
          [type]: prev[type].map((v) =>
            v.id === asset.id || v.id === asset.id
              ? { ...v, frames: response.data.frames, loading: false }
              : v
          ),
        }));
      } catch (error) {
        console.error(error);
        setTracks((prev) => ({
          ...prev,
          [type]: prev[type].filter((t) => t.id !== asset.id),
        }));
      }
    }
  };

  const handleLoadProjectState = (data: {
    project: Project;
    assets: Asset[];
    track_items: (TrackItem & { video_frames: VideoFrame[] })[];
  }) => {
    const framesMap = new Map<number, VideoFrame[]>();
    data.track_items.forEach((trackItem) => {
      if (trackItem.video_frames) {
        framesMap.set(trackItem.asset_id, trackItem.video_frames);
      }
    });

    const groupedTracks: Record<string, AssetWithFrames[]> = {
      video: [],
      audio: [],
      text: [],
    };

    data.assets.forEach((asset) => {
      const frames = framesMap.get(asset.id) || [];
      if (!groupedTracks[asset.type]) {
        groupedTracks[asset.type] = [];
      }
      groupedTracks[asset.type].push({
        ...asset,
        frames,
      });
    });

    setTracks(groupedTracks);
    setState(data); // giữ toàn bộ project state nếu cần
  };

  const loadFullProject = async () => {
    if (!projectId) return;
    try {
      const response = await axios.get(`/api/projects/${projectId}/full`);
      handleLoadProjectState(response.data);
    } catch (error) {
      console.error("Load project failed", error);
    }
  };

  useEffect(() => {
    loadFullProject();
  }, [projectId]);

  const { assets, handleUploadFile, handleFileChange, project, fileInputRef } =
    useEditor();

  return (
    <div className="flex h-screen">
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
            handleAddToTrack={handleAddToTrack}
          />
        )}
        {item.type === "text" && <TextPage />}
        {item.type === "subtitle" && <SubtitlePage />}
      </div>
      <div className="flex flex-col w-full">
        <div className="bg-white p-3">
          <Button className="bg-blue-500 rounded-sm">Export</Button>
        </div>
        <div className="bg-gray-300 flex-1/2">asdasd</div>
        <div
          ref={timelineRef}
          className="flex-1/5 p-2 bg-gray-100 overflow-x-auto whitespace-nowrap"
        >
          {tracks.video.map((item) => (
            <div key={item.id} className="inline-flex mr-2 items-start">
              {"loading" in item && item.loading ? (
                <div className="flex mr-1 border rounded overflow-hidden">
                  <div className="relative w-64 h-12 bg-gray-900">
                    <div className="absolute inset-0 flex items-center justify-center text-white text-[10px]">
                      <LoaderCircle className="animate-spin mr-1" size={12} />
                      Loading
                    </div>
                  </div>
                </div>
              ) : item.frames.length > 0 && item.frames[0] instanceof Object ? (
                <TimelineCanvas
                    frames={item.frames}
                    width={1920} // chiều rộng canvas, chỉnh tùy ý
                    height={60} // chiều cao canvas
                    thumbnailWidth={80}
                    thumbnailHeight={48} groupGap={10}      />
              ) : (
                <div>Không có frame</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
