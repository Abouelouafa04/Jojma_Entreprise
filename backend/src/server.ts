import "dotenv/config";
import "./modules/Conversation.js";
import "./modules/ConversationMessage.js";
import "./modules/ChatEvent.js";
import "./modules/contact/contact.model.js";
import "./modules/contact/contact-response.model.js";
// Ensure Sequelize registers models before sync({ alter: true })
import "./modules/models3d/model3d.model.ts";
import "./modules/conversionJobs/conversionJob.model.ts";
import "./modules/publicShare/experience.model.ts";
import "./modules/publicShare/experienceEvent.model.ts";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import app from "./app";
import { sequelize } from "./config/database";
import { seedDatabase } from "./config/init";
import { verifyEmailConfig } from "./services/verificationEmailService";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const PORT: number = Number(process.env.PORT) || 5000;

  try {
    await sequelize.authenticate();
    console.log("✅ Connexion DB établie.");
    // IMPORTANT: sync({ alter: true }) can break on existing MySQL schemas (index limit).
    // We default to safe sync (create missing tables) and allow alter via env.
    const alter = process.env.DB_SYNC_ALTER === "true";
    await sequelize.sync({ alter });
    await seedDatabase();
  } catch (err) {
    console.warn("⚠️ DB non connectée. Le backend fonctionnera mais les requêtes DB échoueront.");
    console.warn(err);
  }

  await verifyEmailConfig();

  if (process.env.NODE_ENV === "production") {
    const distPath = path.resolve(__dirname, "../../dist");
    app.use(express.static(distPath));

    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 API server running on http://localhost:${PORT}`);
    if (process.env.NODE_ENV !== "production") {
      console.log("💡 Frontend dev server: run `npm run dev` at the repo root (http://localhost:5173).");
    }
  });
}

startServer();