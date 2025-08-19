import React, {
  createContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { VideoContextType } from "@/types/editor";
import { trackTime } from "@/services/video-action";

export const VideoContext = createContext<VideoContextType | undefined>(
  undefined
);

const initialVideoState = {
  isPlaying: false,
  currentTime: 0,
};


export const VideoProvider = ({ children }: { children: React.ReactNode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(initialVideoState.isPlaying);
  const [currentTime, setCurrentTimeState] = useState(
    initialVideoState.currentTime
  );

  const play = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.play();
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.paused ? play() : pause();
  }, [play, pause]);

  const setCurrentTime = useCallback((time: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
    setCurrentTimeState(time);
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      return trackTime(videoRef, setCurrentTimeState);
    }
  }, [isPlaying]);

  return (
    <VideoContext.Provider
      value={{ videoRef, isPlaying, currentTime, togglePlay, setCurrentTime }}
    >
      {children}
    </VideoContext.Provider>
  );
};
