import { TrackItem } from "../interfaces/track_items_models";
import { Track } from "../interfaces/track_models";

export interface TrackItemQuery {
  id?: number | string;
  projectId?: number;
  [key: string]: any;
}

export interface TrackQuery {
  id?: number | string;
  [key: string]: any;
}

export interface TrackRepository {
  getTrackItems(query: TrackItemQuery): Promise<TrackItem[]>;
  getTrackItemsByProjectId(query: TrackItemQuery): Promise<TrackItem[]>;
  getTrackItemById(id: number | string): Promise<TrackItem | undefined>;
  storeTrackItem(data: Partial<TrackItem>): Promise<TrackItem>;
  deleteTrackItem(id: number): Promise<boolean>;
  deleteTrack(id: number): Promise<boolean>;
  getTrackById(id: number | string): Promise<Track | undefined>;
  getTracks(params: TrackQuery): Promise<Track[]>;
  storeTrack(params: Partial<Track>): Promise<Track>;
  updateTrackOrder(id: number | string, data: { order: number }): Promise<boolean>;
  getTrackByTime(time: number): Promise<TrackItem | undefined>;
}
