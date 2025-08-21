import { track_repo } from "../../domain";
import { TrackItem } from "../../domain/models/track_items_models";
import { getDefaultTextConfig } from "../../lib/util";

export class AddTextItemUseCase {
  static async add(time: number, project_id: string, asset_id: number) {
    const trackItem: TrackItem = {
      asset_id: asset_id,
      project_id: Number.parseInt(project_id),
      type: "text",
      start_time: time,
      end_time: time + 30,
      config: getDefaultTextConfig("mặc định"),
    };
    const created = await track_repo.storeTrackItem(trackItem);
    return created;
  }
}
