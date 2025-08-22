// types/tracks.ts
import { TrackItem } from "@/types/track_item";

export interface TracksState {
  video: TrackItem[];
  audio: TrackItem[];
  text: TrackItem[];
}

export type TracksAction =
  | { type: "SET_TRACKS"; payload: TracksState }
  | { type: "ADD_TRACK"; trackType: keyof TracksState; payload: TrackItem }
  | { type: "RESIZE_TRACK"; trackType: keyof TracksState; id: number; startTime: number; endTime: number };

export function tracksReducer(state: TracksState, action: TracksAction): TracksState {
  switch (action.type) {
    case "SET_TRACKS":
      return { ...action.payload };

    case "ADD_TRACK":
      return {
        ...state,
        [action.trackType]: [...state[action.trackType], action.payload],
      };

    case "RESIZE_TRACK":
      return {
        ...state,
        [action.trackType]: state[action.trackType].map((t) =>
          t.id === action.id ? { ...t, startTime: action.startTime, endTime: action.endTime } : t
        ),
      };

    default:
      return state;
  }
}
