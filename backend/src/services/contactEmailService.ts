import nodemailer from 'nodemailer';
import 'dotenv/config';

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

let transporter: any = null;

if (!emailUser || !emailPass) {
  console.warn('⚠️ SMTP (Contact) non configuré : EMAIL_USER / EMAIL_PASS manquants.');
} else {
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  transporter.verify(function (error: any) {
    if (error) {
      console.error('❌ Erreur de vérification email (Contact):', error);
    } else {
      console.log('✅ Service email Contact prêt - Connexion réussie');
    }
  });
}

interface ContactEmailData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  requestNumber: string;
  subscribeNewsletter: boolean;
}

/**
 * Envoie un email de confirmation au client après soumission du formulaire de contact
 */
async function sendContactConfirmationEmail(data: ContactEmailData): Promise<boolean> {
  if (!transporter) {
    console.warn('⚠️ SMTP non configuré. Impossible d\'envoyer l\'email de confirmation.');
    return false;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background-color: #f5f5f5;
          padding: 20px;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #1a3683 0%, #2c5aa0 100%);
          padding: 30px;
          color: white;
          text-align: center;
        }
        .header h1 {
          font-size: 28px;
          margin-bottom: 5px;
          font-weight: 600;
        }
        .header p {
          font-size: 14px;
          opacity: 0.9;
        }
        .content {
          padding: 40px 30px;
          color: #333;
        }
        .greeting {
          font-size: 18px;
          margin-bottom: 20px;
          font-weight: 500;
        }
        .message {
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 30px;
          color: #555;
        }
        .request-details {
          background-color: #f9f9f9;
          border-left: 4px solid #1a3683;
          padding: 20px;
          margin: 30px 0;
          border-radius: 4px;
        }
        .detail-row {
          display: flex;
          margin-bottom: 12px;
          font-size: 14px;
        }
        .detail-label {
          font-weight: 600;
          color: #1a3683;
          min-width: 120px;
        }
        .detail-value {
          color: #666;
          flex: 1;
          word-break: break-word;
        }
        .footer-text {
          font-size: 14px;
          line-height: 1.6;
          color: #777;
          margin-top: 20px;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
        .cta-button {
          display: inline-block;
          margin-top: 30px;
          padding: 12px 30px;
          background-color: #1a3683;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          text-align: center;
        }
        .cta-button:hover {
          background-color: #2c5aa0;
        }
        .signature {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          font-size: 14px;
          color: #999;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Merci de nous avoir contactés ! 🎉</h1>
          <p>Votre demande a bien été reçue par notre équipe</p>
        </div>
        
        <div class="content">
          <p class="greeting">Bonjour ${data.firstName},</p>
          
          <p class="message">
            Merci de nous avoir contactés via le formulaire de contact de notre plateforme. Nous avons bien reçu votre demande et notre équipe va l'examiner en détail.
          </p>
          
          <p class="message">
            Nous vous répondrons dans les plus brefs délais, généralement dans les 24 à 48 heures.
          </p>
          
          <div class="request-details">
            <div class="detail-row">
              <span class="detail-label">Numéro de demande :</span>
              <span class="detail-value"><strong>${data.requestNumber}</strong></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Temps de réception :</span>
              <span class="detail-value">${new Date().toLocaleDateString('fr-FR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email :</span>
              <span class="detail-value">${data.email}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Téléphone :</span>
              <span class="detail-value">${data.phone}</span>
            </div>
          </div>
          
          <p class="footer-text">
            <strong>Statut de votre demande :</strong> En cours de traitement<br>
            Vous recevrez une notification par email dès que nous aurons une réponse à votre demande.
          </p>
          
          ${data.subscribeNewsletter ? `
            <p class="footer-text" style="background-color: #e8f4f8; padding: 15px; border-radius: 4px; border-left: 4px solid #0a9fd8;">
              ✉️ <strong>Merci de votre intérêt !</strong> Vous êtes maintenant abonné à notre newsletter. Restez connecté pour les dernières tendances en réalité augmentée.
            </p>
          ` : ''}
          
          <div class="signature">
            <p>Cordialement,<br><strong>L'équipe JOJMA</strong></p>
            <p style="margin-top: 10px; font-size: 12px;">
              JOJMA - Augmented Reality<br>
              Casablanca, Maroc<br>
              +212 660 339 034 | Augmentedrealitymaroc@gmail.com
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `JOJMA <${emailUser}>`,
      to: data.email,
      subject: `Nous avons bien reçu votre demande - Ticket #${data.requestNumber}`,
      html: htmlContent,
    });

    console.log(`✅ Email de confirmation envoyé à ${data.email}`);
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    return false;
  }
}

/**
 * Envoie une notification à l'administrateur pour une nouvelle demande de contact
 */
async function sendAdminNotificationEmail(data: ContactEmailData): Promise<boolean> {
  if (!transporter) {
    console.warn('⚠️ SMTP non configuré. Impossible d\'envoyer la notification admin.');
    return false;
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'Augmentedrealitymaroc@gmail.com';

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #ddd;
        }
        h2 {
          color: #1a3683;
          border-bottom: 2px solid #1a3683;
          padding-bottom: 10px;
        }
        .info {
          margin: 15px 0;
          padding: 10px;
          background-color: #f9f9f9;
        }
        strong {
          color: #1a3683;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>🔔 Nouvelle Demande de Contact</h2>
        
        <div class="info">
          <p><strong>Numéro :</strong> ${data.requestNumber}</p>
          <p><strong>Nom :</strong> ${data.firstName} ${data.lastName}</p>
          <p><strong>Email :</strong> ${data.email}</p>
          <p><strong>Téléphone :</strong> ${data.phone}</p>
          <p><strong>Date :</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
          <p><strong>Newsletter :</strong> ${data.subscribeNewsletter ? 'Oui' : 'Non'}</p>
        </div>
        
        <h3>Message :</h3>
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 4px; white-space: pre-wrap;">
          ${data.message}
        </div>
        
        <p style="margin-top: 20px; font-size: 12px; color: #999;">
          Connectez-vous au tableau de bord pour répondre à cette demande.
        </p>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `JOJMA System <${emailUser}>`,
      to: adminEmail,
      subject: `[CONTACT] Nouvelle demande - ${data.firstName} ${data.lastName}`,
      html: htmlContent,
    });

    console.log(`✅ Notification admin envoyée à ${adminEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de la notification admin:', error);
    return false;
  }
}

export { sendContactConfirmationEmail, sendAdminNotificationEmail };
