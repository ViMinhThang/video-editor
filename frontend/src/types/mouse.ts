import { TrackItem } from ".";

export interface MouseMoveParams {
  x: number;
  y: number;
  draggingId: number | null;
  rotatingId: number | null;
  texts: TrackItem[];
  setTracks: (
    updater: (prev: Record<string, TrackItem[]>) => Record<string, TrackItem[]>
  ) => void;
}
export interface MouseDownParams {
  x: number;
  y: number;
  canvas: HTMLCanvasElement;
  texts: TrackItem[];
  setDraggingId: (id: number | null) => void;
  setRotatingId: (id: number | null) => void;
  setSelectedId: (id: number | null) => void;
  setOffset: (offset: { x: number; y: number } | null) => void;
  setEditingId: (id: number | null) => void;
  setEditingText: (text: string) => void;
}
export interface HandleKeyDownParams {
  e: KeyboardEvent;
  editingId: number | null;
  editingText: string;
  texts: TrackItem[];
  setEditingText: (updater: (prev: string) => string) => void;
  setEditingId: (id: number | null) => void;
  setTracks: (
    updater: (prev: Record<string, TrackItem[]>) => Record<string, TrackItem[]>
  ) => void;
}
export interface DrawTextItemParams {
  ctx: CanvasRenderingContext2D;
  t: TrackItem;
  canvas: HTMLCanvasElement;
  selectedId: number | null;
  editingId: number | null;
  editingText: string;
}