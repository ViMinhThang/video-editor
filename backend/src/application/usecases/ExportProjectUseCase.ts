import { track_repo, asset_repo } from "../../domain";
import { Asset } from "../../domain/models/asset_models";
import { TextConfig } from "../../domain/models/track_items_models";
import { ExportService } from "../services/ExportService";

export class ExportProjectUseCase {
  static async execute(projectId: number): Promise<string> {
    const trackItems = await track_repo.getTrackItemsByProjectId({ projectId });
    if (!trackItems || trackItems.length === 0) {
      throw new Error("TrackItemsNotFound");
    }

    const videoTracks = trackItems.filter(
      (t) => t.type === "video" && t.video_frames && t.video_frames.length > 0
    );

    const textTracks = trackItems.filter(
      (t) =>
        t.type === "text" &&
        t.config &&
        (t.config as TextConfig).text?.trim() !== ""
    );

    const assetIds = Array.from(new Set(videoTracks.map((t) => t.asset_id)));
    const assets: Asset[] = [];
    for (const id of assetIds) {
      const asset = await asset_repo.getAssetById(id!);
      if (asset) assets.push(asset);
    }

    const cutVideos = await ExportService.cutVideos(videoTracks, assets);
    if (cutVideos.length === 0) throw new Error("NoVideoToExport");

    const { concatFile, tempDir } = await ExportService.concatVideos(cutVideos);

    let finalOutput = concatFile;
    if (textTracks.length > 0) {
      finalOutput = await ExportService.overlaySubtitles(
        concatFile,
        textTracks,
        tempDir
      );
    }

    // cleanup các đoạn cut nhỏ
    await ExportService.cleanup(cutVideos);

    return finalOutput;
  }
}
