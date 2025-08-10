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
    async getTracksWithOneItem(id: number) {
      const tracks = await TrackModel.findAll({
        where: { id },
        include: [
          {
            model: TrackItemModel,
            as: "items",
            separate: true,
            limit: 1,
            order: [["id", "ASC"]],
            include: [
              {
                model: AssetModel,
              },
            ],
          },
        ],
        order: [["id", "ASC"]],
      });

      return tracks;
    }
  };
}
