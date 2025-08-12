import path, { basename } from "path";
import { uploadDir } from "../api/custom/upload_routes";
import fs from "fs/promises";
import FF from "./FF";
import { asset_repo } from "../data";
export const getProjectAssetDir = (project_id: string, basename: string) => {
  return path.join(uploadDir, "projects", project_id, "assets", basename);
};

// Xử lý video upload
export const handleUploadVideo = async (
  file: Express.Multer.File,
  project_id: string
) => {
  const videoBaseName = path.parse(file.originalname).name;

  const assetDir = getProjectAssetDir(project_id, videoBaseName);
  await fs.mkdir(assetDir, {
    recursive: true,
  });

  const destPath = path.join(assetDir, file.filename);
  await fs.rename(file.path, destPath);

  const thumbPathDisk = path.join(assetDir, `thumb-${file.filename}.jpg`);
  const thumbUrl = `/uploads/projects/${project_id}/assets/${videoBaseName}/thumb-${file.filename}.jpg`;
  await fs.mkdir(path.dirname(thumbPathDisk), { recursive: true });
  let width: number | undefined;
  let height: number | undefined;
  let duration: number | undefined;

  try {
    await FF.makeThumbnail(destPath, thumbPathDisk);
    const dimensions = await FF.getDimension(destPath);
    width = dimensions.width;
    height = dimensions.height;
  } catch (err) {
    console.error("FFmpeg metadata failed:", err);
  }

  const asset = buildAsset(file, project_id, "video", thumbUrl, destPath);

  const created = await asset_repo.storeAsset(asset);

  // // Lưu track item nếu cần
  // if (created?.id) {
  //   await asset_repo.storeTrackItem({
  //     track_id: 1,
  //     asset_id: created.id,
  //     start_time: 0,
  //     width,
  //     height,
  //     end_time: duration,
  //   });
  // }

  return created;
};

// Xử lý image upload
export const handleUploadImage = async (
  file: Express.Multer.File,
  project_id: string
) => {
  const imageBaseName = path.parse(file.originalname).name;
  const assetDir = getProjectAssetDir(project_id, imageBaseName);
  await fs.mkdir(assetDir, { recursive: true });

  const destPath = path.join(assetDir, file.filename);
  await fs.rename(file.path, destPath);

  const thumbUrl = `/uploads/projects/${project_id}/assets/${imageBaseName}/${file.filename}`;

  const asset = buildAsset(file, project_id, "image", thumbUrl, destPath);
  const created = await asset_repo.storeAsset(asset);

  // // Lưu track item nếu cần
  // if (created?.id) {
  //   await asset_repo.storeTrackItem({
  //     track_id: 0,
  //     asset_id: created.id,
  //     start_time: 0,
  //     width: undefined,
  //     height: undefined,
  //     end_time: undefined,
  //   });
  // }

  return created;
};
export const buildAsset = (
  file: Express.Multer.File,
  project_id: string,
  type: "video" | "image",
  thumbnail: string,
  server_path: string
) => ({
  original_name: file.originalname,
  project_id: Number(project_id),
  file_name: file.filename,
  type,
  mime_type: file.mimetype,
  size: file.size,
  thumbnail,
  server_path,
  url: `/uploads/projects/${project_id}/assets/${file.filename}`,
});
