import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as userAdminController from '../modules/users/admin.controller';

const router = Router();

// All routes require authentication and admin role
// Enforce authentication and admin role for admin routes
router.use(authMiddleware);

/**
 * GET /api/admin/users
 * Get all users with filtering and pagination
 * Query params: page, limit, role, status, search, sortBy
 */
router.get('/', userAdminController.getAllUsers);

/**
 * GET /api/admin/users/:userId
 * Get a single user by ID
 */
router.get('/:userId', userAdminController.getUserById);

/**
 * POST /api/admin/users
 * Create a new user
 */
router.post('/', userAdminController.createUser);

/**
 * PUT /api/admin/users/:userId
 * Update user information
 */
router.put('/:userId', userAdminController.updateUser);

/**
 * PUT /api/admin/users/:userId/role
 * Change user role
 */
router.put('/:userId/role', userAdminController.changeUserRole);

/**
 * PUT /api/admin/users/:userId/status
 * Toggle user account status (active/inactive/suspended)
 */
router.put('/:userId/status', userAdminController.toggleUserStatus);

/**
 * POST /api/admin/users/:userId/reset-password
 * Reset user password
 */
router.post('/:userId/reset-password', userAdminController.resetUserPassword);

/**
 * POST /api/admin/users/:userId/suspend
 * Suspend user access
 */
router.post('/:userId/suspend', userAdminController.suspendUser);

/**
 * DELETE /api/admin/users/:userId
 * Delete a user
 */
router.delete('/:userId', userAdminController.deleteUser);

/**
 * GET /api/admin/users/:userId/activity-logs
 * Get user activity logs
 */
router.get('/:userId/activity-logs', userAdminController.getUserActivityLogs);

/**
 * GET /api/admin/users/export
 * Export users data (CSV or JSON)
 * Query param: format (csv or json)
 */
router.get('/export', userAdminController.exportUsers);

export default router;
