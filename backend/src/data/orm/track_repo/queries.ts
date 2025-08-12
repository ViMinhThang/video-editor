import { TrackItem } from "../../models/track_items_models";
import { Track } from "../../models/track_models";
import { BaseRepo, Constructor } from "../core";
import { TrackItemModel, TrackModel } from "../models";
import { AssetModel } from "../models/track_items_models";

export function AddQueriesTrack<Tbase extends Constructor<BaseRepo>>(
  Base: Tbase
) {
  return class extends Base {
    async getTrackById(id: any): Promise<Track | undefined> {
      const result = await TrackModel.findOne({ where: { id: id } });
      return result ?? undefined;
    }
    async getTracks(query: any): Promise<Track[]> {
      const result = await TrackModel.findAll({
        where: { id: query.id },
        include: [{ model: TrackItemModel, as: "items" }],
        nest: true,
      });
      return result;
    }
    async getTrackItemsByProjectId(query: any): Promise<TrackItem[]> {
      const result = await TrackItemModel.findAll({
        where: { project_id: query.projectId },raw:true
      });
      return result;
    }
    async getTrackItems(queries: any): Promise<TrackItem[]> {
      const result = await TrackItemModel.findAll({
        where: { id: queries.id },
      });
      return result;
    }
    async getTrackItemById(id: string): Promise<TrackItem | undefined> {
      const result = await TrackItemModel.findOne({
        where: { id: id },
      });
      return result ?? undefined;
    }
  };
}
