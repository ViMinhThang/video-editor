import path, { basename } from "path";
import { uploadDir } from "../api/custom/upload_routes";
import fs from "fs/promises";
import FF from "./FF";
import { asset_repo } from "../data";
export const getProjectAssetDir = (project_id: string, basename: string) => {
  return path.join(uploadDir, "projects", project_id, "assets", basename);
};
export async function getNextRunIndex(baseDir: string): Promise<number> {
  try {
    const entries = await fs.readdir(baseDir, { withFileTypes: true });
    const runDirs = entries.filter(
      (e) => e.isDirectory() && e.name.startsWith("run_")
    );
    const indices = runDirs
      .map((d) => parseInt(d.name.split("_")[1], 10))
      .filter((n) => !isNaN(n));
    if (indices.length === 0) return 1;
    return Math.max(...indices) + 1;
  } catch {
    return 1;
  }
}

export const calculateNumbFrames = (duration: number, frameSpacing = 2) => {
  return Math.ceil(duration / frameSpacing);
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
