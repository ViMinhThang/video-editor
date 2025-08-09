import { track_repo } from "../data";
import { Track } from "../data/models/track_models";
import { WebService } from "./web_service";
import * as jsonpatch from "fast-json-patch";
export class TrackWebService implements WebService<Track> {
  getOne(id: any): Promise<Track | undefined> {
    return track_repo.getTrackById(id);
  }
  getMany(query: any): Promise<Track[]> {
    return track_repo.getTracks(query);
  }
  async store(data: any): Promise<Track | undefined> {
    return track_repo.storeTrack(data);
  }
  delete(id: any): Promise<boolean> {
    return track_repo.deleteTrack(Number.parseInt(id));
  }
  async replace(id: any, data: any): Promise<Track | undefined> {
    const { order } = data;
    const success = await track_repo.storeTrack(id, { order });
    if (success) {
      return track_repo.getTrackById(id);
    }
    return undefined;
  }
  async modify(id: any, data: any): Promise<Track | undefined> {
    const dbData = await this.getOne(id);
    if (dbData !== undefined) {
      return await this.replace(
        id,
        jsonpatch.applyPatch(dbData, data).newDocument
      );
    }
  }
  async getTracksPreview(project_id: number) {
    return track_repo.getTracksWithOneItem(project_id);
  }
}
