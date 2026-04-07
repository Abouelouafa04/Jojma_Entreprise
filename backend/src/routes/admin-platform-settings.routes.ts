import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { authorizeAdmin } from '../middlewares/auth.middleware';
import * as controller from '../controllers/platformSettings.controller';

const router = Router();

// Middleware
const adminOnly = [authenticateJWT, authorizeAdmin];

// Get Settings
router.get('/', adminOnly, controller.getAllSettings);
router.get('/general', adminOnly, controller.getGeneralSettings);
router.get('/technical', adminOnly, controller.getTechnicalSettings);
router.get('/security', adminOnly, controller.getSecuritySettings);
router.get('/notifications', adminOnly, controller.getNotificationSettings);

// Update Settings
router.put('/', adminOnly, controller.updateAllSettings);
router.patch('/general', adminOnly, controller.updateGeneralSettings);
router.patch('/technical', adminOnly, controller.updateTechnicalSettings);
router.patch('/security', adminOnly, controller.updateSecuritySettings);
router.patch('/notifications', adminOnly, controller.updateNotificationSettings);

// Password Policy
router.post('/validate-password', adminOnly, controller.validatePassword);
router.patch('/security/password-policy', adminOnly, controller.updatePasswordPolicy);

// IP Whitelist
router.post('/security/ip-whitelist', adminOnly, controller.addIpToWhitelist);
router.delete('/security/ip-whitelist/:ip', adminOnly, controller.removeIpFromWhitelist);

// Format Management
router.post('/technical/formats', adminOnly, controller.addFormat);
router.delete('/technical/formats/:format', adminOnly, controller.removeFormat);

// Validation
router.post('/validate', adminOnly, controller.validateSettings);

// Backup & Restore
router.get('/backup', adminOnly, controller.backupSettings);
router.post('/restore', adminOnly, controller.restoreSettings);
router.post('/reset-defaults', adminOnly, controller.resetToDefaults);

// Audit Log
router.get('/audit-log', adminOnly, controller.getSettingsAuditLog);

export default router;
