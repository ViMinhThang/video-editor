import { Model, Op } from "sequelize";
import { BaseRepo, Constructor } from "../core";
import { TrackItemModel, VideoFrameModel } from "../../database/models/track_items_models";
import { TrackItem } from "../../../domain/models/track_items_models";
import { Track } from "../../../domain/models/track_models";
import { TrackModel } from "../../database/models/track_models";

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
        where: { project_id: query.projectId },
        raw: true,
      });
      return result;
    }
    async getTrackItems(queries: any): Promise<TrackItem[]> {
      const result = await TrackItemModel.findAll({
        where: { project_id: queries.project_id },
        include: [
          {
            model: VideoFrameModel,
            as:"video_frames"
          },
        ],
      });
      return result;
    }
    async getTrackItemById(id: string): Promise<TrackItem | undefined> {
      const result = await TrackItemModel.findOne({
        where: { id: id },
      });
      return result ?? undefined;
    }
    async getTrackByTime(time: number): Promise<TrackItem | undefined> {
      try {
        const result = await TrackItemModel.findOne({
          where: {
            start_time: { [Op.lte]: time },
            end_time: { [Op.gt]: time },
            type: "video",
          },
        });
        return result ?? undefined;
      } catch (err) {
        console.error("[getTrackByTime] error:", err);
        throw err;
      }
    }
  };
}
