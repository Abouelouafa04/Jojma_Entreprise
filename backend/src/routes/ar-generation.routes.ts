import { Router } from 'express';
import path from 'path';
import uploadAR from '../middlewares/uploadAR.middleware.js';
import { protect } from '../middlewares/auth.middleware';
import { AppError } from '../utils/AppError';
import { isAllowedFile } from '../utils/arFileRules.js';
import Model3D from '../modules/models3d/model3d.model';
import { createExperience } from '../modules/publicShare/experience.controller';

const router = Router();

/**
 * Upload an AR-ready file (GLB/USDZ) for the authenticated user,
 * persist it in DB, and generate (or reuse) an ARExperience.
 *
 * This is the bridge between:
 * - the AR generation page (frontend)
 * - the backend
 * - the database (Model3D + ARExperience)
 */
router.post('/upload-and-generate', protect, uploadAR.single('file'), async (req: any, res, next) => {
  try {
    const platform = req.body?.platform;
    const file = req.file as Express.Multer.File | undefined;

    if (!platform) return next(new AppError('La plateforme est obligatoire.', 400));
    if (!['android', 'iphone'].includes(platform)) return next(new AppError('Plateforme non valide.', 400));
    if (!file) return next(new AppError('Aucun fichier reçu.', 400));

    if (!isAllowedFile(file.originalname, platform)) {
      return next(new AppError('Le fichier ne correspond pas à la plateforme sélectionnée.', 400));
    }

    // Create the model entry (AR-ready file is considered "completed").
    const ext = path.extname(file.originalname).substring(1);
    const userId = req.user.id;

    const model = await Model3D.create({
      userId,
      name: file.originalname,
      sizeBytes: file.size,
      format: ext,
      status: 'completed',
    });

    // Best-effort: store extra conversion fields if DB schema supports them.
    try {
      await model.update({
        convertedFormat: ext,
        convertedFileName: file.filename,
        conversionDate: new Date(),
      } as any);
    } catch {
      // Ignore if columns do not exist yet.
    }

    // Generate (or reuse) experience for that model (controller already validates owner/status).
    req.body = { modelId: model.id };
    return createExperience(req, res, next);
  } catch (e) {
    next(e);
  }
});

export default router;

