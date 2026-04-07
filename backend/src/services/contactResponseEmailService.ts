import nodemailer from 'nodemailer';
import 'dotenv/config';

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

let transporter: any = null;

if (!emailUser || !emailPass) {
  console.warn('⚠️ SMTP (Response) non configuré : EMAIL_USER / EMAIL_PASS manquants.');
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
      console.error('❌ Erreur de vérification email (Response):', error);
    } else {
      console.log('✅ Service email Response prêt - Connexion réussie');
    }
  });
}

interface ResponseEmailData {
  clientFirstName: string;
  clientEmail: string;
  requestNumber: string;
  adminName: string;
  adminResponse: string;
  originMessage: string;
}

/**
 * Envoie une réponse à une demande de contact
 */
async function sendContactResponseEmail(data: ResponseEmailData): Promise<boolean> {
  if (!transporter) {
    console.warn('⚠️ SMTP non configuré. Impossible d\'envoyer la réponse.');
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
        .response-section {
          background-color: #f9f9f9;
          border-left: 4px solid #1a3683;
          padding: 20px;
          margin: 30px 0;
          border-radius: 4px;
        }
        .response-section h3 {
          color: #1a3683;
          margin-bottom: 15px;
          font-size: 16px;
        }
        .response-text {
          color: #555;
          line-height: 1.8;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        .admin-info {
          font-size: 14px;
          color: #999;
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #eee;
        }
        .request-ref {
          display: inline-block;
          background-color: #e8f4f8;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 13px;
          color: #0a7db7;
          font-weight: 600;
          margin-top: 10px;
        }
        .original-message {
          background-color: #f0f0f0;
          padding: 15px;
          border-radius: 4px;
          margin-top: 20px;
          border-left: 3px solid #ccc;
        }
        .original-message p {
          font-size: 13px;
          color: #666;
          margin-bottom: 10px;
          font-style: italic;
        }
        .original-message .text {
          font-size: 14px;
          color: #333;
          white-space: pre-wrap;
        }
        .footer {
          background-color: #f5f5f5;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #999;
          border-top: 1px solid #eee;
        }
        .cta-button {
          display: inline-block;
          margin-top: 20px;
          padding: 12px 30px;
          background-color: #1a3683;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Votre Réponse est Arrivée ! 📬</h1>
          <p>L'équipe JOJMA a répondu à votre demande</p>
        </div>
        
        <div class="content">
          <p class="greeting">Bonjour ${data.clientFirstName},</p>
          
          <p class="message">
            Merci de votre patience ! L'équipe JOJMA a examiné votre demande et vous envoie une réponse ci-dessous.
          </p>
          
          <div class="response-section">
            <h3>📧 Réponse de ${data.adminName}</h3>
            <p class="response-text">${data.adminResponse}</p>
          </div>

          <div class="admin-info">
            <p><strong>Réponse de :</strong> ${data.adminName}</p>
            <p><strong>Date :</strong> ${new Date().toLocaleDateString('fr-FR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            <div class="request-ref">Numéro de demande: ${data.requestNumber}</div>
          </div>

          <div class="original-message">
            <p><strong>Votre message initial :</strong></p>
            <div class="text">${data.originMessage}</div>
          </div>

          <p class="message" style="margin-top: 30px; color: #666; font-size: 14px;">
            Si vous avez d'autres questions, n'hésitez pas à nous contacter via le formulaire de contact. Nous sommes là pour vous aider. 
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #999; font-size: 12px;">
              Cordialement,<br><strong>L'équipe JOJMA</strong><br>
              Augmented Reality Solutions<br>
              +212 660 339 034 | Augmentedrealitymaroc@gmail.com
            </p>
          </div>
        </div>

        <div class="footer">
          <p>© 2026 JOJMA - Tous droits réservés</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `JOJMA Support <${emailUser}>`,
      to: data.clientEmail,
      subject: `Réponse à votre demande - Ticket #${data.requestNumber}`,
      html: htmlContent,
    });

    console.log(`✅ Réponse envoyée à ${data.clientEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de la réponse:', error);
    return false;
  }
}

export { sendContactResponseEmail };
