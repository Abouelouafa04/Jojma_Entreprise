import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
import * as profileController from '../modules/users/profile.controller';
import { uploadProfilePhoto } from '../middlewares/uploadProfilePhoto.middleware';

const router = Router();

router.use(protect);
// Profile data is user-specific; avoid 304 caching issues in XHR.
router.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

router.get('/profile', profileController.getMyProfile);
router.put('/profile', profileController.updateMyProfile);
router.put('/profile/photo', uploadProfilePhoto.single('photo'), profileController.updateMyPhoto);
router.delete('/account', profileController.deleteMyAccount);

export default router;

