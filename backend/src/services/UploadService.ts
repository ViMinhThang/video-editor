import path from "path";
import fs from "fs/promises";
import { buildAsset, getProjectAssetDir, parseSrt } from "../utils/util";
import FF from "../infrastructure/services/FFmpegService";
import { asset_repo, track_repo } from "../infrastructure/repositories";
import { TrackItem } from "../domain/interfaces/track_items_models";
import { BadRequestError } from "../utils/errors";

export class UploadService {
  async handleUpload(file: Express.Multer.File, project_id: string, asset_id?: string) {
    if (!file) throw new BadRequestError("No file uploaded");
    if (!project_id) throw new BadRequestError("Missing project_id");

    const ext = path.extname(file.originalname).toLowerCase();
    
    if (file.mimetype.startsWith("video/")) {
      return this.handleUploadVideo(file, project_id);
    } else if (file.mimetype.startsWith("image/")) {
      return this.handleUploadImage(file, project_id);
    } else if (ext === ".srt") {
      return this.handleUploadSrt(file, project_id, asset_id);
    } else {
      throw new BadRequestError(`Unsupported file type: ${ext}`);
    }
  }

  private async handleUploadVideo(file: Express.Multer.File, project_id: string) {
    const videoBaseName = path.parse(file.originalname).name;
    const assetDir = getProjectAssetDir(project_id, videoBaseName);
    await fs.mkdir(assetDir, { recursive: true });

    const destPath = path.join(assetDir, file.filename);
    await fs.rename(file.path, destPath);

    const thumbPathDisk = path.join(assetDir, `thumb-${file.filename}.jpg`);
    const thumbUrl = `/uploads/projects/${project_id}/assets/${videoBaseName}/thumb-${file.filename}.jpg`;
    await fs.mkdir(path.dirname(thumbPathDisk), { recursive: true });
    
    // We can extract width and height later if needed
    try {
      await FF.makeThumbnail(destPath, thumbPathDisk);
      await FF.getDimension(destPath);
    } catch (err) {
      console.error("FFmpeg metadata failed:", err);
    }

    const asset = buildAsset(file, project_id, "video", thumbUrl, destPath, videoBaseName);
    return await asset_repo.storeAsset(asset);
  }

  private async handleUploadImage(file: Express.Multer.File, project_id: string) {
    const imageBaseName = path.parse(file.originalname).name;
    const assetDir = getProjectAssetDir(project_id, imageBaseName);
    await fs.mkdir(assetDir, { recursive: true });

    const destPath = path.join(assetDir, file.filename);
    await fs.rename(file.path, destPath);

    const thumbUrl = `/uploads/projects/${project_id}/assets/${imageBaseName}/${file.filename}`;
    const asset = buildAsset(file, project_id, "image", thumbUrl, destPath, imageBaseName);
    return await asset_repo.storeAsset(asset);
  }

  private async handleUploadSrt(file: Express.Multer.File, typeofProjectId: string, asset_id?: string) {
    if (!asset_id) throw new BadRequestError("Missing asset_id for SRT upload");
    const project_id = Number(typeofProjectId);

    const content = await fs.readFile(file.path, "utf-8");
    const srtItems = parseSrt(content);
    const created: TrackItem[] = [];

    for (const item of srtItems) {
      const trackItem: Partial<TrackItem> = {
        asset_id: Number(asset_id),
        project_id,
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
