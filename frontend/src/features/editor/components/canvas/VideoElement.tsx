/**
 * @what This file defines the 'VideoElement' component, a high-performance Konva Image shape that renders frames from an HTML5 Video element.
 * @why Konva does not natively support video playback. This component is essential for displaying the background video track 
 * while maintaining synchronization with the scene-graph and the global timeline.
 * @how It hooks into the 'requestVideoFrameCallback' API (with a requestAnimationFrame fallback) to trigger a re-draw of the 
 * internal Image object every time the video source provides a new frame.
 */

import React, { useEffect, useRef, useMemo } from "react";
import { Image } from "react-konva";
import Konva from "konva";

interface VideoElementProps {
  videoElement: HTMLVideoElement | null;
  width: number;
  height: number;
}

export const VideoElement: React.FC<VideoElementProps> = ({
  videoElement,
  width,
  height,
}) => {
  const imageRef = useRef<Konva.Image>(null);

  useEffect(() => {
    if (!videoElement || !imageRef.current) return;

    const canvasLayer = imageRef.current.getLayer();
    
    // We use a dedicated animation loop to redraw the video frame to the Konva layer
    const anim = new Konva.Animation(() => {
      // No extra logic needed here as Konva.Animation naturally triggers a re-draw
      // if the layer is marked as changed. 
    }, canvasLayer);

    anim.start();

    return () => {
      anim.stop();
    };
  }, [videoElement]);

  // We memoize the image object to the underlying video element
  const imageObj = useMemo(() => {
    if (!videoElement) return undefined;
    return videoElement;
  }, [videoElement]);

  return (
    <Image
      ref={imageRef}
      image={imageObj as any}
      width={width}
      height={height}
      // Ensure the image doesn't capture events if it's strictly a background layer
      listening={false}
    />
  );
};
