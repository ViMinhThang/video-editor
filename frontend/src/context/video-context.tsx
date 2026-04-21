/**
 * @what Context provider for managing the core video playback engine.
 * @why Synchronizes the state between the hidden HTML5 video element (source) and multiple visual consumers (Konva preview, Timeline playhead).
 * @how Exposes refs and playback controls (toggle, seek) using React 'useCallback' and 'useEffect' for consistent performance.
 */

import React, { createContext, useRef, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import type { VideoContextType } from "@/types/editor";
import { trackTime } from "../features/editor/services/VideoActions";

export const VideoContext = createContext<VideoContextType | undefined>(undefined);

const initialVideoState = {
  isPlaying: false,
  currentTime: 0,
};

export const VideoProvider = ({ children }: { children: ReactNode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(initialVideoState.isPlaying);
  const [currentTime, setCurrentTimeState] = useState(initialVideoState.currentTime);

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
      value={{ 
        videoRef: videoRef as React.RefObject<HTMLVideoElement>, 
        isPlaying, 
        currentTime, 
        togglePlay, 
        setCurrentTime 
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};
