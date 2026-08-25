/* ═══════════════════════════════════════════════════
   NEWSLETTER — email subscribe block
═══════════════════════════════════════════════════ */
import { useState, useCallback } from "react";
import { Leaf, CheckIco, Spin } from "../ui/Icons";
import { toast } from "../ui/Toast";

export default function Newsletter() {
  const [nlEmail, setNlEmail] = useState("");
  const [nlDone, setNlDone] = useState(false);
  const [nlLoading, setNlLoading] = useState(false);

  const handleSubscribe = useCallback(async () => {
    if (!nlEmail || !nlEmail.includes("@")) { toast.warn("Please enter a valid email address."); return; }
    setNlLoading(true);
    try {
      const res = await fetch(`/api/subscribe`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: nlEmail }) });
      const data = await res.json();
      if (res.ok) { setNlDone(true); setNlEmail(""); toast.success("You're subscribed! Welcome 🌿"); }
      else toast.error(data.msg ?? "Something went wrong.");
    } catch {
      toast.error("Could not reach the server. Please try again.");
    } finally {
      setNlLoading(false);
    }
  }, [nlEmail]);

  return (
    <section className="sp" style={{ background: "var(--j0)" }}>
      <div className="nl-wrap rv" style={{ maxWidth: 660, margin: "0 auto" }}>
        <Leaf style={{ width: 110, top: "-10%", right: "-2%", transform: "rotate(22deg)" }} />
        <span className="stag">Stay Updated</span>
        <h2 style={{ fontFamily: "var(--font-d)", fontSize: "clamp(22px,3.5vw,42px)", fontWeight: 500, color: "var(--cream)", marginTop: 10, marginBottom: 10 }}>
          Get Bird Care Tips &amp; <span style={{ color: "var(--leaf)", fontStyle: "italic" }}>New Arrivals</span>
        </h2>
        <p style={{ color: "var(--fog)", fontSize: 14, lineHeight: 1.85, marginBottom: 24, maxWidth: 420, margin: "0 auto 24px" }}>
          Join 150+ bird lovers getting weekly tips on care, nutrition, and first-look at new species.
        </p>
        {nlDone ? (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.28)", borderRadius: "var(--r)", padding: "13px 22px", color: "var(--leaf)" }}>
            <CheckIco size={17} /><span style={{ fontWeight: 700 }}>You're subscribed! Welcome 🎉</span>
          </div>
        ) : (
          <div className="nl-row">
            <input type="email" value={nlEmail} onChange={(e) => setNlEmail(e.target.value)} placeholder="your@email.com" className="j-input" style={{ borderRadius: 999, flex: 1 }} onKeyDown={(e) => e.key === "Enter" && handleSubscribe()} />
            <button className="btn-j" style={{ whiteSpace: "nowrap" }} onClick={handleSubscribe} disabled={nlLoading}>
              {nlLoading ? <><Spin />&nbsp;Subscribing…</> : "Subscribe →"}
            </button>
          </div>
        )}
        <p style={{ fontSize: 11, color: "var(--mist)", marginTop: 10 }}>No spam, unsubscribe anytime.</p>
      </div>
    </section>
  );
}
