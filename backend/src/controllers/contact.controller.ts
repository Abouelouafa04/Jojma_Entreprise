import { Request, Response } from 'express';
import { ContactRequest } from '../modules/contact/contact.model';
import { ContactResponse } from '../modules/contact/contact-response.model';
import { sendContactConfirmationEmail, sendAdminNotificationEmail } from '../services/contactEmailService';
import { sendContactResponseEmail } from '../services/contactResponseEmailService';
import { v4 as uuidv4 } from 'uuid';

/**
 * Génère un numéro de demande unique
 */
function generateRequestNumber(): string {
  const prefix = 'REQ';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Crée une nouvelle demande de contact
 * POST /api/contact/submit
 */
export async function submitContactRequest(req: Request, res: Response) {
  try {
    const { firstName, lastName, email, phone, message, subscribeNewsletter } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs obligatoires doivent être remplis.',
        errors: {
          firstName: !firstName ? 'Le prénom est requis' : null,
          lastName: !lastName ? 'Le nom est requis' : null,
          email: !email ? 'L\'email est requis' : null,
          phone: !phone ? 'Le téléphone est requis' : null,
          message: !message ? 'Le message est requis' : null,
        },
      });
    }

    // Validation fine
    if (message.length < 10 || message.length > 2000) {
      return res.status(400).json({
        success: false,
        message: 'Le message doit contenir entre 10 et 2000 caractères.',
      });
    }

    // Vérification que l'email est valide
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez entrer une adresse email valide.',
      });
    }

    // Génération du numéro de demande
    const requestNumber = generateRequestNumber();

    // Création de la demande en base de données
    const contactRequest = await ContactRequest.create({
      id: uuidv4(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      message: message.trim(),
      subscribeNewsletter: subscribeNewsletter || false,
      status: 'pending',
      requestNumber: requestNumber,
    });

    console.log(`📝 Demande de contact créée : ${requestNumber}`);

    // Envoi des emails en parallèle (non-blocking)
    const emailDataForClient = {
      firstName: contactRequest.firstName,
      lastName: contactRequest.lastName,
      email: contactRequest.email,
      phone: contactRequest.phone,
      message: contactRequest.message,
      requestNumber: contactRequest.requestNumber,
      subscribeNewsletter: contactRequest.subscribeNewsletter,
    };

    // Lancer les envois d'emails sans attendre
    sendContactConfirmationEmail(emailDataForClient).catch((err) => {
      console.error('Erreur lors de l\'envoi du mail de confirmation:', err);
    });

    sendAdminNotificationEmail(emailDataForClient).catch((err) => {
      console.error('Erreur lors de l\'envoi de la notification admin:', err);
    });

    // Réponse immédiate au client
    return res.status(201).json({
      success: true,
      message: 'Votre demande a bien été envoyée. Un email de confirmation vous a été adressé.',
      data: {
        requestNumber: contactRequest.requestNumber,
        id: contactRequest.id,
        email: contactRequest.email,
        submittedAt: contactRequest.createdAt,
      },
    });
  } catch (error: any) {
    console.error('❌ Erreur lors de la soumission de la demande de contact:', error);

    return res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

/**
 * Récupère toutes les demandes de contact (admin)
 * GET /api/contact/list
 */
export async function getContactRequests(req: Request, res: Response) {
  try {
    // TODO: Ajouter une vérification d'authentification admin
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await ContactRequest.findAndCountAll({
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération des demandes:', error);

    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des demandes.',
    });
  }
}

/**
 * Récupère une demande de contact spécifique
 * GET /api/contact/:id
 */
export async function getContactRequestById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const contactRequest = await ContactRequest.findByPk(id);

    if (!contactRequest) {
      return res.status(404).json({
        success: false,
        message: 'Demande de contact non trouvée.',
      });
    }

    // Marquer comme lue
    if (contactRequest.status === 'pending') {
      await contactRequest.update({ status: 'read' });
    }

    return res.status(200).json({
      success: true,
      data: contactRequest,
    });
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération de la demande:', error);

    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la demande.',
    });
  }
}

/**
 * Met à jour le statut d'une demande de contact
 * PATCH /api/contact/:id/status
 */
export async function updateContactRequestStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'read', 'responded'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide. Les statuts valides sont: pending, read, responded.',
      });
    }

    const contactRequest = await ContactRequest.findByPk(id);

    if (!contactRequest) {
      return res.status(404).json({
        success: false,
        message: 'Demande de contact non trouvée.',
      });
    }

    await contactRequest.update({ status });

    return res.status(200).json({
      success: true,
      message: 'Statut de la demande mis à jour.',
      data: contactRequest,
    });
  } catch (error: any) {
    console.error('❌ Erreur lors de la mise à jour du statut:', error);

    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut.',
    });
  }
}

/**
 * Supprime une demande de contact
 * DELETE /api/contact/:id
 */
export async function deleteContactRequest(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const contactRequest = await ContactRequest.findByPk(id);

    if (!contactRequest) {
      return res.status(404).json({
        success: false,
        message: 'Demande de contact non trouvée.',
      });
    }

    await contactRequest.destroy();

    return res.status(200).json({
      success: true,
      message: 'Demande de contact supprimée.',
    });
  } catch (error: any) {
    console.error('❌ Erreur lors de la suppression de la demande:', error);

    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la demande.',
    });
  }
}

/**
 * Crée et envoie une réponse à une demande de contact
 * POST /api/contact/:id/respond
 */
export async function respondToContactRequest(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { adminName, response } = req.body;

    // Validation
    if (!adminName || !response) {
      return res.status(400).json({
        success: false,
        message: 'Le nom de l\'administrateur et la réponse sont requis.',
      });
    }

    if (response.length < 10 || response.length > 5000) {
      return res.status(400).json({
        success: false,
        message: 'La réponse doit contenir entre 10 et 5000 caractères.',
      });
    }

    // Récupérer la demande de contact
    const contactRequest = await ContactRequest.findByPk(id);

    if (!contactRequest) {
      return res.status(404).json({
        success: false,
        message: 'Demande de contact non trouvée.',
      });
    }

    // Créer la réponse en base de données
    const contactResponse = await ContactResponse.create({
      id: uuidv4(),
      contactRequestId: id,
      adminName: adminName.trim(),
      response: response.trim(),
    });

    console.log(`📬 Réponse créée pour demande ${contactRequest.requestNumber}`);

    // Envoyer l'email de réponse au client
    const emailData = {
      clientFirstName: contactRequest.firstName,
      clientEmail: contactRequest.email,
      requestNumber: contactRequest.requestNumber,
      adminName: adminName,
      adminResponse: response,
      originMessage: contactRequest.message,
    };

    sendContactResponseEmail(emailData).catch((err) => {
      console.error('Erreur lors de l\'envoi de l\'email de réponse:', err);
    });

    // Mettre à jour le statut de la demande à "responded"
    await contactRequest.update({ status: 'responded' });

    return res.status(201).json({
      success: true,
      message: 'Votre réponse a été envoyée au client.',
      data: {
        responseId: contactResponse.id,
        contactRequestId: contactRequest.id,
        clientEmail: contactRequest.email,
        sentAt: contactResponse.createdAt,
      },
    });
  } catch (error: any) {
    console.error('❌ Erreur lors de l\'envoi de la réponse:', error);

    return res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de l\'envoi de la réponse.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

/**
 * Récupère les réponses d'une demande de contact
 * GET /api/contact/:id/responses
 */
export async function getContactResponses(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const contactRequest = await ContactRequest.findByPk(id, {
      include: {
        association: 'responses',
        order: [['createdAt', 'DESC']],
      },
    });

    if (!contactRequest) {
      return res.status(404).json({
        success: false,
        message: 'Demande de contact non trouvée.',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        contactRequest,
        responses: contactRequest.get('responses') || [],
      },
    });
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération des réponses:', error);

    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des réponses.',
    });
  }
}

/**
 * Récupère toutes les réponses envoyées (admin)
 * GET /api/contact/responses/all
 */
export async function getAllResponses(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await ContactResponse.findAndCountAll({
      offset,
      limit,
      include: {
        association: 'contactRequest',
      },
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération des réponses:', error);

    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des réponses.',
    });
  }
}
