/* ═══════════════════════════════════════════════════
   HERO — Matches reference: full-width headline top,
   image bleeds center, text+CTA bottom-left,
   social proof top-right, chips bottom-right.
   Responsive: stacks to a single column on tablet/mobile,
   offer chips drop the absolute overlay below 641px.
   Top corners + background carry light decorative fill
   on desktop, which retires gracefully on smaller screens.
   Jungle-vibe pass: drifting leaves (dual-direction wind),
   fireflies, vine doodles, palm silhouettes, fern clusters,
   dappled canopy light, fern-wave bottom edge, gentle sway.
   Opacity pass: jungle layers boosted for clearer visibility.
   Responsive jungle pass: tablet/mobile keep a scaled-down
   jungle vibe instead of losing it entirely.
   Mobile pass: adds a gold Subscribe CTA (email capture
   modal, posts to /api/subscribe) that only appears at
   the small-mobile breakpoint, next to WhatsApp.
═══════════════════════════════════════════════════ */
import { useState, useEffect } from "react";
import hero from "../../assets/hero.png";

const CHIPS = [
  { label: "Upto 30% Off", sub: "Lovebirds", color: "#2C813C" },
  { label: "Upto 25% Off", sub: "Cockatiels", color: "#F7A125" },
  { label: "Upto 20% Off", sub: "Parrots", color: "#2C813C" },
];

// Falling-leaf particles for the jungle ambience layer.
// Alternates between two drift directions (leafFallA / leafFallB) so the
// canopy feels like it's catching a real breeze instead of falling uniformly.
const LEAVES = [
  { left: "4%",  delay: 0,    duration: 12, size: 17, emoji: "🍃", drift: "A" },
  { left: "12%", delay: 3.1,  duration: 15, size: 11, emoji: "🍂", drift: "B" },
  { left: "20%", delay: 1.6,  duration: 13, size: 14, emoji: "🍃", drift: "A" },
  { left: "30%", delay: 5.2,  duration: 16, size: 10, emoji: "🌿", drift: "B" },
  { left: "42%", delay: 2.4,  duration: 11, size: 13, emoji: "🍂", drift: "A" },
  { left: "55%", delay: 4.4,  duration: 14, size: 15, emoji: "🍃", drift: "B" },
  { left: "67%", delay: 0.8,  duration: 12, size: 11, emoji: "🌿", drift: "A" },
  { left: "74%", delay: 6.0,  duration: 17, size: 12, emoji: "🍂", drift: "B" },
  { left: "82%", delay: 2.0,  duration: 13, size: 16, emoji: "🍃", drift: "A" },
  { left: "90%", delay: 4.8,  duration: 11, size: 10, emoji: "🍂", drift: "B" },
  { left: "96%", delay: 1.2,  duration: 15, size: 13, emoji: "🍃", drift: "A" },
];

// Warm firefly glow dots — same amber tone as the rest of the theme.
const FIREFLIES = [
  { top: "22%", left: "10%", size: 5,  delay: 0   },
  { top: "44%", left: "85%", size: 4,  delay: 1.4 },
  { top: "62%", left: "6%",  size: 6,  delay: 2.6 },
  { top: "12%", left: "70%", size: 4,  delay: 3.8 },
  { top: "55%", left: "48%", size: 5,  delay: 5.0 },
];

const MailIco = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const CheckIco = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);

export default function Hero() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let s = 0;
    const timer = setInterval(() => {
      s += 4; // 4 x 50 ticks = 200
      if (s >= 200) {
        s = 200;
        clearInterval(timer);
      }
      setCount(s);
    }, 36);
    return () => clearInterval(timer);
  }, []);

  // ─── Mobile Subscribe modal (email → /api/subscribe) ───
  const [subOpen, setSubOpen]       = useState(false);
  const [subEmail, setSubEmail]     = useState("");
  const [subLoading, setSubLoading] = useState(false);
  const [subDone, setSubDone]       = useState(false);
  const [subError, setSubError]     = useState("");
  const [subAlready, setSubAlready] = useState(false);

  const closeSubscribe = () => {
    setSubOpen(false);
    setTimeout(() => {
      setSubEmail("");
      setSubDone(false);
      setSubAlready(false);
      setSubError("");
      setSubLoading(false);
    }, 220);
  };

  const handleSubscribeSubmit = async (e) => {
    e.preventDefault();
    if (!subEmail || !subEmail.includes("@")) {
      setSubError("Please enter a valid email address.");
      return;
    }
    setSubError("");
    setSubLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubAlready(/already/i.test(data.msg || ""));
        setSubDone(true);
        setSubEmail("");
      } else {
        setSubError(data.msg ?? "Something went wrong. Please try again.");
      }
    } catch {
      setSubError("Could not reach the server. Please try again.");
    } finally {
      setSubLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .ft-hero-headline {
          padding: 40px 52px 0;
        }

        .ft-hero-grid {
          display: grid;
          grid-template-columns: 340px 1fr 300px;
          align-items: flex-end;
          padding: 0 52px;
          gap: 0;
          min-height: 0;
        }

        .ft-hero-left {
          padding-bottom: 52px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          gap: 0;
        }

        .ft-hero-eyebrow {
          align-self: flex-start;
        }

        .ft-hero-cta {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        /* Mobile-only Subscribe CTA — hidden until the small-mobile
           breakpoint below, where it sits alongside WhatsApp. */
        .ft-hero-sub-btn {
          display: none;
        }

        .ft-hero-center {
          position: relative;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          height: 100%;
        }

        .ft-hero-img {
          width: 60%;
          max-width: 450px;
        }

        .ft-hero-chips {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 4;
          white-space: nowrap;
        }

        .ft-hero-right {
          padding-bottom: 52px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: flex-start;
          gap: 14px;
          padding-left: 28px;
        }

        .ft-hero-card-offset {
          margin-left: 32px;
        }

        /* corner decor + floating dots: desktop-only flourishes */
        .ft-hero-corner {
          position: absolute;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,.6);
          border: 1px solid rgba(22,163,74,.14);
          border-radius: 999px;
          padding: 6px 14px 6px 6px;
          backdrop-filter: blur(4px);
        }
        .ft-hero-corner--left { top: 86px; left: 52px; }
        .ft-hero-corner--right { top: 86px; right: 52px; }

        .ft-hero-dot {
          position: absolute;
          z-index: 0;
          border-radius: 50%;
          pointer-events: none;
        }

        /* ── Jungle vibe additions ── */
        .ft-hero-leaf {
          position: absolute;
          top: -10%;
          z-index: 0;
          pointer-events: none;
          opacity: 0;
        }
        .ft-hero-leaf--a { animation: leafFallA linear infinite, leafSpin linear infinite; }
        .ft-hero-leaf--b { animation: leafFallB linear infinite, leafSpinRev linear infinite; }

        .ft-hero-firefly {
          position: absolute;
          z-index: 0;
          border-radius: 50%;
          pointer-events: none;
          background: radial-gradient(circle, rgba(245,158,11,.95) 0%, rgba(245,158,11,.15) 70%, transparent 100%);
          animation: fireflyDrift ease-in-out infinite, fireflyPulse ease-in-out infinite;
        }

        .ft-hero-vine {
          position: absolute;
          z-index: 0;
          pointer-events: none;
        }
        .ft-hero-vine--left  { top: 0;   left: 0; }
        .ft-hero-vine--right { top: 0;   right: 0; transform: scaleX(-1); }

        .ft-hero-fern {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          z-index: 0;
          pointer-events: none;
        }

        .ft-hero-fern-cluster {
          z-index: 0;
          pointer-events: none;
        }

        .ft-hero-palm {
          z-index: 0;
          pointer-events: none;
        }

        @keyframes leafFallA {
          0%   { transform: translate(0,0) rotate(0deg); opacity: 0; }
          8%   { opacity: .55; }
          50%  { transform: translate(40px, 58vh) rotate(160deg); }
          92%  { opacity: .4; }
          100% { transform: translate(-30px, 115vh) rotate(330deg); opacity: 0; }
        }
        @keyframes leafFallB {
          0%   { transform: translate(0,0) rotate(0deg); opacity: 0; }
          8%   { opacity: .55; }
          50%  { transform: translate(-50px, 58vh) rotate(-150deg); }
          92%  { opacity: .4; }
          100% { transform: translate(25px, 115vh) rotate(-320deg); opacity: 0; }
        }
        @keyframes leafSpin    { 0% { rotate: 0deg; }   100% { rotate: 360deg; } }
        @keyframes leafSpinRev { 0% { rotate: 0deg; }   100% { rotate: -360deg; } }

        @keyframes fireflyDrift {
          0%, 100% { transform: translate(0,0); }
          25%      { transform: translate(14px, -10px); }
          50%      { transform: translate(-8px, -18px); }
          75%      { transform: translate(-16px, 4px); }
        }
        @keyframes fireflyPulse {
          0%, 100% { opacity: .25; box-shadow: 0 0 4px rgba(245,158,11,.4); }
          50%      { opacity: .9;  box-shadow: 0 0 12px rgba(245,158,11,.7); }
        }

        @keyframes swayRotate {
          0%, 100% { transform: rotate(-6deg) translateY(0); }
          50%      { transform: rotate(6deg) translateY(-6px); }
        }
        @keyframes imgSway {
          0%, 100% { transform: translateY(0) rotate(-1.2deg); }
          50%      { transform: translateY(-14px) rotate(1.2deg); }
        }

        /* ───────── Tablet ───────── */
        @media (max-width: 1024px) {
          .ft-hero-headline {
            padding: 36px 32px 0;
          }
          .ft-hero-grid {
            grid-template-columns: 1fr;
            padding: 0 32px;
            gap: 36px;
            align-items: center;
          }
          .ft-hero-center {
            order: 1;
            height: auto;
          }
          .ft-hero-left {
            order: 2;
            padding-bottom: 0;
            align-items: center;
            text-align: center;
          }
          .ft-hero-eyebrow {
            align-self: center;
          }
          .ft-hero-cta {
            justify-content: center;
          }
          .ft-hero-right {
            order: 3;
            padding-left: 0;
            padding-bottom: 0;
            align-items: center;
          }
          .ft-hero-card-offset {
            margin-left: 0;
          }

          /* Jungle vibe — scaled down for tablet instead of removed:
             drop the layout-disruptive pieces (corner trust badges,
             absolute floating dots, top vine doodles that crowd the
             now-centered headline) but KEEP leaves, fireflies, palm
             silhouettes and fern clusters — just thinned out + shrunk. */
          .ft-hero-corner,
          .ft-hero-dot,
          .ft-hero-vine {
            display: none;
          }

          .ft-hero-leaf:nth-child(3n),
          .ft-hero-firefly:nth-child(3n) {
            display: none;
          }

          .ft-hero-palm {
            width: 180px !important;
            height: 180px !important;
          }
          .ft-hero-fern-cluster {
            width: 120px !important;
            height: 100px !important;
          }
        }

        /* ───────── Mobile ───────── */
        @media (max-width: 640px) {
          .ft-hero-headline {
            padding: 28px 18px 0;
          }
          .ft-hero-grid {
            padding: 0 18px;
            gap: 28px;
          }
          .ft-hero-img {
            width: 78%;
            max-width: 300px;
          }
          .ft-hero-chips {
            position: static;
            left: auto;
            bottom: auto;
            transform: none;
            flex-wrap: wrap;
            justify-content: center;
            white-space: normal;
            margin-top: 16px;
          }
          .ft-hero-chips > div {
            padding: 8px 12px;
          }

          /* Mobile: keep a light jungle feel (fern wave + a few leaves/
             fireflies) but drop the bigger static shapes that would
             crowd a narrow viewport or hurt scroll performance. */
          .ft-hero-palm,
          .ft-hero-fern-cluster {
            display: none;
          }

          .ft-hero-leaf:nth-child(2n),
          .ft-hero-firefly:nth-child(2n) {
            display: none;
          }

          .ft-hero-fern {
            height: 36px;
          }

          /* Reveal the gold Subscribe CTA next to WhatsApp on small mobile */
          .ft-hero-sub-btn {
            display: inline-flex;
          }
        }

        /* ── Subscribe modal (mobile CTA) ── */
        .hsub-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1200;
          background: rgba(15,23,42,.5);
          backdrop-filter: blur(3px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          opacity: 0;
          pointer-events: none;
          transition: opacity .22s ease;
        }
        .hsub-backdrop.open { opacity: 1; pointer-events: auto; }

        .hsub-card {
          position: relative;
          width: 100%;
          max-width: 400px;
          background: #fff;
          border-radius: 16px;
          padding: 32px 28px 26px;
          box-shadow: 0 24px 64px rgba(0,0,0,.28);
          transform: translateY(10px) scale(.97);
          opacity: 0;
          transition: transform .28s cubic-bezier(.34,1.56,.64,1), opacity .22s ease;
        }
        .hsub-backdrop.open .hsub-card { transform: translateY(0) scale(1); opacity: 1; }

        .hsub-close {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--fog);
          transition: background .18s, color .18s;
        }
        .hsub-close:hover { background: rgba(0,0,0,.06); color: var(--ink); }

        .hsub-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--gold), #fbbf24);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
          box-shadow: 0 4px 14px rgba(245,158,11,.3);
          color: #fff;
        }

        .hsub-title {
          font-family: var(--font-d);
          font-size: 24px;
          font-weight: 700;
          color: var(--ink);
          margin: 0 0 6px;
        }
        .hsub-desc {
          font-family: var(--font-b);
          font-size: 13.5px;
          color: var(--fog);
          line-height: 1.6;
          margin: 0 0 20px;
        }

        .hsub-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1.5px solid rgba(0,0,0,.12);
          font-family: var(--font-b);
          font-size: 14px;
          color: var(--ink);
          outline: none;
          box-sizing: border-box;
          transition: border-color .18s;
        }
        .hsub-input:focus { border-color: rgba(245,158,11,.6); }
        .hsub-input.err { border-color: #dc2626; }

        .hsub-error {
          font-family: var(--font-b);
          font-size: 12px;
          color: #dc2626;
          margin: 7px 0 0;
        }

        .hsub-submit {
          width: 100%;
          margin-top: 14px;
          padding: 12.5px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          background: linear-gradient(135deg, var(--gold), #fbbf24);
          color: #fff;
          font-family: var(--font-b);
          font-size: 14px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 14px rgba(245,158,11,.3);
          transition: transform .2s cubic-bezier(.34,1.56,.64,1), opacity .18s;
        }
        .hsub-submit:hover { transform: translateY(-1px); }
        .hsub-submit:disabled { opacity: .7; cursor: default; transform: none; }

        .hsub-fine {
          font-family: var(--font-b);
          font-size: 11px;
          color: #94a3b8;
          text-align: center;
          margin: 12px 0 0;
        }

        .hsub-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 8px 0 4px;
        }
        .hsub-success-icon {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: rgba(245,158,11,.12);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }
        .hsub-success p {
          font-family: var(--font-b);
          font-size: 14px;
          color: var(--fog);
          margin: 0;
        }

        .hsub-spin {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,.4);
          border-top-color: #fff;
          animation: hsubSpin .7s linear infinite;
        }
        @keyframes hsubSpin { to { transform: rotate(360deg); } }
      `}</style>

      <section style={{
        position: "relative",
        overflow: "hidden",
        background: "var(--j0)",
        minHeight: "100vh",
        paddingTop: 76,
        display: "flex",
        flexDirection: "column",
      }}>

        {/* ── Background: blobs, dappled light, palm silhouettes, ferns, leaves, fireflies, vines ── */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>

          {/* Base ambient blobs */}
          <div style={{ position:"absolute", width:700, height:700, top:"-10%", left:"-8%", background:"radial-gradient(circle,rgba(22,163,74,.09) 0%,transparent 65%)", borderRadius:"50%" }} />
          <div style={{ position:"absolute", width:500, height:500, bottom:"-5%", right:"-5%", background:"radial-gradient(circle,rgba(245,158,11,.08) 0%,transparent 65%)", borderRadius:"50%" }} />

          {/* Dappled sunlight-through-canopy wash */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(115deg, transparent 0%, rgba(34,197,94,.08) 18%, transparent 32%, transparent 60%, rgba(245,158,11,.07) 74%, transparent 88%)",
          }} />

          {/* Large palm-leaf silhouettes tucked in far corners */}
          <svg className="ft-hero-palm" style={{ position:"absolute", top:-40, left:-60, width:280, height:280, opacity:.13 }} viewBox="0 0 200 200" fill="none">
            <path d="M100 190 C100 140, 60 120, 20 100 C60 100, 95 110, 100 140 C92 100, 60 70, 20 40 C65 50, 95 75, 100 110 C100 65, 85 35, 60 5 C100 20, 110 60, 105 110 C115 70, 140 45, 175 35 C145 65, 120 90, 108 130 C135 100, 165 95, 195 100 C160 110, 130 125, 110 150 C140 140, 165 150, 185 170 C155 160, 130 162, 110 175 C100 178, 100 185, 100 190 Z" fill="var(--leaf)" />
          </svg>
          <svg className="ft-hero-palm" style={{ position:"absolute", bottom:-50, right:-70, width:320, height:320, opacity:.11, transform:"scaleX(-1)" }} viewBox="0 0 200 200" fill="none">
            <path d="M100 190 C100 140, 60 120, 20 100 C60 100, 95 110, 100 140 C92 100, 60 70, 20 40 C65 50, 95 75, 100 110 C100 65, 85 35, 60 5 C100 20, 110 60, 105 110 C115 70, 140 45, 175 35 C145 65, 120 90, 108 130 C135 100, 165 95, 195 100 C160 110, 130 125, 110 150 C140 140, 165 150, 185 170 C155 160, 130 162, 110 175 C100 178, 100 185, 100 190 Z" fill="var(--leaf2)" />
          </svg>

          {/* Floating dots — sway + drift */}
          <span className="ft-hero-dot" style={{ width:10, height:10, top:"14%", left:"24%", background:"rgba(34,197,94,.28)", animation:"floatY2 7s ease-in-out infinite, swayRotate 5s ease-in-out infinite" }} />
          <span className="ft-hero-dot" style={{ width:6, height:6, top:"30%", left:"15%", background:"rgba(245,158,11,.32)", animation:"floatY2 6s ease-in-out 1s infinite, swayRotate 6s ease-in-out 1s infinite" }} />
          <span className="ft-hero-dot" style={{ width:8, height:8, top:"18%", right:"22%", background:"rgba(245,158,11,.3)", animation:"floatY2 8s ease-in-out .5s infinite, swayRotate 7s ease-in-out .5s infinite" }} />
          <span className="ft-hero-dot" style={{ width:5, height:5, top:"34%", right:"30%", background:"rgba(34,197,94,.3)", animation:"floatY2 5s ease-in-out 1.5s infinite, swayRotate 4.5s ease-in-out 1.5s infinite" }} />

          {/* Drifting leaves */}
          {LEAVES.map((leaf, i) => (
            <span
              key={i}
              className={`ft-hero-leaf ft-hero-leaf--${leaf.drift.toLowerCase()}`}
              style={{
                left: leaf.left,
                fontSize: leaf.size,
                animationDuration: `${leaf.duration}s, ${leaf.duration * 0.65}s`,
                animationDelay: `${leaf.delay}s, ${leaf.delay}s`,
              }}
            >
              {leaf.emoji}
            </span>
          ))}

          {/* Fireflies */}
          {FIREFLIES.map((f, i) => (
            <span
              key={i}
              className="ft-hero-firefly"
              style={{
                top: f.top,
                left: f.left,
                width: f.size,
                height: f.size,
                animationDuration: `${6 + i}s, ${3 + i * 0.4}s`,
                animationDelay: `${f.delay}s, ${f.delay}s`,
              }}
            />
          ))}

          {/* Vine doodles — top corners */}
          <svg className="ft-hero-vine ft-hero-vine--left" width="170" height="170" viewBox="0 0 170 170" fill="none">
            <path d="M5 5 C 40 25, 30 70, 70 85 C 100 96, 95 130, 130 150" stroke="var(--leaf2)" strokeOpacity="0.38" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="40" cy="26" r="5" fill="var(--leaf2)" fillOpacity="0.4" />
            <circle cx="68" cy="84" r="4" fill="var(--leaf)" fillOpacity="0.38" />
            <circle cx="118" cy="138" r="5" fill="var(--leaf2)" fillOpacity="0.35" />
          </svg>
          <svg className="ft-hero-vine ft-hero-vine--right" width="170" height="170" viewBox="0 0 170 170" fill="none">
            <path d="M5 5 C 40 25, 30 70, 70 85 C 100 96, 95 130, 130 150" stroke="var(--leaf2)" strokeOpacity="0.38" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="40" cy="26" r="5" fill="var(--leaf2)" fillOpacity="0.4" />
            <circle cx="68" cy="84" r="4" fill="var(--leaf)" fillOpacity="0.38" />
            <circle cx="118" cy="138" r="5" fill="var(--leaf2)" fillOpacity="0.35" />
          </svg>

          {/* Fern clusters — bottom-left & bottom-right */}
          <svg className="ft-hero-fern-cluster" style={{ position:"absolute", bottom:-10, left:-10, width:180, height:140, opacity:.75 }} viewBox="0 0 180 140" fill="none">
            <path d="M10 140 C20 100,5 70,15 30 C30 65,30 90,28 120 C45 80,40 50,55 15 C58 60,55 90,52 125 C68 90,68 60,85 25 C82 70,80 100,78 135"
                  stroke="var(--leaf)" strokeOpacity="0.7" strokeWidth="3" strokeLinecap="round" fill="none" />
          </svg>
          <svg className="ft-hero-fern-cluster" style={{ position:"absolute", bottom:-10, right:-10, width:180, height:140, opacity:.75, transform:"scaleX(-1)" }} viewBox="0 0 180 140" fill="none">
            <path d="M10 140 C20 100,5 70,15 30 C30 65,30 90,28 120 C45 80,40 50,55 15 C58 60,55 90,52 125 C68 90,68 60,85 25 C82 70,80 100,78 135"
                  stroke="var(--leaf2)" strokeOpacity="0.7" strokeWidth="3" strokeLinecap="round" fill="none" />
          </svg>

          {/* Soft fern-silhouette wave hugging the very bottom edge */}
          <svg className="ft-hero-fern" height="64" viewBox="0 0 1440 64" preserveAspectRatio="none" fill="none">
            <path d="M0 64 L0 40 C40 20,70 50,110 32 C150 14,180 46,220 28 C260 10,300 44,340 26
                     C380 8,420 42,460 24 C500 6,540 40,580 30 C620 20,660 46,700 30
                     C740 14,780 44,820 28 C860 12,900 42,940 26 C980 10,1020 40,1060 28
                     C1100 16,1140 44,1180 30 C1220 16,1260 44,1300 28 C1340 12,1380 42,1440 30 L1440 64 Z"
                  fill="var(--leaf)" fillOpacity="0.13" />
          </svg>
        </div>

        {/* Corner flourishes — sit beside the headline, balancing the top-left / top-right voids */}
        <div className="ft-hero-corner ft-hero-corner--left" style={{ animation: "fadeIn .8s ease .3s both" }}>
          <span style={{
            width: 26, height: 26, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--leaf), var(--leaf2))",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0,
          }}>🌿</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--leaf)", fontFamily: "var(--font-b)" }}>
            100% Natural Diet
          </span>
        </div>

        <div className="ft-hero-corner ft-hero-corner--right" style={{ animation: "fadeIn .8s ease .45s both" }}>
          <span style={{
            width: 26, height: 26, borderRadius: "50%",
            background: "rgba(245,158,11,.18)", border: "1px solid rgba(245,158,11,.3)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0,
          }}>📦</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--leaf)", fontFamily: "var(--font-b)" }}>
            Ships Pan-India
          </span>
        </div>

        {/* ════════════════════════════════════════
            TOP: Full-width headline
        ════════════════════════════════════════ */}
        <div className="ft-hero-headline" style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          animation: "fadeUp .65s var(--ease-out) both",
        }}>
          <h1 style={{
            fontFamily: "var(--font-d)",
            fontSize: "clamp(28px, 3.8vw, 56px)",
            lineHeight: 1.05,
            fontWeight: 500,
            color: "var(--cream)",
            letterSpacing: "-0.02em",
            margin: 0,
          }}>
            A Lifetime Of Care &amp; Joy
          </h1>
          <h2 style={{
            fontFamily: "var(--font-d)",
            fontSize: "clamp(24px, 3.2vw, 48px)",
            lineHeight: 1.1,
            fontWeight: 600,
            fontStyle: "italic",
            background: "linear-gradient(135deg, var(--leaf), var(--leaf2))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.02em",
            margin: 0,
          }}>
            For Every Bird
          </h2>
        </div>

        {/* ════════════════════════════════════════
            MIDDLE: image + left col + right col
        ════════════════════════════════════════ */}
        <div className="ft-hero-grid" style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
        }}>

          {/* LEFT BOTTOM: badge icon + tagline + desc + CTA */}
          <div className="ft-hero-left" style={{
            animation: "fadeUp .7s var(--ease-out) .15s both",
          }}>

            {/* Eyebrow trust tag — fills the empty space above the badge icon */}
            <div className="ft-hero-eyebrow" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "rgba(34,197,94,.07)",
              border: "1px solid rgba(34,197,94,.18)",
              borderRadius: 999,
              padding: "7px 16px",
              marginBottom: "auto",
              animation: "fadeIn .7s ease .2s both",
            }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"var(--leaf2)", boxShadow:"0 0 0 3px rgba(34,197,94,.2)", animation:"glow 2s ease-in-out infinite", flexShrink:0 }} />
              <span style={{ fontSize:10, fontWeight:700, color:"var(--leaf)", letterSpacing:1.8, textTransform:"uppercase", fontFamily:"var(--font-b)" }}>
                Est. 2025 · Sundargarh
              </span>
            </div>

            {/* Badge icon */}
            <div style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--leaf), var(--leaf2))",
              border: "3px solid rgba(34,197,94,.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              marginBottom: 28,
              boxShadow: "0 8px 28px rgba(22,163,74,.3)",
              animation: "leafSway 4s ease-in-out infinite",
            }}>
              🦜
            </div>

            <p style={{
              fontSize: "clamp(17px, 2.2vw, 20px)",
              fontWeight: 700,
              color: "var(--fog)",
              fontFamily: "var(--font-b)",
              lineHeight: 1.35,
              marginBottom: 12,
            }}>
              Premium Birds,<br />Just For You.
            </p>

            <p style={{
              color: "var(--mist)",
              fontSize: 14,
              lineHeight: 1.8,
              marginBottom: 28,
              fontFamily: "var(--font-b)",
              fontWeight: 400,
            }}>
              Vet-checked, ethically raised birds with expert
              training and premium nutrition support.
            </p>

            {/* CTA */}
            <div className="ft-hero-cta">
              <a href="#birds" className="btn-j" style={{ fontSize:14, padding:"12px 28px" }}>
                Explore Birds →
              </a>
              <a href="https://wa.me/919556747518" className="btn-ghost" style={{ fontSize:14, padding:"11px 22px" }}>
                💬 WhatsApp
              </a>
              {/* Mobile-only Subscribe CTA — gold, opens email-capture modal */}
              <button
                type="button"
                className="btn-ghost ft-hero-sub-btn"
                style={{
                  fontSize: 14,
                  padding: "11px 22px",
                  color: "var(--gold)",
                  borderColor: "rgba(245,158,11,.45)",
                  alignItems: "center",
                  gap: 7,
                }}
                onClick={() => setSubOpen(true)}
              >
                <MailIco size={14} /> Subscribe
              </button>
            </div>
          </div>

          {/* CENTER: bird image — bleeds upward */}
          <div className="ft-hero-center">
            {/* Glow */}
            <div style={{
              position: "absolute",
              width: 440,
              height: 440,
              borderRadius: "50%",
              background: "radial-gradient(circle,rgba(22,163,74,.14) 0%,rgba(34,197,94,.04) 55%,transparent 70%)",
              filter: "blur(44px)",
              bottom: "5%",
              left: "50%",
              transform: "translateX(-50%)",
              animation: "glow 4s ease-in-out infinite",
            }} />
            {/* Rings */}
            <div style={{ position:"absolute", bottom:"5%", left:"50%", transform:"translateX(-50%)", width:460, height:460, borderRadius:"50%", border:"1.5px dashed rgba(22,163,74,.14)", animation:"spin1 30s linear infinite" }} />
            <div style={{ position:"absolute", bottom:"5%", left:"50%", transform:"translateX(-50%)", width:340, height:340, borderRadius:"50%", border:"1.5px dashed rgba(245,158,11,.1)", animation:"spin2 22s linear infinite" }} />

            <img
              src={hero}
              alt="Premium Bird"
              className="ft-hero-img"
              style={{
                position: "relative",
                zIndex: 2,
                filter: "drop-shadow(0 24px 56px rgba(0,0,0,.13)) drop-shadow(0 0 36px rgba(22,163,74,.1))",
                animation: "imgSway 7s ease-in-out infinite",
                display: "block",
              }}
            />

            {/* Bottom offer chips — overlaps center-bottom on desktop, wraps below image on mobile */}
            <div className="ft-hero-chips">
              {CHIPS.map((chip, i) => (
                <div key={i} style={{
                  background: chip.color,
                  borderRadius: 14,
                  padding: "9px 16px",
                  textAlign: "center",
                  boxShadow: "0 4px 16px rgba(0,0,0,.08)",
                  animation: `fadeIn .6s ease ${0.9 + i * 0.12}s both`,
                }}>
                  <div style={{ fontSize:10, fontWeight:600, color:"#000", fontFamily:"var(--font-b)", marginBottom:2 }}>{chip.label}</div>
                  <div style={{ fontSize:13, fontWeight:800, color:"#fff", fontFamily:"var(--font-b)" }}>{chip.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: social proof cards */}
          <div className="ft-hero-right" style={{
            animation: "fadeUp .7s var(--ease-out) .25s both",
          }}>

            {/* Free delivery USP card — fills the empty space above the 200+ stack */}
            <div className="hchip" style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: "auto",
              animation: "fadeIn .7s ease .35s both, floatY2 6s ease-in-out 2s infinite",
            }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: "rgba(22,163,74,.12)",
                border: "1px solid rgba(22,163,74,.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
              }}>
                🚚
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:"var(--cream)", fontFamily:"var(--font-b)", lineHeight:1.2 }}>Free Doorstep Delivery</div>
                <div style={{ fontSize:11, color:"var(--mist)", fontFamily:"var(--font-b)", marginTop:2 }}>Across Odisha</div>
              </div>
            </div>

            {/* 200+ join card */}
            <div className="hchip" style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              animation: "fadeIn .7s ease .6s both, floatY2 6s ease-in-out 0s infinite",
            }}>
              <div style={{ position:"relative", display:"flex" }}>
                {["🧑","👩","👦"].map((e, i) => (
                  <div key={i} style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: `hsl(${120 + i * 40},60%,80%)`,
                    border: "2px solid white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    marginLeft: i > 0 ? -10 : 0,
                    zIndex: 3 - i,
                    position: "relative",
                  }}>
                    {e}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize:15, fontWeight:800, color:"var(--cream)", fontFamily:"var(--font-b)" }}>
                  {count}+
                </div>
                <div style={{ fontSize:11, color:"var(--mist)", fontFamily:"var(--font-b)" }}>Happy Owners</div>
              </div>
            </div>

            {/* Expert card */}
            <div className="hchip ft-hero-card-offset" style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              animation: "fadeIn .7s ease .8s both, floatY2 7s ease-in-out 1.5s infinite",
            }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: "linear-gradient(135deg, var(--leaf), var(--leaf2))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
              }}>
                🩺
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:"var(--cream)", fontFamily:"var(--font-b)", lineHeight:1.2 }}>Vet Certified</div>
                <div style={{ fontSize:11, color:"var(--mist)", fontFamily:"var(--font-b)", marginTop:2 }}>Every bird checked</div>
              </div>
            </div>

            {/* Rating card */}
            <div className="hchip" style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              animation: "fadeIn .7s ease 1s both, floatY2 8s ease-in-out 3s infinite",
            }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: "rgba(245,158,11,.12)",
                border: "1px solid rgba(245,158,11,.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
              }}>
                ⭐
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:"var(--cream)", fontFamily:"var(--font-b)", lineHeight:1.2 }}>5★ Rated</div>
                <div style={{ fontSize:11, color:"var(--mist)", fontFamily:"var(--font-b)", marginTop:2 }}>100+ happy customers</div>
              </div>
            </div>

            {/* Trust badge */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "rgba(34,197,94,.07)",
              border: "1px solid rgba(34,197,94,.18)",
              borderRadius: 999,
              padding: "7px 16px",
              marginTop: 4,
              animation: "fadeIn .7s ease 1.2s both",
            }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"var(--leaf2)", boxShadow:"0 0 0 3px rgba(34,197,94,.2)", animation:"glow 2s ease-in-out infinite", flexShrink:0 }} />
              <span style={{ fontSize:10, fontWeight:700, color:"var(--leaf)", letterSpacing:1.8, textTransform:"uppercase", fontFamily:"var(--font-b)" }}>
                Trusted Experts · Odisha
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Subscribe modal — email capture for the mobile CTA above */}
      <div
        className={`hsub-backdrop${subOpen ? " open" : ""}`}
        onClick={closeSubscribe}
        aria-hidden={!subOpen}
      >
        <div className="hsub-card" onClick={(e) => e.stopPropagation()}>
          <button className="hsub-close" onClick={closeSubscribe} aria-label="Close">
            ✕
          </button>

          {subDone ? (
            <div className="hsub-success">
              <div className="hsub-success-icon">
                <CheckIco size={24} />
              </div>
              <h3 className="hsub-title" style={{ marginBottom: 8 }}>{subAlready ? "Already subscribed" : "You're subscribed!"}</h3>
              <p>{subAlready ? "You're already on the list 🌿 — we'll keep sending care tips and new arrivals." : "Welcome to Feather Town 🌿 — we'll keep you posted on care tips and new arrivals."}</p>
            </div>
          ) : (
            <>
              <div className="hsub-icon">
                <MailIco size={20} />
              </div>
              <h3 className="hsub-title">Stay in the loop</h3>
              <p className="hsub-desc">
                Get weekly bird care tips, nutrition guides, and a first look at new species.
              </p>

              <form onSubmit={handleSubscribeSubmit} noValidate>
                <input
                  type="email"
                  autoFocus
                  value={subEmail}
                  onChange={(e) => { setSubEmail(e.target.value); if (subError) setSubError(""); }}
                  placeholder="your@email.com"
                  className={`hsub-input${subError ? " err" : ""}`}
                  disabled={subLoading}
                />
                {subError && <p className="hsub-error">{subError}</p>}

                <button type="submit" className="hsub-submit" disabled={subLoading}>
                  {subLoading ? (<><span className="hsub-spin" />Subscribing…</>) : "Subscribe"}
                </button>
              </form>

              <p className="hsub-fine">No spam, unsubscribe anytime.</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
