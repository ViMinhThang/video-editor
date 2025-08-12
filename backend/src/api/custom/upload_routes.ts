// upload_routes.ts
import path from "path";
import fs from "fs/promises";
import { Express, Request, Response } from "express";
import multer from "multer";
import { handleUploadVideo } from "../../lib/util";

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
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }

        const { project_id } = req.body;
        if (!project_id) {
          return res.status(400).json({ message: "Missing project_id" });
        }

        let created;
        if (req.file.mimetype.startsWith("video/")) {
          created = await handleUploadVideo(req.file, project_id);
        } else if (req.file.mimetype.startsWith("image/")) {
          created = await handleUploadVideo(req.file, project_id);
        } else {
          return res.status(400).json({ message: "Unsupported file type" });
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
