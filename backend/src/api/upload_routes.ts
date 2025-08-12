import path from "path";
import fs from "fs";
import multer from "multer";
import { Express, Request, Response } from "express";
import FF from "../lib/FF";
import { asset_repo } from "../data";

const uploadDir = path.join(__dirname, "../../uploads/projects");
const tempDir = path.join(uploadDir, "tmp");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, callback) {
    fs.mkdirSync(tempDir, { recursive: true });
    callback(null, tempDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e4);
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${basename}-${uniqueSuffix}${ext}`);
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
          return res.status(400).json({ message: "Missing project_id" });
        }

        const file = req.file;
        const projectDir = path.join(uploadDir, project_id);
        fs.mkdirSync(projectDir, { recursive: true });

        const oldPath = file.path; // file ở uploads/tmp
        const newPath = path.join(projectDir, file.filename); // folder riêng project

        fs.renameSync(oldPath, newPath); // di chuyển file

        let thumbnail: string | undefined;
        let width: number | undefined;
        let height: number | undefined;
        let duration: number | undefined;
        let track_id: number | undefined;

        if (file.mimetype.startsWith("video/")) {
          // video: tạo thumbnail bằng FFmpeg
          track_id = 1;
          thumbnail = path.join(projectDir, `thumb-${file.filename}.jpg`);
          fs.mkdirSync(path.dirname(thumbnail), { recursive: true });
          try {
            await FF.makeThumbnail(newPath, thumbnail);
            const dimensions = await FF.getDimension(newPath);
            duration = await FF.getDuration(newPath);
            width = dimensions.width;
            height = dimensions.height;
            // Lưu đường dẫn thumbnail dưới dạng URL tương ứng
            thumbnail = `/uploads/projects/${project_id}/thumb-${file.filename}.jpg`;
          } catch (err) {
            console.error("FFprobe failed:", err);
            thumbnail = undefined;
          }
        } else if (file.mimetype.startsWith("image/")) {
          // ảnh: thumbnail chính là url ảnh gốc luôn
          track_id = 0;
          thumbnail = `/uploads/projects/${project_id}/${file.filename}`;
        }

        const asset = {
          original_name: file.originalname,
          project_id: project_id,
          file_name: file.filename,
          mime_type: file.mimetype,
          size: file.size,
          thumbnail: thumbnail || "",
          url: `/uploads/projects/${project_id}/${file.filename}`,
        };

        console.log("Saving asset:", asset);
        const created = await asset_repo.storeAsset(asset);

        if (track_id !== undefined && created?.id !== undefined) {
          await asset_repo.storeTrackItem({
            track_id,
            asset_id: created.id,
            start_time: 0,
            width,
            height,
            end_time: duration,
          });
        }

        return res.status(201).json({
          message: "Upload successful",
          asset: created,
        });
      } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }
  );
};
