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
  server_path: string,
  videoBaseName: string
) => ({
  original_name: file.originalname,
  project_id: Number(project_id),
  file_name: file.filename,
  type,
  mime_type: file.mimetype,
  size: file.size,
  thumbnail,
  server_path,
  url: `/uploads/projects/${project_id}/assets/${videoBaseName}/${file.filename}`,
});

interface SrtItem {
  index: number;
  start: number;
  end: number;
  text: string;
}
const timeToSec = (time: string) => {
  const [hms, ms] = time.split(",");
  const [h, m, s] = hms.split(":").map(Number);
  return h * 3600 + m * 60 + s + Number(ms) / 1000;
};

export const parseSrt = (content: string): SrtItem[] => {
  const items: SrtItem[] = [];
  const blocks = content.split(/\r?\n\r?\n/); // mỗi block là 1 subtitle

  blocks.forEach((block) => {
    const lines = block.split(/\r?\n/); // split từng dòng
    if (lines.length >= 3) {
      const index = Number(lines[0]);
      const times = lines[1].split(" --> ");
      const text = lines.slice(2).join("\n");

      items.push({
        index,
        start: timeToSec(times[0]),
        end: timeToSec(times[1]),
        text,
      });
    }
  });

  return items;
};