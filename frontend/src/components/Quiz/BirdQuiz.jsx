/* ═══════════════════════════════════════════════════════════════
   Feathers Town — Bird Recommendation Quiz
   /components/Quiz/BirdQuiz.jsx

   Drop-in component. Usage:
     import BirdQuiz from "./components/Quiz/BirdQuiz";
     <BirdQuiz parrots={parrots} />
═══════════════════════════════════════════════════════════════ */
import { useState, useCallback, useMemo } from "react";
import { rankParrots, parsePriceNum } from "../../utils/recommendation";

/* ─── WhatsApp helper ────────────────────────────────────────── */
const WA = n =>
  `https://wa.me/919556747518?text=Hi%2C%20I'm%20interested%20in%20${encodeURIComponent(n)}`;

/* ─── Quiz steps definition ─────────────────────────────────── */
const STEPS = [
  {
    id: "budget",
    emoji: "💰",
    question: "What's your budget?",
    subtitle: "We'll only show birds within your range.",
    type: "range",
    options: [
      { label: "Under ₹3,000",   value: 3000  },
      { label: "₹3,000 – ₹8,000", value: 8000  },
      { label: "₹8,000 – ₹20,000", value: 20000 },
      { label: "₹20,000 – ₹50,000", value: 50000 },
      { label: "No limit",        value: 999999 },
    ],
  },
  {
    id: "noise",
    emoji: "🔊",
    question: "How much noise can you handle?",
    subtitle: "Important for apartment dwellers.",
    type: "single",
    options: [
      { label: "Low — whisper quiet 🤫",   value: "Low"    },
      { label: "Medium — some chatter 🗣️", value: "Medium" },
      { label: "High — bring the noise 🎺", value: "High"   },
    ],
  },
  {
    id: "experience",
    emoji: "🎓",
    question: "What's your bird experience?",
    subtitle: "Helps us match the right temperament.",
    type: "single",
    options: [
      { label: "Beginner — first bird 🌱",        value: "Beginner"     },
      { label: "Intermediate — had birds before 🐦", value: "Intermediate" },
      { label: "Expert — seasoned owner 🦅",      value: "Expert"       },
    ],
  },
  {
    id: "purpose",
    emoji: "🎯",
    question: "What do you want most from your bird?",
    subtitle: "Pick the trait that matters most to you.",
    type: "single",
    options: [
      { label: "A talented talker 🗨️",    value: "Talking"    },
      { label: "A cuddly companion 🤗",   value: "Friendly"   },
      { label: "A beautiful showpiece 💎", value: "Decorative" },
    ],
  },
  {
    id: "space",
    emoji: "🏠",
    question: "Where do you live?",
    subtitle: "Larger birds need more room to roam.",
    type: "single",
    options: [
      { label: "Apartment / Flat 🏢",  value: "Apartment" },
      { label: "House with space 🏡", value: "House"     },
    ],
  },
  {
    id: "time",
    emoji: "⏰",
    question: "How much time can you give daily?",
    subtitle: "Some birds need lots of interaction.",
    type: "single",
    options: [
      { label: "Low — 30 min or less ⏱️", value: "Low"  },
      { label: "High — I'm home a lot 🏠", value: "High" },
    ],
  },
];

/* ─── Shared design tokens (match existing app) ─────────────── */
const css = `
@keyframes quizFadeUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
@keyframes quizSlideIn{from{opacity:0;transform:translateX(30px);}to{opacity:1;transform:translateX(0);}}
@keyframes quizPulse{0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,.35);}70%{box-shadow:0 0 0 12px rgba(34,197,94,0);}}
@keyframes confettiFall{from{opacity:1;transform:translateY(-20px) rotate(0deg);}to{opacity:0;transform:translateY(60px) rotate(360deg);}}
@keyframes spinBtn{to{transform:rotate(360deg);}}

/* ── Quiz option buttons ── */
.quiz-opt{
  display:flex;align-items:center;gap:12px;width:100%;
  background:var(--j2);border:1.5px solid rgba(34,197,94,.10);
  border-radius:14px;padding:14px 18px;cursor:pointer;
  font-family:var(--font-b);font-size:14px;font-weight:600;
  color:var(--fog);text-align:left;
  transition:border-color .22s,background .22s,transform .3s cubic-bezier(.34,1.56,.64,1),box-shadow .22s;
}
.quiz-opt:hover{border-color:rgba(34,197,94,.35);background:rgba(34,197,94,.04);transform:translateY(-3px);}
.quiz-opt.sel{border-color:var(--leaf2);background:rgba(34,197,94,.07);color:var(--leaf);box-shadow:0 0 0 4px rgba(34,197,94,.12);}
.quiz-opt .opt-check{width:20px;height:20px;border-radius:50%;border:2px solid var(--j4);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:11px;transition:all .22s;}
.quiz-opt.sel .opt-check{background:var(--leaf2);border-color:var(--leaf2);color:#fff;}

/* ── Progress bar ── */
.quiz-prog-bar{height:4px;border-radius:999px;background:linear-gradient(90deg,var(--leaf),var(--leaf2));transition:width .5s cubic-bezier(.16,1,.3,1);}

/* ── Result card: responsive layout ── */
.result-winner-inner{
  display:flex;
  flex-direction:column;
}
/* Mobile: full image on top, natural height */
.result-winner-img{
  width:100%;
  flex-shrink:0;
  position:relative;
  overflow:hidden;
  border-radius:22px 22px 0 0;
  background:rgba(34,197,94,.05);
}
.result-winner-img img{
  width:100%;
  height:220px;
  object-fit:cover;
  object-position:center 20%;
  display:block;
}
.result-winner-img::after{content:none;}
.result-winner-body{
  flex:1;
  padding:20px 22px 20px;
}

/* Desktop: wide image panel — card is 780px so image gets 300px */
@media(min-width:521px){
  .result-winner-inner{
    flex-direction:row;
  }
  .result-winner-img{
    width:300px;
    flex-shrink:0;
    border-radius:20px 0 0 20px;
    overflow:hidden;
    background:rgba(34,197,94,.05);
  }
  .result-winner-img img{
    width:100%;
    height:100%;
    min-height:280px;
    object-fit:cover;
    object-position:center 20%;
  }
  .result-winner-img::after{content:none;}
}
`;

/* ─── Subcomponents ─────────────────────────────────────────── */
function ProgressBar({ step, total }) {
  const pct = Math.round(((step + 1) / total) * 100);
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "var(--leaf2)" }}>
          Step {step + 1} of {total}
        </span>
        <span style={{ fontSize: 10, fontWeight: 700, color: "var(--mist)" }}>{pct}%</span>
      </div>
      <div style={{ height: 4, background: "var(--j3)", borderRadius: 999, overflow: "hidden" }}>
        <div className="quiz-prog-bar" style={{ width: `${pct}%` }} />
      </div>
      <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 999,
            background: i <= step ? "var(--leaf2)" : "var(--j3)",
            transition: "background .35s",
          }} />
        ))}
      </div>
    </div>
  );
}

function CompatBar({ score, color }) {
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ height: 6, background: "var(--j3)", borderRadius: 999, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 999,
          background: color,
          width: `${score}%`,
          transition: "width 1.2s cubic-bezier(.16,1,.3,1)",
        }} />
      </div>
    </div>
  );
}

function ResultCard({ ranked, onReset, parrots }) {
  const [expanded, setExpanded] = useState(false);
  const top = ranked[0];
  if (!top) return null;

  const WAIco = ({ size = 13 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );

  return (
    <div style={{ animation: "quizFadeUp .6s cubic-bezier(.16,1,.3,1) both" }}>
      {/* Winner card */}
      <div style={{
        background: "linear-gradient(135deg,rgba(22,163,74,.07),rgba(34,197,94,.03))",
        border: "1.5px solid rgba(34,197,94,.25)",
        borderRadius: 24, overflow: "hidden", marginBottom: 20,
      }}>
        {/*
          KEY FIX: replaced the inline flex div with className-based layout.
          On mobile (<520px) the CSS above switches to column, making the image
          span full width (200px tall) above the text body.
        */}
        <div className="result-winner-inner">
          <div className="result-winner-img">
            <img src={top.parrot.image} alt={top.parrot.name} />
          </div>
          <div className="result-winner-body">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2.5, textTransform: "uppercase", color: "var(--leaf2)" }}>🏆 Your Perfect Match</span>
            </div>
            <h3 style={{ fontFamily: "var(--font-d)", fontSize: "clamp(22px,3.5vw,36px)", fontWeight: 500, color: "var(--cream)", lineHeight: 1.1, marginBottom: 4 }}>
              {top.parrot.name}
            </h3>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--leaf)", marginBottom: 10 }}>{top.parrot.price}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{
                padding: "3px 10px", borderRadius: 999, fontSize: 10, fontWeight: 800,
                background: top.bg, border: `1px solid ${top.border}`, color: top.color,
              }}>{top.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--cream)" }}>{top.score}% match</span>
            </div>
            <CompatBar score={top.score} color={top.color} />
            <p style={{ color: "var(--fog)", fontSize: 12.5, lineHeight: 1.75, marginTop: 12, marginBottom: 16 }}>
              {top.reason}
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <a href={`/breed/${top.parrot.slug || top.parrot.id || top.parrot.name?.toLowerCase().replace(/\s+/g, "-")}`} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "linear-gradient(135deg,var(--leaf),var(--leaf2))",
                color: "#fff", padding: "9px 18px", borderRadius: 10, fontSize: 12.5,
                fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-b)",
              }}>View Details →</a>
              <a href={WA(top.parrot.name)} target="_blank" rel="noreferrer" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "linear-gradient(135deg,#1a9b48,#128036)",
                color: "#fff", padding: "9px 16px", borderRadius: 10, fontSize: 12.5,
                fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-b)",
              }}><WAIco /> WhatsApp</a>
            </div>
          </div>
        </div>
      </div>

      {/* Other matches */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setExpanded(e => !e)} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "var(--leaf2)", fontWeight: 700, fontSize: 12.5,
          fontFamily: "var(--font-b)", marginBottom: expanded ? 14 : 0,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          {expanded ? "▲ Hide" : "▼ Show"} other matches ({ranked.length - 1})
        </button>
        {expanded && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 12 }}>
            {ranked.slice(1, 5).map(({ parrot, score, label, color, bg, border }) => (
              <div key={parrot.id} style={{
                background: "var(--j2)", border: "1px solid rgba(34,197,94,.09)",
                borderRadius: 16, overflow: "hidden",
                transition: "transform .3s cubic-bezier(.34,1.56,.64,1), border-color .2s",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                <img src={parrot.image} alt={parrot.name}
                  style={{ width: "100%", height: 100, objectFit: "cover", display: "block" }} />
                <div style={{ padding: "10px 12px" }}>
                  <div style={{ fontFamily: "var(--font-d)", fontSize: 15, fontWeight: 500, color: "var(--cream)", marginBottom: 2 }}>{parrot.name}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--leaf)", marginBottom: 6 }}>{parrot.price}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color, background: bg, border: `1px solid ${border}`, padding: "2px 7px", borderRadius: 999 }}>{label}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--cream)" }}>{score}%</span>
                  </div>
                  <CompatBar score={score} color={color} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={onReset} style={{
        background: "none", border: "1.5px solid var(--j3)", borderRadius: 10,
        padding: "10px 22px", fontFamily: "var(--font-b)", fontSize: 13,
        fontWeight: 600, color: "var(--fog)", cursor: "pointer",
        transition: "border-color .2s, color .2s",
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--leaf2)"; e.currentTarget.style.color = "var(--leaf2)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--j3)"; e.currentTarget.style.color = "var(--fog)"; }}
      >← Retake Quiz</button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Main BirdQuiz Component
═══════════════════════════════════════════════════════════════ */
export default function BirdQuiz({ parrots = [] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [ranked, setRanked] = useState(null);
  const [animDir, setAnimDir] = useState("forward");

  const currentStep = STEPS[step];

  const select = useCallback((id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  }, []);

  const goNext = useCallback(() => {
    if (step < STEPS.length - 1) {
      setAnimDir("forward");
      setStep(s => s + 1);
    } else {
      setLoading(true);
      setTimeout(() => {
        const results = rankParrots(parrots, answers);
        localStorage.setItem("ft_quiz_answers", JSON.stringify(answers));
        setRanked(results);
        setLoading(false);
      }, 900);
    }
  }, [step, answers, parrots]);

  const goBack = useCallback(() => {
    if (step > 0) { setAnimDir("back"); setStep(s => s - 1); }
  }, [step]);

  const reset = useCallback(() => {
    setStep(0); setAnswers({}); setRanked(null); setLoading(false);
  }, []);

  const canNext = !!answers[currentStep?.id];

  return (
    <section id="quiz" style={{
      background: "var(--j1)", padding: "80px 60px",
      position: "relative", overflow: "hidden",
    }}>
      <style>{css}</style>

      {/* Decorative leaf */}
      <svg viewBox="0 0 60 100" style={{ position: "absolute", width: 140, top: "-6%", right: "-2%", transform: "rotate(20deg)", opacity: .045, pointerEvents: "none" }}>
        <path d="M30 0 C60 20 60 80 30 100 C0 80 0 20 30 0Z" fill="#22c55e" />
      </svg>

      {/* Section header */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 11, fontSize: 10, fontWeight: 700, letterSpacing: 3.5, textTransform: "uppercase", color: "var(--leaf2)", marginBottom: 12 }}>
          <span style={{ height: 1, width: 26, background: "linear-gradient(90deg,transparent,var(--leaf2))", display: "inline-block" }} />
          Find Your Bird
          <span style={{ height: 1, width: 26, background: "linear-gradient(90deg,var(--leaf2),transparent)", display: "inline-block" }} />
        </span>
        <h2 style={{ fontFamily: "var(--font-d)", fontSize: "clamp(26px,4vw,54px)", fontWeight: 500, color: "var(--cream)", lineHeight: 1.06, marginBottom: 10 }}>
          Which Parrot Is <span style={{ color: "var(--leaf)", fontStyle: "italic" }}>Right for You?</span>
        </h2>
        <p style={{ color: "var(--fog)", fontSize: 14.5, lineHeight: 1.85, maxWidth: 460, margin: "0 auto" }}>
          Answer 6 quick questions and we'll match you with your perfect feathered companion.
        </p>
      </div>

      {/* Quiz card */}
      <div style={{
        maxWidth: ranked ? 780 : 560, margin: "0 auto",
        background: "var(--j0)", border: "1px solid rgba(34,197,94,.11)",
        borderRadius: 24, padding: ranked ? "28px" : "32px 28px",
        boxShadow: "0 20px 60px rgba(0,0,0,.07)",
        transition: "max-width .4s cubic-bezier(.16,1,.3,1)",
      }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "44px 20px", animation: "quizFadeUp .4s ease both" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              border: "3px solid rgba(34,197,94,.15)",
              borderTop: "3px solid var(--leaf2)",
              margin: "0 auto 20px",
              animation: "spinBtn .7s linear infinite",
            }} />
            <p style={{ fontFamily: "var(--font-d)", fontSize: 22, color: "var(--cream)", fontStyle: "italic" }}>Finding your perfect match…</p>
            <p style={{ fontSize: 12.5, color: "var(--mist)", marginTop: 6 }}>Analysing {parrots.length} birds just for you</p>
          </div>
        ) : ranked ? (
          <ResultCard ranked={ranked} onReset={reset} parrots={parrots} />
        ) : (
          <div key={step} style={{ animation: "quizSlideIn .35s cubic-bezier(.16,1,.3,1) both" }}>
            <ProgressBar step={step} total={STEPS.length} />

            {/* Question */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>{currentStep.emoji}</div>
              <h3 style={{ fontFamily: "var(--font-d)", fontSize: "clamp(18px,2.8vw,26px)", fontWeight: 500, color: "var(--cream)", marginBottom: 6 }}>
                {currentStep.question}
              </h3>
              <p style={{ fontSize: 13, color: "var(--mist)" }}>{currentStep.subtitle}</p>
            </div>

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {currentStep.options.map(opt => {
                const isSelected = answers[currentStep.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    className={`quiz-opt${isSelected ? " sel" : ""}`}
                    onClick={() => select(currentStep.id, opt.value)}
                  >
                    <span className="opt-check">{isSelected ? "✓" : ""}</span>
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div style={{ display: "flex", gap: 10, justifyContent: "space-between" }}>
              <button
                onClick={goBack}
                disabled={step === 0}
                style={{
                  background: "none", border: "1.5px solid var(--j3)", borderRadius: 10,
                  padding: "11px 20px", fontFamily: "var(--font-b)", fontSize: 13,
                  fontWeight: 600, color: step === 0 ? "var(--ghost)" : "var(--fog)",
                  cursor: step === 0 ? "not-allowed" : "pointer",
                  opacity: step === 0 ? .4 : 1, transition: "all .2s",
                }}>← Back</button>
              <button
                onClick={goNext}
                disabled={!canNext}
                style={{
                  flex: 1,
                  background: canNext
                    ? "linear-gradient(135deg,var(--leaf),var(--leaf2))"
                    : "var(--j3)",
                  border: "none", borderRadius: 10,
                  padding: "11px 24px", fontFamily: "var(--font-b)", fontSize: 13.5,
                  fontWeight: 700, color: canNext ? "#fff" : "var(--ghost)",
                  cursor: canNext ? "pointer" : "not-allowed",
                  boxShadow: canNext ? "0 4px 18px rgba(22,163,74,.35)" : "none",
                  transition: "all .25s cubic-bezier(.34,1.56,.64,1)",
                  transform: canNext ? "none" : "none",
                }}
                onMouseEnter={e => canNext && (e.currentTarget.style.transform = "translateY(-3px)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "none")}
              >
                {step === STEPS.length - 1 ? "Find My Bird 🎯" : "Next →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}