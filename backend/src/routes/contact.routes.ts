import express, { Router } from 'express';
import {
  submitContactRequest,
  getContactRequests,
  getContactRequestById,
  updateContactRequestStatus,
  deleteContactRequest,
  respondToContactRequest,
  getContactResponses,
  getAllResponses,
} from '../controllers/contact.controller';

const router: Router = express.Router();

/**
 * @route POST /api/contact/submit
 * @description Soumet une nouvelle demande de contact
 * @body {firstName, lastName, email, phone, message, subscribeNewsletter}
 */
router.post('/submit', submitContactRequest);

/**
 * @route GET /api/contact/list
 * @description Récupère toutes les demandes de contact (admin)
 * @query {page, limit}
 */
router.get('/list', getContactRequests);

/**
 * @route GET /api/contact/responses/all
 * @description Récupère toutes les réponses envoyées
 * @query {page, limit}
 */
router.get('/responses/all', getAllResponses);

/**
 * @route GET /api/contact/:id
 * @description Récupère une demande de contact spécifique
 */
router.get('/:id', getContactRequestById);

/**
 * @route GET /api/contact/:id/responses
 * @description Récupère les réponses d'une demande spécifique
 */
router.get('/:id/responses', getContactResponses);

/**
 * @route POST /api/contact/:id/respond
 * @description Envoie une réponse à une demande
 * @body {adminName, response}
 */
router.post('/:id/respond', respondToContactRequest);

/**
 * @route PATCH /api/contact/:id/status
 * @description Met à jour le statut d'une demande
 * @body {status}
 */
router.patch('/:id/status', updateContactRequestStatus);

/**
 * @route DELETE /api/contact/:id
 * @description Supprime une demande de contact
 */
router.delete('/:id', deleteContactRequest);

export default router;
