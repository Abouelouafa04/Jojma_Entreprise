import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as AdminActivityLogsController from '../modules/activityLogs/admin.controller';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Retrieve activity logs
router.get('/logs', AdminActivityLogsController.getAllLogs);
router.get('/logs/:logId', AdminActivityLogsController.getLogById);

// Statistics
router.get('/stats', AdminActivityLogsController.getActivityStats);
router.get('/users/:userId/stats', AdminActivityLogsController.getStatsByUser);
router.get('/modules/:module/stats', AdminActivityLogsController.getStatsByModule);
router.get('/actions/:action/stats', AdminActivityLogsController.getStatsByAction);

// Filtering and Search
router.get('/search', AdminActivityLogsController.searchLogs);
router.get('/users/:userId/logs', AdminActivityLogsController.getLogsByUser);
router.get('/modules/:module/logs', AdminActivityLogsController.getLogsByModule);
router.get('/actions/:action/logs', AdminActivityLogsController.getLogsByAction);

// Date Range Query
router.get('/date-range', AdminActivityLogsController.getLogsByDateRange);

// Critical and Failed Operations
router.get('/critical', AdminActivityLogsController.getCriticalLogs);
router.get('/failures', AdminActivityLogsController.getFailedOperations);

// User Timeline
router.get('/users/:userId/timeline', AdminActivityLogsController.getUserTimeline);

// Audit Trail
router.get('/audit-trail', AdminActivityLogsController.getAuditTrail);

// Security Events
router.get('/security-events', AdminActivityLogsController.getSecurityEvents);
router.post('/security-incident', AdminActivityLogsController.reportSecurityIncident);

// Performance Metrics
router.get('/performance-metrics', AdminActivityLogsController.getPerformanceMetrics);
router.get('/failure-rate', AdminActivityLogsController.getFailureRate);
router.get('/suspicious-activity', AdminActivityLogsController.getSuspiciousActivity);

// Export
router.get('/export', AdminActivityLogsController.exportLogs);

// Retention Policy
router.get('/retention-policy', AdminActivityLogsController.getRetentionPolicy);
router.put('/retention-policy', AdminActivityLogsController.updateRetentionPolicy);

// Cleanup Operations
router.post('/cleanup', AdminActivityLogsController.deleteOldLogs);
router.post('/archive', AdminActivityLogsController.archiveLogs);

export default router;
