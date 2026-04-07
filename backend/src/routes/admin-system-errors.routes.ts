import { Router, Request, Response } from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { authorizeAdmin } from '../middlewares/auth.middleware';
import * as controller from '../controllers/systemErrors.controller';

const router = Router();

// Middleware
const adminOnly = [authenticateJWT, authorizeAdmin];

// CRUD Operations
router.get('/', adminOnly, controller.getAllErrors);
router.get('/stats/overview', adminOnly, controller.getErrorStats);
router.get('/filter/by-service/:service', adminOnly, controller.getErrorsByService);
router.get('/filter/by-severity/:severity', adminOnly, controller.getErrorsBySeverity);
router.get('/filter/by-status/:status', adminOnly, controller.getErrorsByStatus);
router.get('/search', adminOnly, controller.searchErrors);
router.get('/:errorId', adminOnly, controller.getErrorById);

// Update Status
router.patch('/:errorId/analyze', adminOnly, controller.markAsAnalyzed);
router.patch('/:errorId/assign', adminOnly, controller.assignError);
router.patch('/:errorId/resolve', adminOnly, controller.resolveError);

// Service Operations
router.post('/services/:service/restart', adminOnly, controller.restartService);
router.get('/services/:service/status', adminOnly, controller.getServiceStatus);

// Analytics
router.get('/analytics/trends', adminOnly, controller.getErrorTrends);
router.get('/analytics/frequent', adminOnly, controller.getMostFrequentErrors);
router.get('/analytics/health-score', adminOnly, controller.getServiceHealthScore);

// Export
router.post('/export', adminOnly, controller.exportErrors);

export default router;
