import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as modelAdminController from '../modules/models3d/admin.controller';

const router = Router();

// All routes require authentication and admin role
router.use(authMiddleware);

/**
 * GET /api/admin/models
 * Get all 3D models with filtering and pagination
 * Query params: page, limit, format, userId, status, arCompatibility, search, sortBy
 */
router.get('/', modelAdminController.getAllModels);

/**
 * GET /api/admin/models/stats
 * Get statistics about 3D models
 */
router.get('/stats', modelAdminController.getModelStats);

/**
 * GET /api/admin/models/conversion-queue
 * Get models in conversion queue
 */
router.get('/conversion-queue', modelAdminController.getConversionQueue);

/**
 * GET /api/admin/models/export
 * Export models data (CSV or JSON)
 */
router.get('/export', modelAdminController.exportModels);

/**
 * GET /api/admin/models/:modelId
 * Get a single model by ID
 */
router.get('/:modelId', modelAdminController.getModelById);

/**
 * GET /api/admin/models/:modelId/errors
 * Get processing errors for a model
 */
router.get('/:modelId/errors', modelAdminController.getProcessingErrors);

/**
 * PUT /api/admin/models/:modelId
 * Update model metadata
 */
router.put('/:modelId', modelAdminController.updateModel);

/**
 * POST /api/admin/models/:modelId/rerun-analysis
 * Re-run quality analysis
 */
router.post('/:modelId/rerun-analysis', modelAdminController.rerunAnalysis);

/**
 * POST /api/admin/models/:modelId/force-conversion
 * Force model conversion
 */
router.post('/:modelId/force-conversion', modelAdminController.forceConversion);

/**
 * POST /api/admin/models/:modelId/archive
 * Archive a model
 */
router.post('/:modelId/archive', modelAdminController.archiveModel);

/**
 * POST /api/admin/models/:modelId/restore
 * Restore an archived model
 */
router.post('/:modelId/restore', modelAdminController.restoreModel);

/**
 * DELETE /api/admin/models/:modelId
 * Delete a model permanently
 */
router.delete('/:modelId', modelAdminController.deleteModel);

/**
 * POST /api/admin/models/bulk-delete
 * Bulk delete models
 */
router.post('/bulk-delete', modelAdminController.bulkDeleteModels);

/**
 * POST /api/admin/models/bulk-archive
 * Bulk archive models
 */
router.post('/bulk-archive', modelAdminController.bulkArchiveModels);

export default router;
