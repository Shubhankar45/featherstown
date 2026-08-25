/* ═══════════════════════════════════════════════════════════════
   Feathers Town — Smart Chat Assistant
   /components/ChatAssistant/ChatAssistant.jsx
═══════════════════════════════════════════════════════════════ */
import { useState, useRef, useEffect, useCallback } from "react";
import { detectIntent, extractBudget, filterByIntent, buildChatReply } from "../../utils/recommendation";

const WA = n =>
  `https://wa.me/919556747518?text=Hi%2C%20I'm%20interested%20in%20${encodeURIComponent(n)}`;

const SUGGESTIONS = [
  { label: "🌱 Best beginner bird",   text: "Best beginner bird" },
  { label: "🤫 Low noise birds",      text: "Low noise birds" },
  { label: "💰 Best under ₹5000",    text: "Best bird under ₹5000" },
  { label: "🗨️ Which bird talks more?", text: "Which bird talks more?" },
  { label: "🏡 Good for apartments", text: "Quiet birds for apartments" },
  { label: "💎 Most beautiful",       text: "Most beautiful birds" },
];

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "8px 12px" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: "50%",
          background: "var(--leaf2)",
          animation: `chatBounce .9s ease-in-out ${i * 0.18}s infinite`,
        }} />
      ))}
    </div>
  );
}

function BirdChip({ parrot }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      background: "var(--j0)", border: "1px solid rgba(34,197,94,.15)",
      borderRadius: 12, padding: "8px 10px",
      transition: "transform .25s cubic-bezier(.34,1.56,.64,1), border-color .2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "rgba(34,197,94,.35)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "rgba(34,197,94,.15)"; }}
    >
      <img src={parrot.image} alt={parrot.name}
        style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-d)", fontSize: 14, fontWeight: 500, color: "var(--cream)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {parrot.name}
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--leaf)" }}>{parrot.price}</div>
      </div>
      <a href={WA(parrot.name)} target="_blank" rel="noreferrer"
        onClick={e => e.stopPropagation()}
        style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          background: "linear-gradient(135deg,#1a9b48,#128036)",
          color: "#fff", padding: "5px 10px", borderRadius: 8,
          fontSize: 10.5, fontWeight: 700, textDecoration: "none",
          fontFamily: "var(--font-b)", flexShrink: 0, whiteSpace: "nowrap",
        }}>
        <svg width={10} height={10} viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Ask
      </a>
    </div>
  );
}

const css = `
@keyframes chatSlideUp{from{opacity:0;transform:translateY(20px) scale(.95);}to{opacity:1;transform:translateY(0) scale(1);}}
@keyframes chatFadeIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}
@keyframes chatBounce{0%,80%,100%{transform:scale(0);}40%{transform:scale(1);}}
@keyframes chatPulse{0%{box-shadow:0 0 0 0 rgba(34,197,94,.5);}70%{box-shadow:0 0 0 10px rgba(34,197,94,0);}100%{box-shadow:0 0 0 0 rgba(34,197,94,0);}}
.chat-msg{animation:chatFadeIn .32s cubic-bezier(.16,1,.3,1) both;}
.chat-input{
  flex:1;background:transparent;border:none;outline:none;
  font-family:var(--font-b);font-size:13.5px;color:var(--cream);
}
.chat-input::placeholder{color:var(--ghost);}
.chat-send-btn{
  width:34px;height:34px;border-radius:50%;
  background:linear-gradient(135deg,var(--leaf),var(--leaf2));
  border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;
  flex-shrink:0;color:#fff;font-size:14px;
  box-shadow:0 3px 10px rgba(22,163,74,.35);
  transition:transform .25s cubic-bezier(.34,1.56,.64,1),box-shadow .2s;
}
.chat-send-btn:hover{transform:scale(1.12);box-shadow:0 6px 18px rgba(22,163,74,.45);}
.chat-send-btn:disabled{opacity:.4;cursor:not-allowed;transform:none!important;}
.chat-chip{
  padding:6px 13px;border-radius:999px;font-size:11.5px;font-weight:600;
  border:1.5px solid rgba(34,197,94,.16);background:rgba(34,197,94,.05);
  color:var(--leaf);cursor:pointer;font-family:var(--font-b);white-space:nowrap;
  transition:border-color .18s,background .18s,transform .22s cubic-bezier(.34,1.56,.64,1);
  flex-shrink:0;
}
.chat-chip:hover{border-color:var(--leaf2);background:rgba(34,197,94,.1);transform:translateY(-2px);}
`;

let msgId = 0;

export default function ChatAssistant({ parrots = [] }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: ++msgId,
      from: "bot",
      type: "text",
      text: "👋 Hi! I'm the Feathers Town bird advisor. Ask me anything — or tap a suggestion below!",
    },
  ]);
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (open) { setTimeout(() => inputRef.current?.focus(), 100); setUnread(0); }
  }, [open]);

  const pushMsg = useCallback((msg) => {
    setMessages(prev => [...prev, { id: ++msgId, ...msg }]);
    if (!open) setUnread(u => u + 1);
  }, [open]);

  const handleSend = useCallback((text = input.trim()) => {
    if (!text) return;
    setInput("");
    pushMsg({ from: "user", type: "text", text });
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const intent = detectIntent(text);
      const budget = extractBudget(text);
      const filtered = filterByIntent(parrots, intent, budget);
      const replyText = buildChatReply(intent, filtered, budget);
      pushMsg({ from: "bot", type: "text", text: replyText });
      if (filtered.length) {
        pushMsg({ from: "bot", type: "birds", birds: filtered });
      }
    }, 900 + Math.random() * 400);
  }, [input, parrots, pushMsg]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }, [handleSend]);

  return (
    <>
      <style>{css}</style>

      {/* Floating toggle button — sits just above the back-to-top button */}
      <button
        onClick={() => { setOpen(o => !o); setUnread(0); }}
        aria-label="Open bird advisor chat"
        style={{
          position: "fixed", bottom: 68, right: 28, zIndex: 490,
          width: 52, height: 52, borderRadius: "50%",
          background: open
            ? "linear-gradient(135deg,#e74c3c,#c0392b)"
            : "linear-gradient(135deg,var(--leaf),var(--leaf2))",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: open ? 20 : 24,
          boxShadow: "0 6px 22px rgba(22,163,74,.38)",
          animation: open ? "none" : "chatPulse 2.8s ease-out infinite",
          transition: "background .3s, transform .3s cubic-bezier(.34,1.56,.64,1)",
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
      >
        {open ? "✕" : "🪶"}
        {unread > 0 && !open && (
          <span style={{
            position: "absolute", top: -3, right: -3,
            width: 18, height: 18, borderRadius: "50%",
            background: "#ef4444", color: "#fff",
            fontSize: 9, fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid var(--j0)",
          }}>{unread}</span>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: "fixed", bottom: 130, right: 28, zIndex: 490,
          width: "min(380px, calc(100vw - 40px))",
          background: "var(--j0)",
          border: "1px solid rgba(34,197,94,.18)",
          borderRadius: 20,
          boxShadow: "0 28px 80px rgba(0,0,0,.18), 0 4px 16px rgba(0,0,0,.08)",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          animation: "chatSlideUp .32s cubic-bezier(.16,1,.3,1) both",
          maxHeight: "min(540px, calc(100vh - 200px))",
        }}>

          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg,var(--leaf),var(--leaf2))",
            padding: "14px 16px",
            display: "flex", alignItems: "center", gap: 10,
            flexShrink: 0,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "rgba(255,255,255,.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, flexShrink: 0,
            }}>🦜</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: "#fff" }}>Bird Advisor</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#a3f0b5" }} />
                <span style={{ fontSize: 10.5, color: "rgba(255,255,255,.8)" }}>Online · Feathers Town</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{
              background: "rgba(255,255,255,.15)", border: "none",
              borderRadius: "50%", width: 28, height: 28,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#fff", fontSize: 14,
            }}>✕</button>
          </div>

          {/* Suggestions */}
          <div style={{
            padding: "10px 12px 8px",
            display: "flex", gap: 6, flexWrap: "nowrap",
            overflowX: "auto", flexShrink: 0,
            borderBottom: "1px solid rgba(34,197,94,.07)",
            scrollbarWidth: "none",
          }}>
            {SUGGESTIONS.map(s => (
              <button key={s.text} className="chat-chip" onClick={() => handleSend(s.text)}>
                {s.label}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "14px 14px 8px",
            display: "flex", flexDirection: "column", gap: 10,
            scrollbarWidth: "thin", scrollbarColor: "var(--leaf2) transparent",
          }}>
            {messages.map(msg => (
              <div key={msg.id} className="chat-msg" style={{
                display: "flex",
                justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
                flexDirection: "column",
                alignItems: msg.from === "user" ? "flex-end" : "flex-start",
              }}>
                {msg.type === "text" && (
                  <div style={{
                    maxWidth: "82%",
                    background: msg.from === "user"
                      ? "linear-gradient(135deg,var(--leaf),var(--leaf2))"
                      : "var(--j2)",
                    color: msg.from === "user" ? "#fff" : "var(--fog)",
                    border: msg.from === "bot" ? "1px solid rgba(34,197,94,.1)" : "none",
                    borderRadius: msg.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    padding: "10px 14px",
                    fontSize: 13.5, lineHeight: 1.7,
                  }}>
                    {msg.text}
                  </div>
                )}
                {msg.type === "birds" && (
                  <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8, marginTop: 2 }}>
                    {msg.birds.map(p => <BirdChip key={p.id} parrot={p} />)}
                  </div>
                )}
              </div>
            ))}

            {typing && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{
                  background: "var(--j2)", border: "1px solid rgba(34,197,94,.1)",
                  borderRadius: "18px 18px 18px 4px",
                }}>
                  <TypingDots />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div style={{
            padding: "10px 12px",
            borderTop: "1px solid rgba(34,197,94,.08)",
            display: "flex", alignItems: "center", gap: 8,
            background: "var(--j1)", flexShrink: 0,
          }}>
            <input
              ref={inputRef}
              className="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about any bird…"
              style={{
                flex: 1, background: "var(--j2)",
                border: "1.5px solid rgba(34,197,94,.11)",
                borderRadius: 20, padding: "9px 14px",
                fontSize: 13, fontFamily: "var(--font-b)",
                color: "var(--cream)", outline: "none",
                transition: "border-color .2s",
              }}
              onFocus={e => (e.target.style.borderColor = "var(--leaf2)")}
              onBlur={e => (e.target.style.borderColor = "rgba(34,197,94,.11)")}
            />
            <button
              className="chat-send-btn"
              onClick={() => handleSend()}
              disabled={!input.trim() || typing}
              aria-label="Send"
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}