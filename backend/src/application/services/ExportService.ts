// src/application/services/ExportService.ts
import path from "path";
import os from "os";
import fs from "fs/promises";
import FF from "../../lib/FF";
import {  TrackItem } from "../../domain/models/track_items_models";
import { Asset } from "../../domain/models/asset_models";

export class ExportService {
  static async cutVideos(videoTracks: TrackItem[], assets: Asset[]): Promise<string[]> {
    const cutVideos: string[] = [];
    for (const vt of videoTracks) {
      const asset = assets.find((a) => a.id === vt.asset_id);
      if (!asset) continue;

      const outputPath = await FF.cutVideoAccurate(
        asset.server_path,
        vt.start_time!,
        vt.end_time!
      );
      cutVideos.push(outputPath);
    }
    return cutVideos;
  }

  static async concatVideos(cutVideos: string[]): Promise<{ concatFile: string, tempDir: string }> {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "export-"));
    const concatFile = path.join(tempDir, "concat.mp4");
    await FF.concatVideos(cutVideos, concatFile);
    return { concatFile, tempDir };
  }

  static async overlaySubtitles(inputFile: string, textTracks: TrackItem[], tempDir: string): Promise<string> {
    const withSub = path.join(tempDir, "with_subs.mp4");
    await FF.overlaySubtitles(inputFile, textTracks, withSub);
    return withSub;
  }

  static async cleanup(files: string[], dir?: string) {
    for (const f of files) {
      try {
        await fs.unlink(f);
      } catch {}
    }
    if (dir) {
      try {
        await fs.rmdir(dir);
      } catch {}
    }
  }
}
