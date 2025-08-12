import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
const makeThumbnail = (fullPath: string, thumbnailPath: string) => {
  return new Promise<void>((resolve, reject) => {
    console.log("=== FFmpeg makeThumbnail Debug ===");
    console.log("Full video path:", fullPath);
    console.log("Thumbnail output path:", thumbnailPath);
    console.log("File exists?", fs.existsSync(fullPath));
    if (fs.existsSync(fullPath)) {
      console.log("File size:", fs.statSync(fullPath).size);
    }
    console.log("============================");

    const ffmpeg = spawn("ffmpeg", [
      "-i",
      fullPath,
      "-ss",
      "5",
      "-vframes",
      "1",
      thumbnailPath,
    ]);

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(`FFmpeg exited with code: ${code}`);
      }
    });

    ffmpeg.on("error", (err) => {
      reject(err);
    });
  });
};

const getDimension = (
  fullPath: string
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const ffprobe = spawn("ffprobe", [
      "-v",
      "error",
      "-select_streams",
      "v:0",
      "-show_entries",
      "stream=width,height",
      "-of",
      "csv=p=0",
      fullPath,
    ]);
    let dimensions: any = "";
    ffprobe.stdout.on("data", (data) => {
      dimensions += data.toString("utf-8");
    });
    ffprobe.on("close", (code) => {
      if (code === 0) {
        dimensions = dimensions.replace(/\s/g, "").split(",");
        resolve({
          width: Number(dimensions[0]),
          height: Number(dimensions[1]),
        });
      } else {
        reject(`FFprob existed with this code: ${code}`);
      }
    });
  });
};
const getDuration = (fullPath: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const ffprobe = spawn("ffprobe", [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      fullPath,
    ]);

    let output = "";

    ffprobe.stdout.on("data", (data) => {
      output += data.toString("utf-8");
    });

    ffprobe.on("close", (code) => {
      if (code === 0) {
        const duration = parseFloat(output.trim());
        resolve(duration);
      } else {
        reject(new Error(`ffprobe exited with code ${code}`));
      }
    });

    ffprobe.on("error", (err) => {
      reject(err);
    });
  });
};
const extractFramesIntoThreeGroups = async (
  fullPath: string,
  totalFrames = 9
): Promise<string[][]> => {
  const duration = await getDuration(fullPath);
  const interval = duration / totalFrames;

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "frames-"));
  console.log("[extractFrames] Temp dir:", tempDir);

  await new Promise<void>((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-i",
      fullPath,
      "-vf",
      `fps=1/${interval}`,
      path.join(tempDir, "frame-%03d.jpg"),
    ]);
    ffmpeg.on("close", (code) => {
      if (code == 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
    ffmpeg.on("error", reject);
  });

  const allFrames = fs
    .readdirSync(tempDir)
    .sort()
    .map((file) => path.join(tempDir, file));

  console.log("[extractFrames] Total frames:", allFrames.length);
  console.log("[extractFrames] All frame paths:", allFrames);

  const groupSize = Math.ceil(allFrames.length / 3);
  const framesGroups: string[][] = [];
  for (let i = 0; i < allFrames.length; i += groupSize) {
    const group = allFrames.slice(i, i + groupSize);
    framesGroups.push(group);
    console.log(`[extractFrames] Group ${framesGroups.length}:`, group);
  }

  return framesGroups;
};

export default {
  getDimension,
  getDuration,
  makeThumbnail,
  extractFramesIntoThreeGroups,
};
