import { useState } from "react";

export default function Stars({ onSelect, initial = 5 }) {
  const [h, setH] = useState(0);
  const [s, setS] = useState(initial);
  const lbl = ["", "Poor", "Fair", "Good", "Great", "Excellent"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 14 }}>
      <span style={{ fontSize: 10, color: "var(--mist)", fontWeight: 700, marginRight: 6, letterSpacing: 1, textTransform: "uppercase" }}>Rating</span>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button"
          style={{
            fontSize: 22, background: "none", border: "none", cursor: "pointer", lineHeight: 1, padding: "0 2px",
            color: n <= (h || s) ? "var(--gold3)" : "var(--j4)",
            transform: n <= (h || s) ? "scale(1.28)" : "scale(1)",
            transition: "color .14s,transform .2s var(--ease-spring)",
          }}
          onMouseEnter={() => setH(n)} onMouseLeave={() => setH(0)}
          onClick={() => { setS(n); onSelect(n); }}
        >★</button>
      ))}
      {s > 0 && <span style={{ fontSize: 10, color: "var(--leaf2)", fontWeight: 800, marginLeft: 4, letterSpacing: 1, textTransform: "uppercase" }}>{lbl[s]}</span>}
    </div>
  );
}
