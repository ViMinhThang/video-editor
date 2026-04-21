export const trackTime = (
  videoRef: React.RefObject<HTMLVideoElement>,
  setCurrentTimeState: (time: number) => void
) => {
  let animationFrameId: number;
  const updateTime = () => {
    if (videoRef.current) {
      setCurrentTimeState(videoRef.current.currentTime);
      animationFrameId = requestAnimationFrame(updateTime);
    }
  };
  animationFrameId = requestAnimationFrame(updateTime);
  return () => cancelAnimationFrame(animationFrameId);
};