import { spawn } from "child_process";

const makeThumbnail = (fullPath: string, thumbnailPath: string) => {
  return new Promise<void>((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-i",
      fullPath,
      "-ss",
      "5",
      "vframes",
      "1",
      thumbnailPath,
    ]);
    ffmpeg.on("close", (code) => {
      if (code == 0) {
        resolve();
      } else {
        reject(`FFmpeg existed with this code:${code}`);
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
const getDuration = (fullPath: string) => {
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
    let duration = 0;
    ffprobe.stdout.on("data", (data) => {
      duration += data.toString("utf-8");
    });
    ffprobe.on("close", (code) => {
      if (code === 0) {
        resolve({
          duration,
        });
      } else {
        reject(`FFprob existed with this code: ${code}`);
      }
    });
  });
};
export default { getDimension, getDuration, makeThumbnail };
