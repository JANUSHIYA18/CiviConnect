import multer from "multer";
import fs from "node:fs";
import path from "node:path";

const uploadDir = path.resolve("backend/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const sanitized = file.originalname.replace(/[^\w.-]/g, "_");
    cb(null, `${Date.now()}-${sanitized}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 3 },
});
