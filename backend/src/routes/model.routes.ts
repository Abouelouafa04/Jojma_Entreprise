import { Router } from 'express';
import * as modelController from '../modules/models3d/model.controller';
import { protect } from '../middlewares/auth.middleware';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = 'uploads/models';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

const router = Router();

router.use(protect);
router.post('/upload', upload.single('file'), modelController.uploadModel);
router.get('/my-models', modelController.getMyModels);

export default router;
