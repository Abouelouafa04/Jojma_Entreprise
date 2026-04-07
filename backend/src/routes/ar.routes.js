import express from "express";
import uploadAR from "../middlewares/uploadAR.middleware.js";
import { uploadARFile, healthAR, sendEmailLink, publicBase } from "../controllers/ar.controller.js";

const router = express.Router();

router.get("/health", healthAR);
router.get("/public-base", publicBase);
router.post("/upload", uploadAR.single("file"), uploadARFile);
router.post("/send-email", sendEmailLink);

export default router;