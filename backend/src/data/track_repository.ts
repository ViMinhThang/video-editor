import { Track } from "./models/track_models";

export interface trackRepository {
  deleteTrack(arg0: number): Promise<boolean>;
  getTrackById(id: any): Promise<Track | undefined>;
  storeTrack(id: any, arg1: { order: any }): unknown;
  getTracks(params: any): Promise<Track[]>;
  storeTrack(params: { project_id: number; type: string }): Promise<Track>;
  getTracksWithOneItem(id: number): Promise<Track[]>;
}
