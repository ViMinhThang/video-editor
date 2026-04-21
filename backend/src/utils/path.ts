import path from "path";
import { uploadDir } from "../routes/upload_routes";
import fs from "fs/promises";

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
