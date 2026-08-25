/* ═══════════════════════════════════════════════════════════════
   Feathers Town — Compatibility Badge (reusable)
   /components/CompatibilityBadge.jsx

   Shows a circular or bar-style compatibility score.
   Pass either a pre-computed `score` (0–100) or the
   `parrot` + `answers` props and it will compute it internally.
═══════════════════════════════════════════════════════════════ */
import { useMemo } from "react";
import { calcCompatibility, compatLabel } from "../utils/recommendation";

const css = `
@keyframes compatSpin{from{stroke-dashoffset:220;}to{stroke-dashoffset:var(--target);}}
@keyframes compatBarGrow{from{width:0;}to{width:var(--target-width);}}
`;

/**
 * Circular gauge version.
 */
function CircularBadge({ score, label, color, bg, border }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ position: "relative", width: 92, height: 92 }}>
        <svg width={92} height={92} viewBox="0 0 92 92" style={{ transform: "rotate(-90deg)" }}>
          <circle cx={46} cy={46} r={radius} fill="none" stroke="var(--j3)" strokeWidth={7} />
          <circle
            cx={46} cy={46} r={radius}
            fill="none" stroke={color} strokeWidth={7}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.16,1,.3,1)" }}
          />
        </svg>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontWeight: 800, fontSize: 18, color: "var(--cream)", lineHeight: 1 }}>{score}%</span>
        </div>
      </div>
      <span style={{
        fontSize: 10, fontWeight: 800, letterSpacing: .5,
        color, background: bg, border: `1px solid ${border}`,
        padding: "3px 10px", borderRadius: 999,
      }}>{label}</span>
    </div>
  );
}

/**
 * Horizontal bar version (compact).
 */
function BarBadge({ score, label, color, bg, border }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{
          fontSize: 8, fontWeight: 700, letterSpacing: .4, textTransform: "uppercase",
          color, background: bg, border: `1px solid ${border}`,
          padding: "1px 6px", borderRadius: 999,
        }}>{label}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: "var(--cream)" }}>{score}%</span>
      </div>
      <div style={{ height: 4, background: "var(--j3)", borderRadius: 999, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 999, background: color,
          width: `${score}%`,
          transition: "width 1.1s cubic-bezier(.16,1,.3,1)",
        }} />
      </div>
    </div>
  );
}

/**
 * CompatibilityBadge
 *
 * Props:
 *   parrot   {object}  - parrot object from your data
 *   answers  {object}  - quiz answers (optional — if not provided, no score shown)
 *   score    {number}  - pre-computed score 0–100 (overrides parrot+answers)
 *   variant  "circle" | "bar" (default: "circle")
 *   size     "sm" | "md" (only affects circle)
 */
export default function CompatibilityBadge({ parrot, answers, score: scoreProp, variant = "circle" }) {
  const score = useMemo(() => {
    if (scoreProp !== undefined) return scoreProp;
    if (parrot && answers) return calcCompatibility(parrot, answers);
    return null;
  }, [scoreProp, parrot, answers]);

  if (score === null) return null;

  const { label, color, bg, border } = compatLabel(score);

  return (
    <>
      <style>{css}</style>
      {variant === "bar"
        ? <BarBadge score={score} label={label} color={color} bg={bg} border={border} />
        : <CircularBadge score={score} label={label} color={color} bg={bg} border={border} />
      }
    </>
  );
}