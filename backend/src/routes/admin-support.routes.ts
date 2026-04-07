import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as AdminSupportController from '../modules/support/admin.controller';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Ticket operations
router.get('/tickets', AdminSupportController.getAllTickets);
router.post('/tickets', AdminSupportController.createTicket);
router.get('/tickets/:ticketId', AdminSupportController.getTicketById);
router.put('/tickets/:ticketId', AdminSupportController.updateTicket);
router.post('/tickets/:ticketId/assign', AdminSupportController.assignTicket);
router.post('/tickets/:ticketId/reassign', AdminSupportController.reassignTicket);
router.post('/tickets/:ticketId/status', AdminSupportController.changeTicketStatus);
router.post('/tickets/:ticketId/priority', AdminSupportController.changePriority);
router.post('/tickets/:ticketId/close', AdminSupportController.closeTicket);
router.delete('/tickets/:ticketId', AdminSupportController.deleteTicket);

// Message operations
router.get('/tickets/:ticketId/messages', AdminSupportController.getTicketMessages);
router.post('/tickets/:ticketId/messages', AdminSupportController.addMessageToTicket);
router.delete('/tickets/:ticketId/messages/:messageId', AdminSupportController.deleteMessage);

// Statistics
router.get('/stats', AdminSupportController.getTicketStats);
router.get('/statistics/category/:category', AdminSupportController.getTicketsByCategory);
router.get('/statistics/priority/:priority', AdminSupportController.getTicketsByPriority);
router.get('/agents/:agentId/stats', AdminSupportController.getAgentStats);

// Bulk operations
router.post('/tickets/bulk/status', AdminSupportController.bulkUpdateStatus);
router.post('/tickets/bulk/assign', AdminSupportController.bulkAssign);

// Export
router.get('/tickets/export', AdminSupportController.exportTickets);

// SLA management
router.get('/sla/config', AdminSupportController.getSLAConfiguration);
router.put('/sla/config', AdminSupportController.updateSLAConfiguration);

// Knowledge base
router.get('/knowledge-base/search', AdminSupportController.searchKnowledgeBase);
router.post('/knowledge-base/articles', AdminSupportController.addKnowledgeArticle);

// Email templates
router.get('/email-templates', AdminSupportController.getEmailTemplates);
router.put('/email-templates/:templateId', AdminSupportController.updateEmailTemplate);
router.post('/tickets/:ticketId/send-template', AdminSupportController.sendEmailTemplate);

export default router;
