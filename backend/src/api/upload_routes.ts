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
      console.log(req.file);
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
        const projectDir = path.join(uploadDir, project_id);
        fs.mkdirSync(projectDir, { recursive: true });

        const oldPath = req.file.path; // file o73 uploads/tmp
        const newPath = path.join(projectDir, req.file.filename); // tao folder

        fs.renameSync(oldPath, newPath); // di chuyen file

        let width: number | undefined;
        let height: number | undefined;
        let thumbnail: string | undefined;
        let duration: number | undefined;

        if (file.mimetype.includes("mp4")) {
          try {
            thumbnail = `${projectDir}/thumb-${file.filename}.jpg`;
            fs.mkdirSync(path.dirname(thumbnail), { recursive: true });
            await FF.makeThumbnail(newPath, thumbnail);
            const dimensions = await FF.getDimension(newPath);
            duration = await FF.getDuration(newPath);
            width = dimensions.width;
            height = dimensions.height;
          } catch (err) {
            console.error("FFprobe failed:", err);
          }
        }

        // 1. Tạo asset
        const asset = {
          original_name: file.originalname,
          project_id: project_id,
          file_name: file.filename,
          mime_type: file.mimetype,
          size: file.size,
          thumbnail: `/uploads/projects/${project_id}/thumb-${file.filename}.jpg`,
          url: `/uploads/projects/${project_id}/${file.filename}`,
        };
        console.log(asset);
        const assetId = await asset_repo.storeAsset(asset);

        // const track = await upload_repo.storeTrack({
        //   project_id: parseInt(project_id),
        //   type: file.mimetype,
        // });

        // await upload_repo.storeTrackItem({
        //   track_id: track.id!,
        //   asset_id: assetId,
        //   start_time: 0,
        //   width,
        //   height,
        //   end_time: duration,
        //   created_at: new Date(),
        // });

        return res.status(201).json({
          message: "Upload successful",
          asset_id: assetId,
          url: newPath,
          thumbnail,
        });
      } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }
  );
};
