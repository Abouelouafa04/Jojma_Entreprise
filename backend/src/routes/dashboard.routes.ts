import { Router } from 'express';
import * as dashboardController from '../modules/dashboard/dashboard.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);
router.get('/stats', dashboardController.getStats);

export default router;
