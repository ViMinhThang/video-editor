import path from "path";
import fs from "fs";
import multer from "multer";
import { Express, Request, Response } from "express";
import { upload_repo } from "../data";
import FF from "../lib/FF";

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
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const file = req.file;
      const fileUrl = `/uploads/${req.body.project_title}/${file.filename}`;

      let width: number | undefined;
      let height: number | undefined;
      let thumbnail: string | undefined;
      if (file.mimetype.includes("mp4")) {
        try {
          thumbnail = `${fileUrl}/thumbnail.jpg`;
          await FF.makeThumbnail(fileUrl, thumbnail);
          const dimensions = await FF.getDimension(fileUrl);
          width = dimensions.width;
          height = dimensions.height;
        } catch (err) {
          console.error("FFprobe failed to get dimensions", err);
        }
      }

      const asset = {
        original_name: file.originalname,
        file_name: file.fieldname,
        mime_type: file.mimetype,
        size: file.size,
        width,
        thumbnail,
        height,
        url: fileUrl,
        created_at: new Date(),
      };
      const storedAsset = await upload_repo.storeAsset(asset);
      
      res.status(201).json({
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
      });
    }
  );
};
