import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import { formatTime } from "./util";
import { TrackItem } from "../domain/models/track_items_models";
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
const extractAllFrames = async (
  fullPath: string,
  totalFrames = 9
): Promise<string[]> => {
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
      if (code === 0) resolve();
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

  return allFrames;
};
const cutVideoAccurate = async (
  fullPath: string,
  start: number,
  end: number,
  outputName?: string
): Promise<string> => {
  const duration = end - start;
  if (duration <= 0) {
    throw new Error("Invalid time range: end must be greater than start");
  }

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "cut-"));
  console.log("[cutVideoAccurate] Temp dir:", tempDir);

  const outputFile = path.join(tempDir, outputName || "cut.mp4");

  // Chạy ffmpeg với re-encode
  await new Promise<void>((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-ss",
      start.toString(), // thời điểm bắt đầu
      "-i",
      fullPath, // input video
      "-t",
      duration.toString(), // độ dài đoạn cắt
      "-c:v",
      "libx264", // re-encode video để cắt chính xác
      "-preset",
      "fast", // tốc độ encode
      "-crf",
      "18", // chất lượng (thấp hơn = đẹp hơn, 18 ~ visually lossless)
      "-c:a",
      "aac", // re-encode audio
      "-b:a",
      "192k", // bitrate audio
      "-movflags",
      "+faststart", // tối ưu phát trực tuyến
      outputFile,
    ]);

    ffmpeg.stderr.on("data", (data) => {
      console.error(`[cutVideoAccurate] ${data}`);
    });

    ffmpeg.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });

    ffmpeg.on("error", reject);
  });

  console.log("[cutVideoAccurate] Output file:", outputFile);
  return outputFile;
};
const concatVideos = async (cutVideos: string[], outputPath: string) => {
  if (!cutVideos.length) {
    throw new Error("No videos to concat");
  }

  // Tạo temp file list cho ffmpeg
  const tempListPath = path.join(process.cwd(), `temp_list_${Date.now()}.txt`);
  const fileContent = cutVideos.map((v) => `file '${v}'`).join("\n");
  fs.writeFileSync(tempListPath, fileContent);

  // Chạy ffmpeg concat
  await new Promise<void>((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      tempListPath,
      "-c",
      "copy",
      outputPath,
    ]);

    ffmpeg.stderr.on("data", (data) => console.log(data.toString()));

    ffmpeg.on("close", (code) => {
      fs.unlinkSync(tempListPath); // xóa temp list
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });

  return outputPath;
};
export async function overlaySubtitles(
  inputVideo: string,
  textTracks: TrackItem[],
  outputVideo: string
) {
  // 1️⃣ Tạo file subtitle tạm thời (.ass)
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "subs-"));
  const subtitleFile = path.join(tempDir, "subs.ass");

  const assHeader = `
[Script Info]
ScriptType: v4.00+
Collisions: Normal
PlayResX: 1920
PlayResY: 1080
Timer: 100.0000

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,36,&H00FFFFFF,&H000000FF,&H00000000,&H64000000,0,0,0,0,100,100,0,0,1,2,0,2,10,10,10,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

  // 2️⃣ Convert trackItems thành dòng Dialogue trong ass
  const assEvents = textTracks
    .map((t) => {
      const start = formatTime(t.start_time!);
      const end = formatTime(t.end_time!);
      const text = t.text_content!.replace(/\n/g, "\\N"); // multi-line
      return `Dialogue: 0,${start},${end},Default,,0,0,0,,${text}`;
    })
    .join("\n");

  fs.writeFileSync(subtitleFile, assHeader + assEvents, "utf-8");

  // 3️⃣ Chạy ffmpeg overlay subtitle
  await new Promise<void>((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-i",
      inputVideo,
      "-vf",
      `ass=${subtitleFile}`,
      "-c:a",
      "copy",
      "-c:v",
      "libx264",
      "-preset",
      "fast",
      "-crf",
      "18",
      outputVideo,
    ]);

    ffmpeg.stderr.on("data", (data) => {
      console.log("[overlaySubtitles]", data.toString());
    });

    ffmpeg.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });

    ffmpeg.on("error", reject);
  });

  // 4️⃣ Xoá tạm
  fs.unlinkSync(subtitleFile);
  fs.rmdirSync(tempDir);
}

export default {
  getDimension,
  getDuration,
  makeThumbnail,
  overlaySubtitles,
  extractAllFrames,
  cutVideoAccurate,
  concatVideos,
};
