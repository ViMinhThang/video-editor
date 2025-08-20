// src/application/services/UploadService.ts
import path from "path";
import fs from "fs/promises";
import { buildAsset, getProjectAssetDir, parseSrt } from "../../lib/util";
import FF from "../../lib/FF";
import { asset_repo, track_repo } from "../../domain";
import { TrackItem } from "../../domain/models/track_items_models";
import { ProjectStateMapper } from "../dto/ProjectStateDTO";

export class UploadService {
  static async handleUploadVideo(file: Express.Multer.File, project_id: string) {
    const videoBaseName = path.parse(file.originalname).name;
    const assetDir = getProjectAssetDir(project_id, videoBaseName);
    await fs.mkdir(assetDir, { recursive: true });

    const destPath = path.join(assetDir, file.filename);
    await fs.rename(file.path, destPath);

    const thumbPathDisk = path.join(assetDir, `thumb-${file.filename}.jpg`);
    const thumbUrl = `/uploads/projects/${project_id}/assets/${videoBaseName}/thumb-${file.filename}.jpg`;
    await fs.mkdir(path.dirname(thumbPathDisk), { recursive: true });

    let width: number | undefined;
    let height: number | undefined;

    try {
      await FF.makeThumbnail(destPath, thumbPathDisk);
      const dimensions = await FF.getDimension(destPath);
      width = dimensions.width;
      height = dimensions.height;
    } catch (err) {
      console.error("FFmpeg metadata failed:", err);
    }

    const asset = buildAsset(file, project_id, "video", thumbUrl, destPath, videoBaseName);
    const created = await asset_repo.storeAsset(asset)
    if(!created){
      throw new Error("Error storing asset")
    }
    return ProjectStateMapper.toAssetDTO(created,[])
  }

  static async handleUploadImage(file: Express.Multer.File, project_id: string) {
    const imageBaseName = path.parse(file.originalname).name;
    const assetDir = getProjectAssetDir(project_id, imageBaseName);
    await fs.mkdir(assetDir, { recursive: true });

    const destPath = path.join(assetDir, file.filename);
    await fs.rename(file.path, destPath);

    const thumbUrl = `/uploads/projects/${project_id}/assets/${imageBaseName}/${file.filename}`;
    const asset = buildAsset(file, project_id, "image", thumbUrl, destPath, imageBaseName);
    return asset_repo.storeAsset(asset);
  }

  static async handleUploadSrt(file: Express.Multer.File, project_id: string, asset_id: number) {
    const content = await fs.readFile(file.path, "utf-8");
    const srtItems = parseSrt(content);
    const created: TrackItem[] = [];

    for (const item of srtItems) {
      const trackItem: TrackItem = {
        asset_id: asset_id,
        project_id: Number.parseInt(project_id),
        track_id: 2,
        start_time: item.start,
        end_time: item.end,
        text_content: item.text,
      };
      created.push(await track_repo.storeTrackItem(trackItem));
    }

    await fs.unlink(file.path);
    return created;
  }
}
