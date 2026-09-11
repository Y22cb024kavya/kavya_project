import React, { useEffect, useRef, useState } from "react";
import { X, Send } from "lucide-react";
import { trackClick, trackEvent, searchKnowledgeBase, getCommonConversationResponse, getSyllabusExpertResponse } from "../lib/api";
import Logo from "./Logo";

const WELCOME = "Hi! I'm the VOKTAA Assistant 👋 Ask me anything about our programmes, how to book a demo, or how to partner with us!";

const FAQ_KNOWLEDGE = [
  {
    keywords: ["demo", "book", "trial", "schedule", "register", "join"],
    reply: "You can book a free demo session by visiting our Contact page (/contact) or messaging us directly on WhatsApp at +91 74161 13199!",
  },
  {
    keywords: ["program", "course", "crt", "soft skill", "training", "syllabus", "subject", "learn"],
    reply: "We offer Campus Recruitment Training (CRT), Soft Skills & Spoken English, Public Speaking & Debate, Leadership Development, Corporate Training, and Technical Skills (AI, Python, Cloud). Explore all programmes on our Programs page (/programs)!",
  },
  {
    keywords: ["contact", "email", "phone", "number", "call", "whatsapp", "touch"],
    reply: "You can reach us at voktaasolutions@gmail.com or call / WhatsApp us at +91 74161 13199.",
  },
  {
    keywords: ["location", "address", "city", "where", "guntur", "andhra"],
    reply: "VOKTAA Solutions is located in Guntur, Andhra Pradesh, India. We conduct both offline campus sessions and online training.",
  },
  {
    keywords: ["review", "feedback", "rating", "student", "testimonial"],
    reply: "Read authentic feedback from students, placement officers, and corporate partners on our Reviews page (/reviews)!",
  },
  {
    keywords: ["college", "institution", "university", "corporate", "company", "placement"],
    reply: "We partner with top educational institutions and corporate teams for tailored training programmes. Visit our For Institutions page (/institutions) for details!",
  },
];

const POLITE_FALLBACK = "I'm sorry, I couldn't find information about that. 😊 You can ask me about VOKTAA Solutions, our training programmes, courses, soft skills, placement preparation, or institutions.";

function getBotReply(userText) {
  const lower = userText.toLowerCase();
  for (const item of FAQ_KNOWLEDGE) {
    if (item.keywords.some((kw) => lower.includes(kw))) {
      return item.reply;
    }
  }
  return null;
}

const genSession = () => {
  let s = sessionStorage.getItem("voktaa_chat_sid");
  if (!s) {
    s = "chat_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem("voktaa_chat_sid", s);
  }
  return s;
};

const TypingDots = () => (
  <div className="flex items-center gap-1.5 px-4 py-3">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-2 h-2 bg-gold rounded-full animate-bounce"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </div>
);

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "bot", text: WELCOME }]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);
  const sessionId = useRef(genSession());

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open, sending]);

  const send = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setSending(true);

    trackEvent({
      type: "click",
      category: "chat",
      label: text.slice(0, 120),
      session_id: sessionId.current,
    }).catch(() => {});

    try {
      // PRIORITY 1 — COMMON CONVERSATION
      const commonReply = getCommonConversationResponse(text);
      if (commonReply) {
        setMessages((m) => [...m, { role: "bot", text: commonReply }]);
        return;
      }

      // PRIORITY 2 — SYLLABUS & ACADEMIC PROGRAM EXPERT
      const syllabusReply = getSyllabusExpertResponse(text);
      if (syllabusReply) {
        setMessages((m) => [...m, { role: "bot", text: syllabusReply }]);
        return;
      }

      // PRIORITY 3 — KNOWLEDGE BASE SEARCH
      let reply = await searchKnowledgeBase(text);
      if (reply) {
        setMessages((m) => [...m, { role: "bot", text: reply }]);
        return;
      }

      // PRIORITY 4 — FAQ SEARCH
      const faqReply = getBotReply(text);
      if (faqReply) {
        setMessages((m) => [...m, { role: "bot", text: faqReply }]);
        return;
      }

      // PRIORITY 5 — POLITE FALLBACK
      setMessages((m) => [...m, { role: "bot", text: POLITE_FALLBACK }]);
    } catch {
      const faqReply = getBotReply(text);
      setMessages((m) => [...m, { role: "bot", text: faqReply || POLITE_FALLBACK }]);
    } finally {
      setSending(false);
    }
  };

  const toggle = () => {
    if (!open) trackClick("cta", "chatbot-open");
    setOpen((v) => !v);
  };

const HeadsetAssistantIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
    {/* Headphones headband arc */}
    <path
      d="M26 44 C26 22, 74 22, 74 44"
      fill="none"
      stroke="currentColor"
      strokeWidth="7"
      strokeLinecap="round"
    />
    {/* Left Earcup */}
    <rect x="18" y="38" width="10" height="20" rx="4" fill="currentColor" />
    {/* Right Earcup */}
    <rect x="72" y="38" width="10" height="20" rx="4" fill="currentColor" />
    {/* Person Head */}
    <circle cx="50" cy="44" r="18" fill="currentColor" />
    {/* Shoulders / Body */}
    <path
      d="M20 78 C20 62, 32 58, 50 58 C68 58, 80 62, 80 78 C80 84, 20 84, 20 78 Z"
      fill="currentColor"
    />
  </svg>
);

  return (
    <>
      {/* Floating trigger with Ask Voktaa label */}
      <div className="fixed bottom-4 right-4 sm:right-24 z-[60] flex flex-col items-center gap-1 group">
        <button
          onClick={toggle}
          aria-label={open ? "Close chat" : "Open chat"}
          data-testid="chatbot-toggle"
          className="w-14 h-14 rounded-full bg-gradient-to-r from-[#003366] to-[#157082] text-white flex items-center justify-center shadow-[0_10px_30px_rgba(21,112,130,0.45)] hover:scale-110 transition-transform duration-300 cursor-pointer"
        >
          {open ? (
            <X size={26} />
          ) : (
            <HeadsetAssistantIcon className="w-8 h-8 text-white" />
          )}
        </button>
        <span className="text-[11px] font-bold tracking-wide text-[#003366] bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full shadow-md border border-[#CCE0F5] whitespace-nowrap group-hover:scale-105 transition-all">
          Ask Voktaa
        </span>
      </div>

      {/* Chat window */}
      {open && (
        <div
          className="fixed z-[65] bg-white rounded-2xl shadow-[0_25px_60px_rgba(0,51,102,0.25)] border border-[#CCE0F5] overflow-hidden flex flex-col
                     bottom-24 right-4 sm:right-24 w-[calc(100vw-2rem)] sm:w-[350px] h-[70vh] sm:h-[500px] max-h-[600px]"
          data-testid="chatbot-window"
        >
          {/* Header */}
          <div className="bg-[#003366] px-4 py-4 flex items-center justify-between border-b border-[#002244]">
            <div className="flex items-center gap-3">
              <Logo light className="scale-75 origin-left" />
              <div>
                <p className="text-white font-heading font-bold text-sm leading-tight">VOKTAA Assistant</p>
                <p className="text-[#68CEDB] font-mono text-[9px] uppercase tracking-[0.2em] mt-0.5">Online</p>
              </div>
            </div>
            <button onClick={toggle} aria-label="Close" className="text-white/70 hover:text-white" data-testid="chatbot-close">
              <X size={18} />
            </button>
          </div>

          {/* Message list */}
          <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F0F5FA]" data-testid="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-[#157082] text-white rounded-2xl rounded-br-sm shadow-sm"
                      : "bg-white text-[#333333] border border-[#CCE0F5] rounded-2xl rounded-bl-sm shadow-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#CCE0F5] rounded-2xl rounded-bl-sm shadow-sm">
                  <TypingDots />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={send} className="border-t border-[#CCE0F5] p-3 flex items-center gap-2 bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about VOKTAA…"
              className="input-brand flex-1 px-3 py-2 text-sm"
              disabled={sending}
              data-testid="chatbot-input"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="Send"
              data-testid="chatbot-send"
              className="w-10 h-10 flex items-center justify-center bg-[#157082] text-white rounded-full hover:bg-[#003366] transition-colors disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
