import { Express, Request, Response } from "express";
import { UploadService } from "../../../../application/services/UploadService";
import { upload } from "../../middleware/upload";

export const createUploadRoutes = (app: Express) => {
  app.post(
    "/api/upload",
    upload.single("file"),
    async (req: Request, res: Response) => {
      try {
        if (!req.file)
          return res.status(400).json({ message: "No file uploaded" });
        const { project_id, asset_id } = req.body;
        if (!project_id)
          return res.status(400).json({ message: "Missing project_id" });

        const ext = req.file.originalname.split(".").pop()?.toLowerCase();
        let created;

        if (req.file.mimetype.startsWith("video/")) {
          created = await UploadService.handleUploadVideo(
            req.file,
            project_id
          );
        } else if (req.file.mimetype.startsWith("image/")) {
          created = await UploadService.handleUploadImage(
            req.file,
            project_id
          );
        } else if (ext === "srt") {
          created = await UploadService.handleUploadSrt(
            req.file,
            project_id,
            Number.parseInt(asset_id)
          );
        } else {
          return res.status(400).json({ message: "Unsupported file type" });
        }

        return res
          .status(201)
          .json({ message: "Upload successful", asset: created });
      } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }
  );
};
