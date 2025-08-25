import { useResizableCanvas } from "@/hooks/use-canvas-hooks";
import { useEditorContext } from "@/hooks/use-editor";
import { useTimelineContext } from "@/hooks/use-timeline";
import { useTimelineDragDrop } from "@/hooks/use-timeline-drag";
import { findTrackAtX, getClickX } from "@/lib/canvas-utils";
import { drawTimeline } from "@/lib/timeline-draw";
import { TimelineCanvasProps } from "@/types/timeline";
import { useCallback } from "react";

export const TimeCanvasVideo = ({
  thumbnailWidth = 60,
  thumbnailHeight = 60,
  groupGap = 10,
}: TimelineCanvasProps) => {
  const { handleContextMenu, highlightRef, handleOnClick } =
    useTimelineContext();
  const { tracks, dispatchTracks, setAsset, assets, updateProjectState } =
    useEditorContext();

  const videos = tracks.video;

  const canvasRef = useResizableCanvas(
    () => renderCanvas(),
    thumbnailHeight,
    videos
  );

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    console.log(
      "Rendering canvas with videos:",
      videos,
      "width",
      thumbnailWidth
    ); // Debug
    drawTimeline({
      canvas,
      videos,
      thumbnailWidth,
      thumbnailHeight,
      groupGap,
      highlightTrackItemId:
        highlightRef.current.type === "video" ? highlightRef.current.id : null,
    });
  }, [videos, thumbnailWidth, thumbnailHeight, groupGap, highlightRef]);

  const {
    isDragging,
    mouseDown,
    dragOverlay,
    onMouseDown,
    onMouseMove,
    onMouseUp,
  } = useTimelineDragDrop({
    videos,
    thumbnailWidth,
    thumbnailHeight,
    groupGap,
    canvasRef,
    dispatchTracks,
    trackType: "video",
  });

  const handleCanvasMouseMove = (e: React.MouseEvent) =>
    onMouseMove(e);

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging || mouseDown) return;
    const clickX = getClickX(canvasRef.current, e);
    const foundTrack = findTrackAtX(videos, clickX, groupGap, thumbnailWidth);
    if (foundTrack) {
      const trackItem = tracks.video.find((t) => t.id === foundTrack);
      const foundAsset = assets.find((a) => a.id === trackItem?.assetId);
      if (foundAsset) {
        console.log("asdasdadasd");

        setAsset(foundAsset);
        handleOnClick(e, foundTrack, "video", renderCanvas);
      }
    }
  };
  const onContextMenu = (e: React.MouseEvent) => {
    if (isDragging) return;
    const clickX = getClickX(canvasRef.current, e); // gọn hơn
    const foundTrackId = findTrackAtX(videos, clickX, groupGap, thumbnailWidth);
    if (foundTrackId) {
      handleContextMenu(e, foundTrackId, "video", renderCanvas);
    }
  };
  return (
    <div style={{ position: "relative" }}>
      <canvas
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={onMouseUp}
        onContextMenu={onContextMenu}
        onClick={handleClick}
        style={{ width: "100%", height: thumbnailHeight + 20 }}
      />

      {dragOverlay && (
        <div
          style={{
            position: "absolute",
            left: dragOverlay.x,
            top: dragOverlay.y,
            width: dragOverlay.width,
            height: dragOverlay.height,
            backgroundColor: "rgba(0,150,255,0.7)",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};
