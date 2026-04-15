import { Router } from 'express';
import { submitDemande } from '../controllers/demandes.controller';

const router = Router();

// Public endpoint to submit demand
router.post('/submit', submitDemande);

export default router;
