import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { AppError } from '../utils/AppError';

// Compute a safe directory for profile uploads without using `import.meta`
const appDirname = (typeof (globalThis as any).__dirname !== 'undefined')
  ? (globalThis as any).__dirname
  : ((typeof (globalThis as any).__filename !== 'undefined')
    ? path.dirname((globalThis as any).__filename)
    : path.join(process.cwd(), 'src'));

const uploadDir = path.join(appDirname, '..', 'uploads', 'profile');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req: any, file, cb) => {
    const userId = req.user?.id || 'anonymous';
    const ext = path.extname(file.originalname || '').toLowerCase() || '.jpg';
    const safeExt = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) ? ext : '.jpg';
    cb(null, `${userId}-${Date.now()}${safeExt}`);
  },
});

const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
  if (!file.mimetype?.startsWith('image/')) {
    return cb(new AppError('Format de fichier non supporté. Veuillez envoyer une image.', 400));
  }
  cb(null, true);
};

export const uploadProfilePhoto = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

