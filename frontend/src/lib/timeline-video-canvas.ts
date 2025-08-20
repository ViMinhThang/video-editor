import { DrawTextItemParams, HandleKeyDownParams, MouseDownParams, MouseMoveParams } from "@/types/mouse";
import axios from "axios";

export function handleCanvasMouseDown({
  x,
  y,
  canvas,
  texts,
  setDraggingId,
  setRotatingId,
  setSelectedId,
  setOffset,
  setEditingId,
  setEditingText,
}: MouseDownParams) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let found: number | null = null;

  for (let t of texts) {
    const tx = t.x ?? canvas.width / 2;
    const ty = t.y ?? canvas.height - 20;

    ctx.save();
    ctx.translate(tx, ty);
    ctx.rotate((t.rotation ?? 0) * (Math.PI / 180));

    ctx.font = `${t.fontSize || 24}px sans-serif`;
    const metrics = ctx.measureText(t.textContent);
    const textWidth = metrics.width;
    const textHeight =
      (metrics.actualBoundingBoxAscent || t.fontSize || 24) +
      (metrics.actualBoundingBoxDescent || 0);

    const invX =
      (x - tx) * Math.cos(-(t.rotation ?? 0) * (Math.PI / 180)) -
      (y - ty) * Math.sin(-(t.rotation ?? 0) * (Math.PI / 180));
    const invY =
      (x - tx) * Math.sin(-(t.rotation ?? 0) * (Math.PI / 180)) +
      (y - ty) * Math.cos(-(t.rotation ?? 0) * (Math.PI / 180));

    // check rotate handle
    const handleX = 0;
    const handleY = -textHeight / 2 - 30;
    const dist = Math.sqrt((invX - handleX) ** 2 + (invY - handleY) ** 2);
    if (dist < 10) {
      found = t.id;
      setRotatingId(t.id);
      ctx.restore();
      return;
    }

    // check text box
    const left = -textWidth / 2 - 4;
    const right = textWidth / 2 + 4;
    const top = -textHeight / 2;
    const bottom = textHeight / 2;
    if (invX >= left && invX <= right && invY >= top && invY <= bottom) {
      found = t.id;
      setDraggingId(t.id);
      setOffset({ x: invX, y: invY });
      setEditingId(t.id);
      setEditingText(t.textContent);
      ctx.restore();
      break;
    }

    ctx.restore();
  }

  setSelectedId(found);
}

export function handleCanvasMouseMove({
  x,
  y,
  draggingId,
  rotatingId,
  texts,
  setTracks,
}: MouseMoveParams) {
  if (draggingId) {
    setTracks((prev) => ({
      ...prev,
      text: prev.text.map((t) => (t.id === draggingId ? { ...t, x, y } : t)),
    }));
  }

  if (rotatingId) {
    const t = texts.find((tt) => tt.id === rotatingId);
    if (!t) return;
    const angle = (Math.atan2(y - t.y!, x - t.x!) * 180) / Math.PI + 90;
    setTracks((prev) => ({
      ...prev,
      text: prev.text.map((tt) =>
        tt.id === rotatingId ? { ...tt, rotation: angle } : tt
      ),
    }));
  }
}

export function handleTextEditingKeyDown({
  e,
  editingId,
  editingText,
  texts,
  setEditingText,
  setEditingId,
  setTracks,
}: HandleKeyDownParams) {
  if (!editingId) return;

  if (e.key === "Backspace") {
    setEditingText((prev) => prev.slice(0, -1));
  } else if (e.key === "Enter") {
    const t = texts.find((tt) => tt.id === editingId);
    if (!t) return;

    setTracks((prev) => ({
      ...prev,
      text: prev.text.map((tt) =>
        tt.id === editingId ? { ...tt, text_content: editingText } : tt
      ),
    }));

    axios
      .put(`/api/track-item/${t.id}`, { ...t, text_content: editingText })
      .catch(console.error);

    setEditingId(null);
  } else if (e.key === "Escape") {
    setEditingId(null);
  } else if (e.key.length === 1) {
    setEditingText((prev) => prev + e.key);
  }
}

export function drawTextItem({
  ctx,
  t,
  canvas,
  selectedId,
  editingId,
  editingText,
}: DrawTextItemParams) {
  ctx.save();
  ctx.translate(t.x ?? canvas.width / 2, t.y ?? canvas.height - 20);
  ctx.rotate((t.rotation ?? 0) * (Math.PI / 180));

  ctx.fillStyle = t.color || "white";
  ctx.font = `${t.fontSize || 24}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // nếu đang edit
  if (t.id === editingId) {
    const cursor = Math.floor(Date.now() / 500) % 2 === 0 ? "|" : "";
    ctx.fillText(editingText + cursor, 0, 0);
  } else {
    ctx.fillText(t.textContent, 0, 0);
  }

  // highlight nếu chọn
  if (t.id === selectedId) {
    const metrics = ctx.measureText(t.textContent);
    const textWidth = metrics.width;
    const textHeight =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent || t.fontSize || 24;

    const paddingX = 8;
    const paddingY = 6;

    ctx.strokeStyle = "lightblue";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      -textWidth / 2 - paddingX,
      -textHeight / 2 - paddingY,
      textWidth + paddingX * 2,
      textHeight + paddingY * 2
    );

    // chấm xoay
    const handleY = -textHeight / 2 - 30;
    ctx.beginPath();
    ctx.moveTo(0, -textHeight / 2);
    ctx.lineTo(0, handleY);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, handleY, 6, 0, Math.PI * 2);
    ctx.fillStyle = "lightblue";
    ctx.fill();
  }

  ctx.restore();
}