import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const EMAIL_FROM = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'no-reply@jojma.com';

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }

  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  return transporter;
};

const sendPasswordResetEmail = async (to: string, resetUrl: string, fullName?: string) => {
  const transporter = createTransporter();

  const subject = 'Réinitialisation de votre mot de passe JOJMA';
  const html = `
    <div style="font-family: Arial, sans-serif; color: #111;">
      <h2 style="color:#1a3683">Réinitialisation de votre mot de passe</h2>
      <p>Bonjour ${fullName || ''},</p>
      <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe (valide 1 heure):</p>
      <p><a href="${resetUrl}" style="background:#1a3683;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;">Réinitialiser mon mot de passe</a></p>
      <p>Si vous n'avez pas demandé cette opération, ignorez simplement cet email.</p>
      <hr/>
      <p style="font-size:12px;color:#666;">Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur:<br/>${resetUrl}</p>
    </div>
  `;

  if (!transporter) {
    // Fallback for development: write to a local file and log
    const debugDir = path.join(process.cwd(), 'tmp_emails');
    try {
      if (!fs.existsSync(debugDir)) fs.mkdirSync(debugDir);
      const filename = path.join(debugDir, `password-reset-${Date.now()}.txt`);
      fs.writeFileSync(filename, `To: ${to}\nSubject: ${subject}\nURL: ${resetUrl}`);
    } catch (e) {
      // ignore
    }
    console.log(`[EmailService] Password reset link for ${to}: ${resetUrl}`);
    return;
  }

  await transporter.sendMail({
    from: EMAIL_FROM,
    to,
    subject,
    html,
  });
};

export default { sendPasswordResetEmail };
