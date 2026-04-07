import "dotenv/config";
import nodemailer from "nodemailer";

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

let transporter: nodemailer.Transporter | null = null;

console.log("EMAIL_USER =", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists =", !!process.env.EMAIL_PASS);

if (!emailUser || !emailPass) {
  console.warn("⚠️ SMTP non configuré : EMAIL_USER / EMAIL_PASS manquants. Les emails de vérification ne seront pas envoyés.");
} else {
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
}

export const sendVerificationEmail = async (to: string, verificationUrl: string, userName: string) => {
  if (!transporter) {
    console.warn(`⚠️ Email de vérification ignoré pour ${to}. SMTP non configuré.`);
    return;
  }

  const mailOptions = {
    from: `"JOJMA" <${emailUser}>`,
    to,
    subject: "Vérifiez votre compte JOJMA",
    html: `
      <h2>Bonjour ${userName},</h2>
      <p>Merci de vous être inscrit sur JOJMA.</p>
      <p>Veuillez cliquer sur le lien suivant pour vérifier votre email :</p>
      <a href="${verificationUrl}">Vérifier mon email</a>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email de vérification envoyé à ${to}`);
  } catch (error) {
    console.error("❌ Erreur envoi email:", error);
    throw error;
  }
};

export const verifyEmailConfig = async () => {
  if (!transporter) {
    console.warn("⚠️ Vérification SMTP ignorée : transporteur non configuré.");
    return false;
  }

  try {
    await transporter.verify();
    console.log("✅ SMTP prêt.");
    return true;
  } catch (error) {
    console.error("❌ Erreur de vérification email:", error);
    return false;
  }
};
