import { Op } from "sequelize";
import { TrackItem } from "../../domain/interfaces/track_items_models";
import { Track } from "../../domain/interfaces/track_models";
import { TrackItemModel, TrackModel } from "../database/models";
import { TrackRepository } from "../../domain/repositories/track_repository";
import { db } from "../database/core";

export class TrackRepoImpl implements TrackRepository {
  async getTrackById(id: any): Promise<Track | undefined> {
    const result = await TrackModel.findOne({ where: { id: id } });
    return result ?? undefined;
  }

  async getTracks(query: any): Promise<Track[]> {
    const where: any = {};
    if (query?.id) where.id = query.id;
    
    return await TrackModel.findAll({
      where,
      include: [{ model: TrackItemModel, as: "items" }],
      nest: true,
    });
  }

  async getTrackItemsByProjectId(query: any): Promise<TrackItem[]> {
    return await TrackItemModel.findAll({
      where: { project_id: query.projectId },
      raw: true,
    });
  }

  async getTrackItems(queries: any): Promise<TrackItem[]> {
    return await TrackItemModel.findAll({
      where: { id: queries.id },
    });
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
          track_id: 1,
        },
      });
      return result ?? undefined;
    } catch (err) {
      console.error("[getTrackByTime] error:", err);
      throw err;
    }
  }

  async storeTrackItem(ti: any): Promise<TrackItem> {
    return await db.sequelize.transaction(async (transaction) => {
      const [_track_item] = await TrackItemModel.upsert(
        {
          id: ti.id,
          track_id: ti.track_id,
          project_id: ti.project_id,
          start_time: ti?.start_time,
          asset_id: ti?.asset_id,
          end_time: ti?.end_time,
          x: ti?.x,
          y: ti?.y,
          scale: ti?.scale,
          rotation: ti?.rotation,
          text_content: ti?.text_content,
        },
        { transaction }
      );
      return _track_item.get({ plain: true });
    });
  }

  async storeTrack(paramsOrId: any, data?: { order: any }): Promise<any> {
    return await db.sequelize.transaction(async (transaction) => {
        if (typeof paramsOrId === 'object' && !data) {
            // Case: storeTrack(params: { project_id: number; type: string })
            const [stored] = await TrackModel.upsert(
                {
                  type: paramsOrId.type,
                  order: 1, // Defaulting as in original
                },
                { transaction }
              );
              return stored.get({ plain: true });
        } else {
            // Case: storeTrack(id: any, arg1: { order: any })
            const [count] = await TrackModel.update({ order: data?.order }, {
                where: { id: paramsOrId },
                transaction
            });
            return count > 0;
        }
    });
  }

  async deleteTrack(id: number): Promise<boolean> {
    const count = await TrackModel.destroy({
      where: { id },
    });
    return count > 0;
  }

  async deleteTrackItem(id: number): Promise<boolean> {
    const count = await TrackItemModel.destroy({
      where: { id },
    });
    return count > 0;
  }
}
