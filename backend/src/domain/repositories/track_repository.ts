import { TrackItem } from "../models/track_items_models";
import { Track } from "../models/track_models";

export interface trackRepository {
  getTrackItems(query: any): Promise<TrackItem[]>;
  getTrackItemsByProjectId(query: any): Promise<TrackItem[]>;
  getTrackItemById(id: any): Promise<TrackItem | undefined>;
  storeTrackItem(data: any): Promise<TrackItem>;
  deleteTrackItem(id: number): Promise<boolean>;
  deleteTrack(arg0: number): Promise<boolean>;
  getTrackById(id: any): Promise<Track | undefined>;
  storeTrack(id: any, arg1: { order: any }): unknown;
  getTracks(params: any): Promise<Track[]>;
  storeTrack(params: { project_id: number; type: string }): Promise<Track>;
  getTrackByTime(time: number): Promise<TrackItem | undefined>;
}
