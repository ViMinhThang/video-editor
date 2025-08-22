
export const selectTrackItemContext = (
  trackItemIdRef: React.RefObject<number | null>,
  trackItemId: number
) => {
  trackItemIdRef.current = trackItemId;
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
