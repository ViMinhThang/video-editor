import path from "path";
import fs from "fs";
import multer from "multer";
import { Express, Request, Response } from "express";

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
    (req: Request, res: Response) => {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileUrl = `/uploads/${req.file.filename}`;

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
