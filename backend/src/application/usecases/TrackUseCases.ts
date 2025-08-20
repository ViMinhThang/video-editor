
import * as jsonpatch from "fast-json-patch";
import { track_repo } from "../../domain";
import { Track } from "../../domain/models/track_models";

export class TrackUseCases {
  static async getOne(id: number): Promise<Track | undefined> {
    return track_repo.getTrackById(id);
  }

  static async getMany(query: any): Promise<Track[]> {
    return track_repo.getTracks(query);
  }

  static async store(data: any): Promise<Track | undefined> {
    return track_repo.storeTrack(data);
  }

  static async delete(id: number): Promise<boolean> {
    return track_repo.deleteTrack(id);
  }

  static async replace(id: number, data: any): Promise<Track | undefined> {
    const { order } = data;
    const success = await track_repo.storeTrack(id, { order });
    if (success) {
      return track_repo.getTrackById(id);
    }
    return undefined;
  }

  static async modify(id: number, data: any): Promise<Track | undefined> {
    const dbData = await this.getOne(id);
    if (dbData !== undefined) {
      const patched = jsonpatch.applyPatch(dbData, data).newDocument;
      return await this.replace(id, patched);
    }
  }
}
