import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageCircle,
  X,
  Send,
  Minus,
  Bot,
  ChevronRight,
} from "lucide-react";
import { cn } from "../utils/utils";
import { useLanguage } from "../utils/LanguageContext";

interface Message {
  id: string;
  text: string;
  sender: "bot" | "user";
  timestamp: Date;
}

function getOrCreateSessionId() {
  const key = "jojma_chat_session_id";
  let sessionId = localStorage.getItem(key);

  if (!sessionId) {
    sessionId =
      "sess_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(key, sessionId);
  }

  return sessionId;
}

export default function ChatbotWidget() {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: t("chatbot.welcome"),
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const QUICK_QUESTIONS = [
    t("chatbot.q1"),
    t("chatbot.q2"),
    t("chatbot.q3"),
    t("chatbot.q4"),
    t("chatbot.q5"),
    t("chatbot.q6"),
    t("chatbot.q7"),
  ];

  const QUICK_RESPONSES: Record<string, string> = {
    [t("chatbot.q7")]: t("chatbot.q7_response"),
  };

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === "1") {
        return [
          {
            ...prev[0],
            text: t("chatbot.welcome"),
          },
        ];
      }
      return prev;
    });
  }, [language, t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const addBotMessage = (text: string) => {
    const botMessage: Message = {
      id: (Date.now() + Math.random()).toString(),
      text,
      sender: "bot",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const sessionId = getOrCreateSessionId();

      const apiBase =
        (import.meta.env.VITE_API_BASE_URL as string) ||
        (import.meta.env.VITE_API_URL as string) ||
        '/api';
      const endpoint = `${apiBase.replace(/\/$/, '')}/chat`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          sessionId,
          language,
          sourcePage: window.location.pathname,
        }),
      });

      if (!response.ok) {
        const txt = await response.text().catch(() => '');
        throw new Error(`API ${response.status}: ${txt || response.statusText}`);
      }

      const contentType = response.headers.get('content-type') || '';
      let data: any;
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const txt = await response.text().catch(() => '');
        throw new Error(`API ${response.status}: ${txt || 'Non-JSON response'}`);
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Erreur chatbot');
      }

      addBotMessage(data.reply || t('chatbot.default_a'));
    } catch (error) {
      console.error("Chatbot error:", error);
      addBotMessage(
        language === "ar"
          ? "حدث خطأ. حاول مرة أخرى."
          : language === "en"
          ? "An error occurred. Please try again."
          : "Une erreur est survenue. Veuillez réessayer."
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const preset = QUICK_RESPONSES[text];
    if (preset) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      setIsTyping(true);

      window.setTimeout(() => {
        addBotMessage(preset);
        setIsTyping(false);
      }, 300);
      return;
    }

    void sendMessage(text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-[380px] max-w-[calc(100vw-48px)] bg-white/95 backdrop-blur-xl rounded-[32px] shadow-[0_25px_80px_rgba(15,23,42,0.18)] border border-slate-200/80 overflow-hidden flex flex-col h-[540px]"
          >
            <div className="bg-gradient-to-r from-slate-950 via-[#1a3683] to-[#0f4bc2] p-5 text-white flex items-center justify-between shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm tracking-[0.08em] uppercase">
                    JOJMA Assistant
                  </h3>
                  <p className="text-[11px] text-slate-200 mt-1 max-w-[220px] leading-snug">
                    Votre expert 3D & AR pour des actions concrètes.
                  </p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                    <span className="text-[10px] text-indigo-100 font-medium">
                      {t("chatbot.online")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Minus size={18} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-white/95 to-slate-50/95">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex w-full",
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-line",
                      msg.sender === "user"
                        ? "bg-[#1a3683] text-white rounded-tr-none"
                        : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                    )}
                  >
                    {msg.text}
                    <div
                      className={cn(
                        "text-[10px] mt-1.5 opacity-60",
                        msg.sender === "user" ? "text-right" : "text-left"
                      )}
                    >
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {messages.length === 1 && !isTyping && (
              <div className="p-4 bg-white/95 border-t border-slate-200/80">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 px-1">
                  {t("chatbot.faq_title")}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {QUICK_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(q)}
                      className="text-xs bg-slate-50 hover:bg-[#f0f7ff] text-slate-700 hover:text-[#1a3683] border border-slate-200 px-4 py-3 rounded-2xl transition-all duration-200 text-left flex items-center gap-1.5 group shadow-sm"
                    >
                      {q}
                      <ChevronRight
                        size={12}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 bg-white border-t border-slate-100">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }}
                className="relative"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={t("chatbot.placeholder")}
                  className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#1a3683] focus:border-[#1a3683] transition-all outline-none text-sm font-medium"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#1a3683] text-white rounded-xl flex items-center justify-center hover:bg-indigo-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              </form>
              <p className="text-[10px] text-center text-slate-400 mt-3 font-medium">
                {t("chatbot.powered")}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500",
          isOpen ? "bg-white text-[#1a3683] rotate-90" : "bg-[#1a3683] text-white"
        )}
      >
        {isOpen ? <X size={32} /> : <MessageCircle size={32} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#00d1ff] rounded-full border-2 border-white"></span>
        )}
      </motion.button>
    </div>
  );
}