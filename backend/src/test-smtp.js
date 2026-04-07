/**
 * Script de test de connexion SMTP
 * Exécutez: node test-smtp.js
 */

require("dotenv").config();
const nodemailer = require("nodemailer");

console.log("🔍 Test de Connexion SMTP");
console.log("=" .repeat(50));

// Afficher la configuration
console.log("\n📋 Configuration:");
console.log("   SERVICE:", process.env.EMAIL_SERVICE || "gmail");
console.log("   USER:", process.env.EMAIL_USER);
console.log("   PASS:", process.env.EMAIL_PASS ? "✓ Configuré" : "✗ Manquant");
console.log("   FROM:", process.env.EMAIL_FROM);

// Vérifier que les variables sont présentes
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("\n❌ ERREUR: EMAIL_USER ou EMAIL_PASS manquant dans .env");
  process.exit(1);
}

// Créer le transporteur
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

console.log("\n🔄 Vérification de la connexion...\n");

// Tester la connexion
transporter.verify(function (error, success) {
  if (error) {
    console.error("❌ ERREUR DE CONNEXION:");
    console.error("   Code:", error.code);
    console.error("   Message:", error.message);
    console.error("\n💡 Solutions:");
    
    if (error.code === "EAUTH") {
      console.error("   → Erreur d'authentification");
      console.error("   → Vérifiez EMAIL_USER et EMAIL_PASS");
      console.error("   → Pour Gmail: Utilisez un mot de passe d'application");
      console.error("   → Générateur: https://myaccount.google.com/apppasswords");
    } else if (error.code === "CONNREFUSED") {
      console.error("   → Connection refusée par le serveur SMTP");
      console.error("   → Vérifiez votre connexion Internet");
    } else if (error.message.includes("Invalid login")) {
      console.error("   → Login invalide");
      console.error("   → Vérifiez EMAIL_USER et EMAIL_PASS");
      console.error("   → Attention: Ne mettez pas d'espaces dans le mot de passe!");
    }
    
    process.exit(1);
  } else {
    console.log("✅ SUCCÈS: Connexion SMTP établie!");
    console.log("   → Le serveur email est opérationnel");
    
    // Envoyer un email de test
    console.log("\n📧 Envoi d'un email de test...\n");
    
    const testEmail = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Autoenvoyer à soi-même
      subject: "🧪 Test SMTP - Réalité Augmentée",
      html: `
        <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #243f99;">✅ Test SMTP Réussi</h2>
          <p>Bonjour,</p>
          <p>Cet email confirme que la connexion SMTP fonctionne correctement!</p>
          <div style="background: #f0f4ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>Détails du test:</strong>
            <ul>
              <li>Service: <code>${process.env.EMAIL_SERVICE || "gmail"}</code></li>
              <li>Email: <code>${process.env.EMAIL_USER}</code></li>
              <li>Timestamp: ${new Date().toLocaleString()}</li>
            </ul>
          </div>
          <p style="color: #666;">Le système de partage par email est prêt! 🚀</p>
          <p style="font-size: 12px; color: #999;">
            © 2024 Réalité Augmentée - Email de test
          </p>
        </div>
      `,
    };
    
    transporter.sendMail(testEmail, (err, info) => {
      if (err) {
        console.error("❌ ERREUR lors de l'envoi du test:");
        console.error("   Message:", err.message);
        process.exit(1);
      } else {
        console.log("✅ Email de test envoyé avec succès!");
        console.log("   ID Message:", info.messageId);
        console.log("\n📭 Vérifiez votre boîte mail pour confirmer la réception!");
        console.log("\n" + "=".repeat(50));
        console.log("✨ La connexion SMTP est 100% fonctionnelle!");
        console.log("=".repeat(50));
        process.exit(0);
      }
    });
  }
});
