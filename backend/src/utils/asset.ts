export const buildAsset = (
  file: Express.Multer.File,
  project_id: string,
  type: "video" | "image",
  thumbnail: string,
  server_path: string,
  videoBaseName: string
) => ({
  original_name: file.originalname,
  project_id: Number(project_id),
  file_name: file.filename,
  type,
  mime_type: file.mimetype,
  size: file.size,
  thumbnail,
  server_path,
  url: `/uploads/projects/${project_id}/assets/${videoBaseName}/${file.filename}`,
});
