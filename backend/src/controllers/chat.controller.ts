import { Request, Response } from "express";
import Conversation from "../modules/Conversation.js";
import ConversationMessage from "../modules/ConversationMessage.js";
import ChatEvent from "../modules/ChatEvent.js";
import {
  detectLeadData,
  generateAssistantReply,
  isMessageAllowed,
} from "../services/ai.service";

export async function chatHandler(req: Request, res: Response) {
  try {
    const {
      message,
      sessionId,
      language = "fr",
      sourcePage = null,
    }: {
      message?: string;
      sessionId?: string;
      language?: string;
      sourcePage?: string | null;
    } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: "Le message est vide.",
      });
    }

    if (!sessionId || !sessionId.trim()) {
      return res.status(400).json({
        success: false,
        error: "sessionId manquant.",
      });
    }

    const safeMessage = message.trim();

    let conversation = await Conversation.findOne({
      where: { sessionId },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        sessionId,
        language,
        sourcePage,
      });
    }

    await ConversationMessage.create({
      conversationId: conversation.id,
      role: "user",
      content: safeMessage,
    });

    await ChatEvent.create({
      conversationId: conversation.id,
      eventType: "message_sent",
      payload: JSON.stringify({
        message: safeMessage,
        language,
        sourcePage,
        userAgent: req.headers["user-agent"] || null,
        ip: req.ip || null,
      }),
    });

    const lead = detectLeadData(safeMessage);
    if (lead.hasLead) {
      await ChatEvent.create({
        conversationId: conversation.id,
        eventType: "lead_detected",
        payload: JSON.stringify(lead),
      });
    }

    if (!isMessageAllowed(safeMessage)) {
      const blockedReply =
        language === "ar"
          ? "أنا متخصص في خدمات JOJMA فقط. يمكنني مساعدتك في تحويل ملفات 3D، الصيغ المدعومة، الواقع المعزز والدعم."
          : language === "en"
          ? "I’m specialized in JOJMA services only. I can help with 3D conversion, supported formats, AR, and support."
          : "Je suis spécialisé dans les services JOJMA. Je peux vous aider sur la conversion 3D, les formats supportés, l’AR et le support.";

      await ConversationMessage.create({
        conversationId: conversation.id,
        role: "assistant",
        content: blockedReply,
      });

      await ChatEvent.create({
        conversationId: conversation.id,
        eventType: "blocked_message",
        payload: JSON.stringify({ message: safeMessage }),
      });

      return res.json({
        success: true,
        reply: blockedReply,
      });
    }

    const historyRows = await ConversationMessage.findAll({
      where: { conversationId: conversation.id },
      order: [["createdAt", "ASC"]],
      limit: Number(process.env.CHATBOT_MAX_HISTORY || 12),
    });

    const history = historyRows
      .filter((row) => row.role === "user" || row.role === "assistant")
      .map((row) => ({
        role: row.role as "user" | "assistant",
        content: row.content,
      }));

    const reply = await generateAssistantReply({
      message: safeMessage,
      history,
      language,
    });

    await ConversationMessage.create({
      conversationId: conversation.id,
      role: "assistant",
      content: reply,
    });

    await ChatEvent.create({
      conversationId: conversation.id,
      eventType: "reply_generated",
      payload: JSON.stringify({ reply }),
    });

    return res.json({
      success: true,
      reply,
    });
  } catch (error: any) {
    console.error("❌ chatHandler error:", error);

    return res.status(500).json({
      success: false,
      error: "Erreur serveur chatbot.",
    });
  }
}