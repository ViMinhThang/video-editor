export const selectTrackItemContext = (
  trackItemIdRef: React.RefObject<number | null>,
  animLineWidthRef: React.RefObject<number>,
  animationFrameRef: React.RefObject<number | null>,
  trackItemId: number
) => {
  trackItemIdRef.current = trackItemId;
  animLineWidthRef.current = 0;

  const animate = () => {
    animLineWidthRef.current = Math.min(animLineWidthRef.current + 0.5, 6);
    if (animLineWidthRef.current < 6) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  };

  animate();
};

export const download = (
  data: BlobPart,
  filename = "file",
  mimeType = "application/octet-stream"
) => {
  const blob = new Blob([data], { type: mimeType });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
};
