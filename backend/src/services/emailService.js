import "dotenv/config";
import nodemailer from "nodemailer";

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

let transporter = null;

if (!emailUser || !emailPass) {
  console.warn("⚠️ SMTP (QR) non configuré : EMAIL_USER / EMAIL_PASS manquants.");
} else {
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  transporter.verify(function (error) {
    if (error) {
      console.error("❌ Erreur de vérification email (QR):", error);
    } else {
      console.log("✅ Service email QR prêt - Connexion réussie");
    }
  });
}

// Template HTML professionnel pour l'email
function generateEmailTemplate(qrUrl, fileName, platform) {
  const platformName = platform === "iphone" ? "iPhone" : "Android";

  return `
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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }
        
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }
        
        .header {
          background: linear-gradient(135deg, #243f99 0%, #2848aa 100%);
          color: #ffffff;
          padding: 40px 30px;
          text-align: center;
        }
        
        .header-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 10px;
        }
        
        .header-subtitle {
          font-size: 16px;
          opacity: 0.9;
        }
        
        .content {
          padding: 40px 30px;
        }
        
        .greeting {
          font-size: 18px;
          color: #243f99;
          margin-bottom: 20px;
          font-weight: 500;
        }
        
        .description {
          font-size: 16px;
          color: #555555;
          line-height: 1.8;
          margin-bottom: 30px;
        }
        
        .qr-section {
          background: #f8f9ff;
          border: 2px solid #e0e7ff;
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          margin: 30px 0;
        }
        
        .qr-label {
          font-size: 14px;
          color: #667eea;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 15px;
        }
        
        .qr-image {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
        }
        
        .file-info {
          background: #f0f4ff;
          border-left: 4px solid #667eea;
          padding: 20px;
          margin: 25px 0;
          border-radius: 8px;
        }
        
        .file-info-title {
          font-weight: 600;
          color: #243f99;
          margin-bottom: 8px;
          font-size: 14px;
        }
        
        .file-info-text {
          color: #555555;
          font-size: 14px;
          line-height: 1.6;
        }
        
        .instructions {
          background: #fff9e6;
          border: 1px solid #ffe6b3;
          border-radius: 8px;
          padding: 20px;
          margin: 25px 0;
        }
        
        .instructions-title {
          font-weight: 600;
          color: #cc7900;
          margin-bottom: 12px;
          font-size: 15px;
        }
        
        .instructions-list {
          color: #555555;
          font-size: 14px;
          line-height: 1.8;
          list-style: none;
          padding-left: 0;
        }
        
        .instructions-list li {
          margin-bottom: 10px;
          padding-left: 20px;
          position: relative;
        }
        
        .instructions-list li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #667eea;
          font-weight: bold;
        }
        
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          text-decoration: none;
          padding: 14px 32px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          margin-top: 20px;
          transition: transform 0.2s;
        }
        
        .cta-button:hover {
          transform: translateY(-2px);
        }
        
        .footer {
          background: #f8f9fa;
          padding: 25px 30px;
          text-align: center;
          border-top: 1px solid #e0e0e0;
        }
        
        .footer-text {
          font-size: 13px;
          color: #777777;
          line-height: 1.6;
          margin: 8px 0;
        }
        
        .footer-link {
          color: #667eea;
          text-decoration: none;
        }
        
        .footer-link:hover {
          text-decoration: underline;
        }
        
        .separator {
          height: 1px;
          background: #e0e0e0;
          margin: 20px 0;
        }
        
        .platform-badge {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="header-title">🎯 Expérience AR Prête</div>
          <div class="header-subtitle">Votre modèle 3D en Réalité Augmentée</div>
        </div>
        
        <div class="content">
          <div class="greeting">Bonjour 👋</div>
          
          <div class="description">
            Vous avez reçu un lien pour accéder à un modèle 3D en Réalité Augmentée. 
            Scannez le code QR ci-dessous avec votre appareil <strong>${platformName}</strong> 
            pour vivre une expérience immersive.
          </div>
          
          <div class="qr-section">
            <div class="qr-label">Scannez ce code QR</div>
            <img src="cid:qrCode" alt="QR Code" class="qr-image" width="300">
          </div>
          
          <div class="file-info">
            <div class="file-info-title">📦 Détails du Fichier</div>
            <div class="file-info-text">
              <strong>Nom :</strong> ${fileName}<br>
              <strong>Plateforme :</strong> <span class="platform-badge">${platformName}</span>
            </div>
          </div>
          
          <div class="instructions">
            <div class="instructions-title">📱 Comment utiliser</div>
            <ul class="instructions-list">
              <li>Ouvrez votre appareil ${platformName}</li>
              <li>Ouvrez l'appareil photo ou une application de scan QR</li>
              <li>Scannez le code QR ci-dessus</li>
              <li>Suivez le lien pour voir le modèle 3D en AR</li>
              <li>Positionnez votre appareil pour explorer le modèle</li>
            </ul>
          </div>
          
          <div class="separator"></div>
          
          <div class="description" style="font-size: 14px; color: #777777;">
            <strong>💡 Conseil :</strong> Pour une meilleure expérience, utilisez un appareil 
            bien éclairé et assurez-vous que le code QR est clairement visible.
          </div>
        </div>
        
        <div class="footer">
          <div class="footer-text">
            <strong>Réalité Augmentée</strong>
          </div>
          <div class="footer-text">
            Transformez vos modèles 3D en expériences AR immersives
          </div>
          <div class="separator"></div>
          <div class="footer-text">
            Si vous avez des questions, <a href="mailto:support@example.com" class="footer-link">contactez-nous</a>
          </div>
          <div class="footer-text">
            © 2024 Réalité Augmentée. Tous droits réservés.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Envoyer un lien QR par email
 * @param {string} recipientEmail - Email du destinataire
 * @param {string} qrImageBase64 - Image QR encodée en base64
 * @param {string} qrUrl - URL du QR code
 * @param {string} fileName - Nom du fichier 3D
 * @param {string} platform - Plateforme (android ou iphone)
 * @returns {Promise<object>} - Résultat de l'envoi
 */
async function sendQREmailLink(recipientEmail, qrImageBase64, qrUrl, fileName, platform) {
  try {
    if (!transporter || !emailUser || !emailPass) {
      return {
        success: false,
        message: "Configuration email non disponible. Veuillez configurer les variables d'environnement EMAIL_USER et EMAIL_PASS.",
      };
    }

    const htmlContent = generateEmailTemplate(qrUrl, fileName, platform);

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: recipientEmail,
      subject: `🎯 Votre modèle 3D en Réalité Augmentée - ${fileName}`,
      html: htmlContent,
      attachments: qrImageBase64 ? [
        {
          filename: "qr-code.png",
          content: Buffer.from(qrImageBase64, "base64"),
          cid: "qrCode",
        },
      ] : [],
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email envoyé avec succès :", info.messageId);

    return {
      success: true,
      message: "Email envoyé avec succès",
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email :");
    console.error("   Code:", error.code);
    console.error("   Message:", error.message);
    console.error("   Response:", error.response);

    if (error.message.includes("Invalid login")) {
      console.error("   → Problème d'authentification Gmail");
      return {
        success: false,
        message: "Authentification Gmail échouée. Vérifiez EMAIL_USER et EMAIL_PASS.",
      };
    }

    if (error.code === "EAUTH") {
      console.error("   → Erreur d'authentification SMTP");
      return {
        success: false,
        message: "Erreur d'authentification. Vérifiez vos credentials.",
      };
    }

    return {
      success: false,
      message: "Erreur lors de l'envoi de l'email.",
      error: error.message,
    };
  }
}

export { sendQREmailLink };
