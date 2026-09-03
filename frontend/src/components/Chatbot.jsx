import React, { useEffect, useRef, useState } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { api, trackClick } from "../lib/api";

const WELCOME = "Hi! I'm the VOKTAA Assistant 👋 Ask me anything about our programmes, how to book a demo, or how to partner with us!";
const FALLBACK = "I'm having trouble connecting right now. Please contact us directly at voktaasolutions@gmail.com or call +91 74161 13199.";

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
    try {
      const { data } = await api.post("/chat", { session_id: sessionId.current, message: text });
      setMessages((m) => [...m, { role: "bot", text: data.reply || "…" }]);
    } catch {
      setMessages((m) => [...m, { role: "bot", text: FALLBACK }]);
    } finally {
      setSending(false);
    }
  };

  const toggle = () => {
    if (!open) trackClick("cta", "chatbot-open");
    setOpen((v) => !v);
  };

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={toggle}
        aria-label={open ? "Close chat" : "Open chat"}
        data-testid="chatbot-toggle"
        className="fixed bottom-6 right-24 z-[60] w-14 h-14 rounded-full bg-gold text-navy-deep flex items-center justify-center shadow-[0_10px_30px_rgba(217,162,59,0.45)] hover:scale-110 transition-transform duration-300"
      >
        {open ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat window */}
      {open && (
        <div
          className="fixed z-[65] bg-white rounded-2xl shadow-[0_25px_60px_rgba(11,31,61,0.35)] overflow-hidden flex flex-col
                     bottom-24 right-4 sm:right-24 w-[calc(100vw-2rem)] sm:w-[350px] h-[70vh] sm:h-[500px] max-h-[600px]"
          data-testid="chatbot-window"
        >
          {/* Header */}
          <div className="bg-navy-deep px-4 py-4 flex items-center justify-between border-b border-gold/30">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="VOKTAA" className="h-7 w-auto" />
              <div>
                <p className="text-white font-heading font-bold text-sm leading-tight">VOKTAA Assistant</p>
                <p className="text-gold/80 font-mono text-[9px] uppercase tracking-[0.2em] mt-0.5">Online</p>
              </div>
            </div>
            <button onClick={toggle} aria-label="Close" className="text-white/70 hover:text-gold" data-testid="chatbot-close">
              <X size={18} />
            </button>
          </div>

          {/* Message list */}
          <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-ivory" data-testid="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-navy-deep text-white rounded-2xl rounded-br-sm"
                      : "bg-white text-ink border border-black/5 rounded-2xl rounded-bl-sm shadow-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-white border border-black/5 rounded-2xl rounded-bl-sm shadow-sm">
                  <TypingDots />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={send} className="border-t border-black/10 p-3 flex items-center gap-2 bg-white">
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
              className="w-10 h-10 flex items-center justify-center bg-gold text-navy-deep rounded-full hover:bg-gold-light transition-colors disabled:opacity-40"
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
