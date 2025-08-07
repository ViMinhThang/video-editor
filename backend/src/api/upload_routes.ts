import path from "path";
import fs from "fs";
import multer from "multer";
import { Express, Request, Response } from "express";
import FF from "../lib/FF";
import { upload_repo } from "../data";

const uploadDir = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.filename}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

export const createUploadRoutes = (app: Express) => {
  app.post(
    "/api/upload",
    upload.single("file"),
    async (req: Request, res: Response) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }

        const { project_id } = req.body;
        if (!project_id) {
          return res
            .status(400)
            .json({ message: "Missing project_id or track_type" });
        }

        const file = req.file;
        const folder = `/uploads/projects/${project_id}`;
        const fileUrl = `${folder}/${file.filename}`;

        let width: number | undefined;
        let height: number | undefined;
        let thumbnail: string | undefined;
        let duration: number | undefined;

        if (file.mimetype.includes("mp4")) {
          try {
            thumbnail = `${folder}/thumb-${file.filename}.jpg`;
            await FF.makeThumbnail(fileUrl, thumbnail);
            const dimensions = await FF.getDimension(fileUrl);
            duration = await FF.getDuration(fileUrl);
            width = dimensions.width;
            height = dimensions.height;
          } catch (err) {
            console.error("FFprobe failed:", err);
          }
        }

        // 1. Tạo asset
        const asset = {
          original_name: file.originalname,
          file_name: file.filename,
          mime_type: file.mimetype,
          size: file.size,
          width,
          height,
          duration,
          thumbnail,
          url: fileUrl,
          created_at: new Date(),
        };
        const assetId = await upload_repo.storeAsset(asset);

        const track = await upload_repo.findOrCreate({
          project_id: parseInt(project_id),
          type: file.mimetype,
        });

        await upload_repo.storeTrackItem({
          track_id: track.id!,
          asset_id: assetId,
          start_time: 0,
          end_time: duration,
          created_at: new Date(),
        });

        return res.status(201).json({
          message: "Upload successful",
          asset_id: assetId,
          url: fileUrl,
          thumbnail,
        });
      } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }
  );
};
