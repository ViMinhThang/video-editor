import { track_repo } from "../../domain";
import { TrackItem } from "../../domain/models/track_items_models";

export class UpdateTrackItemUseCase {
  static async execute(track: TrackItem) {
    if (!track.id) {
      throw new Error("Track item id is required");
    }

    const updatedTrack = await track_repo.storeTrackItem(track);
    if (!updatedTrack) {
      throw new Error("Failed to update track item");
    }

    return updatedTrack;
  }
}
