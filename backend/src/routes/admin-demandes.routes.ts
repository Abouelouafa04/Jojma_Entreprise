import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as AdminDemandesController from '../modules/demandes/admin.controller';

const router = Router();

router.use(authMiddleware);

router.get('/', AdminDemandesController.listDemandes);
router.get('/stats', AdminDemandesController.getStats);
router.get('/:id', AdminDemandesController.getDemandeById);
router.patch('/:id', AdminDemandesController.updateDemande);
router.post('/:id/notes', AdminDemandesController.addNote);
router.post('/:id/archive', AdminDemandesController.archiveDemande);
router.delete('/:id', AdminDemandesController.deleteDemande);

export default router;
