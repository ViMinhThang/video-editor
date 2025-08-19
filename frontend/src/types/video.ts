export interface VideoCanvasProps {
  src: string;
  width?: number;
  height?: number;
}
export interface VideoContextType {
  videoRef: React.RefObject<HTMLVideoElement>;
  isPlaying: boolean;
  currentTime: number;
  togglePlay: () => void;
  setCurrentTime: (time: number) => void;
}
