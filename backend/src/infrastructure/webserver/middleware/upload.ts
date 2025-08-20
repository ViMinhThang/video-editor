import path from "path";
import fs from "fs/promises";
import multer from "multer";

export const uploadDir = path.join(__dirname, "../../../../uploads");
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

export const upload = multer({ storage });