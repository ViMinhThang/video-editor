import { BaseRepo, Constructor } from "../core";
import { TrackModel } from "../models";

export function AddQueriesTrack<Tbase extends Constructor<BaseRepo>>(
  Base: Tbase
) {
  return class extends Base {
    async findOrCreate({
      project_id,
      type,
    }: {
      project_id: number;
      type: string;
    }): Promise<TrackModel> {
      const [track, created] = await TrackModel.findOrCreate({
        where: {
          project_id,
          type,
        },
        defaults: {
          project_id,
          type,
          order: 0,
        },
      });

      return track;
    }
  };
}
