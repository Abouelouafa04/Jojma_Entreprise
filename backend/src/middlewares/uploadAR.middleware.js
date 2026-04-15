import multer from "multer";
import path from "path";
import fs from "fs";

// Compute upload directory relative to the backend working directory
const uploadDir = path.join(process.cwd(), 'src', 'uploads', 'ar');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const uploadAR = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

export default uploadAR;