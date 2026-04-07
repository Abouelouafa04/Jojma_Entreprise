import fs from "fs";
import { isAllowedFile } from "../utils/arFileRules.js";
import { formatARUploadResponse } from "../services/arUpload.service.js";
import { sendQREmailLink } from "../services/emailService.js";
import QRCode from "qrcode";
import os from "os";

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return null;
}

function getPublicBaseFromRequest(req) {
  const forwardedProto = req.get("x-forwarded-proto") || req.protocol || "http";
  const host = req.get("x-forwarded-host") || req.get("host") || `localhost:${process.env.PORT || 5000}`;

  if (host.includes("localhost") || host.includes("127.0.0.1")) {
    const localIP = getLocalIP();
    if (localIP) {
      const port = host.split(":")[1] || process.env.PORT || 5000;
      return `${forwardedProto}://${localIP}:${port}`;
    }
  }

  return `${forwardedProto}://${host}`;
}

async function uploadARFile(req, res) {
  try {
    const { platform } = req.body;
    const file = req.file;

    if (!platform) {
      return res.status(400).json({
        success: false,
        message: "La plateforme est obligatoire.",
      });
    }

    if (!["android", "iphone"].includes(platform)) {
      return res.status(400).json({
        success: false,
        message: "Plateforme non valide.",
      });
    }

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Aucun fichier reçu.",
      });
    }

    if (!isAllowedFile(file.originalname, platform)) {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      return res.status(400).json({
        success: false,
        message: "Le fichier ne correspond pas à la plateforme sélectionnée.",
      });
    }

    return res.status(200).json(formatARUploadResponse(req, file, platform));
  } catch (error) {
    console.error("Erreur upload AR :", error);

    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors du traitement du fichier.",
    });
  }
}

function healthAR(_req, res) {
  return res.status(200).json({
    success: true,
    message: "AR service opérationnel",
  });
}

function publicBase(req, res) {
  return res.status(200).json({
    success: true,
    baseUrl: getPublicBaseFromRequest(req),
  });
}

async function sendEmailLink(req, res) {
  try {
    const { email, qrUrl, fileName, platform } = req.body;

    console.log("📧 Requête d'envoi email reçue:");
    console.log("   Email:", email);
    console.log("   Platform:", platform);
    console.log("   FileName:", fileName);
    console.log("   QR URL:", qrUrl ? "✓ Présent" : "✗ Manquant");

    // Validations
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "L'adresse email est obligatoire.",
      });
    }

    if (!qrUrl) {
      return res.status(400).json({
        success: false,
        message: "L'URL du QR code est obligatoire.",
      });
    }

    if (!fileName) {
      return res.status(400).json({
        success: false,
        message: "Le nom du fichier est obligatoire.",
      });
    }

    if (!platform || !["android", "iphone"].includes(platform)) {
      return res.status(400).json({
        success: false,
        message: "La plateforme est invalide.",
      });
    }

    // Validation email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "L'adresse email n'est pas valide.",
      });
    }

    console.log("✓ Toutes les validations passées");

    // Générer l'image QR en base64
    let qrImageBase64 = null;
    try {
      console.log("🔄 Génération du QR code...");
      const qrImage = await QRCode.toDataURL(qrUrl, {
        errorCorrectionLevel: "H",
        type: "image/png",
        width: 300,
        margin: 2,
        color: {
          dark: "#243f99",
          light: "#ffffff",
        },
      });
      // Extraire la partie base64 de "data:image/png;base64,..."
      qrImageBase64 = qrImage.replace(/^data:image\/png;base64,/, "");
      console.log("✓ QR code généré avec succès");
    } catch (qrError) {
      console.warn("⚠️ Erreur génération QR:", qrError.message);
    }

    // Envoyer l'email
    console.log("📨 Envoi de l'email...");
    const emailResult = await sendQREmailLink(
      email,
      qrImageBase64,
      qrUrl,
      fileName,
      platform
    );

    if (!emailResult.success) {
      console.error("❌ Erreur envoi:", emailResult.message);
      return res.status(500).json({
        success: false,
        message: emailResult.message || "Erreur lors de l'envoi de l'email.",
      });
    }

    console.log("✅ Email envoyé avec succès");
    return res.status(200).json({
      success: true,
      message: "Email envoyé avec succès",
      email,
      messageId: emailResult.messageId,
    });
  } catch (error) {
    console.error("❌ Erreur contrôleur sendEmailLink:", error.message);
    console.error("   Stack:", error.stack);

    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de l'envoi de l'email.",
      error: error.message,
    });
  }
}

export { uploadARFile, healthAR, sendEmailLink };
export { publicBase };