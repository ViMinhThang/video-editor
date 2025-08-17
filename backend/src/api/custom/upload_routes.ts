// upload_routes.ts
import path from "path";
import fs from "fs/promises";
import { Express, Request, Response } from "express";
import multer from "multer";
import { buildAsset, getProjectAssetDir, parseSrt } from "../../lib/util";
import FF from "../../lib/FF";
import { asset_repo, track_repo } from "../../data";
import { TrackItem } from "../../data/models/track_items_models";

export const uploadDir = path.join(__dirname, "../../../uploads");

const tempDir = path.join(uploadDir, "_tmp");

const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    await fs.mkdir(tempDir, { recursive: true });
    cb(null, tempDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e4);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

export const createUploadRoutes = (app: Express) => {
  app.post(
    "/api/upload",
    upload.single("file"),
    async (req: Request, res: Response) => {
      try {
        if (!req.file)
          return res.status(400).json({ message: "No file uploaded" });

        const { project_id } = req.body;
        if (!project_id)
          return res.status(400).json({ message: "Missing project_id" });

        const ext = path.extname(req.file.originalname).toLowerCase();
        if (req.file.mimetype.startsWith("video/")) {
          const created = await handleUploadVideo(req.file, project_id);
          return res
            .status(201)
            .json({ message: "Upload successful", asset: created });
        } else if (req.file.mimetype.startsWith("image/")) {
          const created = await handleUploadImage(req.file, project_id);
          return res
            .status(201)
            .json({ message: "Upload successful", asset: created });
        } else if (ext === ".srt") {
          const created = await handleUploadSrt(
            req.file,
            project_id,
            req.body.asset_id
          ); // tự tạo handler
          return res
            .status(201)
            .json({ message: "SRT upload successful", asset: created });
        } else {
          return res.status(400).json({ message: "Unsupported file type" });
        }
      } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }
  );
};
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

  const asset = buildAsset(
    file,
    project_id,
    "video",
    thumbUrl,
    destPath,
    videoBaseName
  );

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
export const handleUploadImage = async (
  file: Express.Multer.File,
  project_id: string
) => {
  const imageBaseName = path.parse(file.originalname).name;
  const assetDir = getProjectAssetDir(project_id, imageBaseName);
  await fs.mkdir(assetDir, { recursive: true });
  const imageName = path.parse(file.originalname).name;

  const destPath = path.join(assetDir, file.filename);
  await fs.rename(file.path, destPath);

  const thumbUrl = `/uploads/projects/${project_id}/assets/${imageBaseName}/${file.filename}`;

  const asset = buildAsset(
    file,
    project_id,
    "image",
    thumbUrl,
    destPath,
    imageName
  );
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
export const handleUploadSrt = async (
  file: Express.Multer.File,
  project_id: string,
  asset_id: string
) => {
  try {
    const content = await fs.readFile(file.path, "utf-8");
    const srtItems = parseSrt(content);
    const created: TrackItem[] = [];

    for (const item of srtItems) {
      const trackItem = {
        asset_id: asset_id,
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
  } catch (error) {
    console.error(error);
    throw error;
  }
};
