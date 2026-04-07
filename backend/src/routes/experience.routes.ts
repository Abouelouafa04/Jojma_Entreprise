import { Router } from 'express';
import * as experienceController from '../modules/publicShare/experience.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.get('/view/:slug', experienceController.getExperienceBySlug);
router.get('/qr/:slug', experienceController.trackQrAndRedirect);
router.post('/experience/:slug/share', experienceController.trackShare);
router.post('/generate', protect, experienceController.createExperience);

export default router;
