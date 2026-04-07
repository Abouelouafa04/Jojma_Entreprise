import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ALLOWED_TOPICS = [
  "jojma",
  "conversion 3d",
  "format 3d",
  "stl",
  "obj",
  "fbx",
  "ply",
  "glb",
  "gltf",
  "dae",
  "usdz",
  "réalité augmentée",
  "ar",
  "qr code",
  "visualisation 3d",
  "support",
  "compte",
  "abonnement",
  "pricing",
  "tarif",
  "upload",
  "modèle 3d",
];

export function isMessageAllowed(message: string): boolean {
  const text = message.toLowerCase();

  // Petit filtre souple
  return ALLOWED_TOPICS.some((keyword) => text.includes(keyword));
}

export function detectLeadData(message: string) {
  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
  const phoneRegex = /(\+?\d[\d\s\-()]{7,}\d)/;

  const emailMatch = message.match(emailRegex);
  const phoneMatch = message.match(phoneRegex);

  return {
    email: emailMatch?.[0] || null,
    phone: phoneMatch?.[0] || null,
    hasLead: Boolean(emailMatch || phoneMatch),
  };
}

export function buildSystemPrompt(language = "fr") {
  const langInstruction =
    language === "ar"
      ? "Réponds en arabe simple."
      : language === "en"
      ? "Respond in clear English."
      : "Réponds en français clair et professionnel.";

  return `
Tu es JOJMA Assistant, l’assistant officiel de JOJMA.

Ta mission :
- aider les visiteurs à passer à l’action avec les services JOJMA
- guider rapidement sur la conversion 3D, les formats, l’AR, le QR et le partage
- conseiller sur les usages business et les étapes suivantes

Persona :
- premium, calme, moderne, orienté accompagnement
- professionnel sans être robotique
- toujours orienté vers le résultat et l’action

Règles strictes :
- ${langInstruction}
- Réponses en deux parties : une phrase courte puis une question utile pour avancer
- Première partie : phrase claire et orientée action
- Deuxième partie : question engageante qui incite à poursuivre
- Ne jamais inventer une fonctionnalité, un prix, un délai ou une promesse commerciale
- Si une information n’est pas certaine, préciser qu’elle doit être confirmée par l’équipe JOJMA
- Si le message est hors sujet, répondre poliment que tu es spécialisé dans les services JOJMA
- Si l’utilisateur souhaite un devis, un contact ou une démonstration, inviter à partager son email ou téléphone
- Pas de markdown complexe
- Ne dépasses pas trois phrases
`;
}

type HistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function generateAssistantReply(params: {
  message: string;
  history: HistoryMessage[];
  language?: string;
}) {
  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

  const input = [
    {
      role: "system" as const,
      content: buildSystemPrompt(params.language || "fr"),
    },
    ...params.history.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
    {
      role: "user" as const,
      content: params.message,
    },
  ];

  const response = await openai.responses.create({
    model,
    input,
  });

  const text = response.output_text?.trim();

  if (!text) {
    return "Je peux vous aider sur la conversion 3D, les formats, l’AR et le support JOJMA.";
  }

  return sanitizeAssistantReply(text);
}

export function sanitizeAssistantReply(reply: string) {
  let text = reply.trim();

  if (text.length > 900) {
    text = text.slice(0, 900).trim() + "...";
  }

  const forbiddenPhrases = [
    "je garantis",
    "prix exact",
    "100% sûr",
    "toujours disponible",
  ];

  const lower = text.toLowerCase();
  if (forbiddenPhrases.some((phrase) => lower.includes(phrase))) {
    return "Pour cette information, il vaut mieux confirmer directement avec l’équipe JOJMA.";
  }

  return text;
}