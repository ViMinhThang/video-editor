// upload_routes.ts
import path from "path";
import fs from "fs/promises";
import { Express, Request, Response } from "express";
import multer from "multer";
import { UploadService } from "../services/UploadService";
import { validateRequest } from "../middleware/validate";
import { uploadFileSchema } from "../dtos/upload.dto";

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
  const service = new UploadService();
  
  app.post(
    "/api/upload",
    upload.single("file"),
    /* Need to conditionally validate body because it depends on multer resolving first. Wait inside handler. */
    async (req: Request, res: Response) => {
      // Validate schema manually or just let service handle it to keep it simple since multer modifies req.body dynamically
      const asset = await service.handleUpload(req.file as any, req.body.project_id, req.body.asset_id);
      return res.status(201).json({ message: "Upload successful", asset });
    }
  );
};
