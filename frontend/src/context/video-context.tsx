import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";

interface VideoContextType {
  videoRef: React.RefObject<HTMLVideoElement>;
  isPlaying: boolean;
  currentTime: number;
  togglePlay: () => void;
  setCurrentTime: (time: number) => void;
}

export const VideoContext = createContext<VideoContextType | undefined>(undefined);
export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTimeState] = useState(0);

  // Play / Pause video
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  // Update currentTime while playing
  useEffect(() => {
    if (!videoRef.current) return;
    let animationFrameId: number;

    const updateTime = () => {
      if (videoRef.current) {
        setCurrentTimeState(videoRef.current.currentTime);
        animationFrameId = requestAnimationFrame(updateTime);
      }
    };

    if (isPlaying) animationFrameId = requestAnimationFrame(updateTime);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying]);

  // Seek video
  const setCurrentTime = useCallback((time: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
    setCurrentTimeState(time);
  }, []);

  return (
    <VideoContext.Provider
      value={{ videoRef, isPlaying, currentTime, togglePlay, setCurrentTime }}
    >
      {children}
    </VideoContext.Provider>
  );
};

// Hook tiện lợi để lấy context
