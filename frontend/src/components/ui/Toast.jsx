/* ═══════════════════════════════════════════════════
   Global Toast Engine — singleton emitter + container
═══════════════════════════════════════════════════ */
import { useState, useEffect } from "react";

let _tid = 0;
let _push = null;

export const toast = {
  _fire(msg, type, dur = 4000) {
    if (!_push) return;
    const id = ++_tid;
    _push((p) => [...p, { id, msg, type }]);
    setTimeout(() => _push((p) => p.filter((t) => t.id !== id)), dur);
  },
  success(m) { this._fire(m, "success"); },
  error(m)   { this._fire(m, "error");   },
  warn(m)    { this._fire(m, "warn");    },
  info(m)    { this._fire(m, "info");    },
};

const T_CFG = {
  success: { icon: "✓", pill: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0", txt: "#166534" },
  error:   { icon: "✕", pill: "#ef4444", bg: "#fef2f2", border: "#fecaca", txt: "#991b1b" },
  warn:    { icon: "!", pill: "#f59e0b", bg: "#fffbeb", border: "#fde68a", txt: "#92400e" },
  info:    { icon: "i", pill: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe", txt: "#1e40af" },
};

export default function ToastContainer() {
  const [items, setItems] = useState([]);
  useEffect(() => { _push = setItems; return () => { _push = null; }; }, []);
  if (!items.length) return null;
  return (
    <div style={{
      position: "fixed", top: 20, right: 20, zIndex: 99999,
      display: "flex", flexDirection: "column", gap: 10,
      pointerEvents: "none",
    }}>
      {items.map((t) => {
        const c = T_CFG[t.type] ?? T_CFG.info;
        return (
          <div key={t.id} style={{
            display: "flex", alignItems: "flex-start", gap: 12,
            background: c.bg, border: `1.5px solid ${c.border}`,
            borderRadius: 16, padding: "13px 18px 13px 13px",
            boxShadow: "0 12px 40px rgba(0,0,0,.13), 0 2px 8px rgba(0,0,0,.07)",
            maxWidth: 340, minWidth: 220, pointerEvents: "all",
            animation: "toastSlide .35s cubic-bezier(.34,1.56,.64,1) both",
            fontFamily: "var(--font-b)",
          }}>
            <span style={{
              width: 28, height: 28, borderRadius: "50%",
              background: c.pill, color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 800, flexShrink: 0,
              boxShadow: `0 4px 10px ${c.pill}55`,
            }}>{c.icon}</span>
            <span style={{ fontSize: 13.5, fontWeight: 500, color: c.txt, lineHeight: 1.55, paddingTop: 4 }}>
              {t.msg}
            </span>
          </div>
        );
      })}
    </div>
  );
}
