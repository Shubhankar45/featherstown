/* ═══════════════════════════════════════════════════
   CTA — closing "talk to us" call to action
═══════════════════════════════════════════════════ */
import { Leaf, WAIco } from "../ui/Icons";

export default function CTASection() {
  return (
    <section className="sp" style={{ position: "relative", overflow: "hidden", textAlign: "center", background: "var(--j1)" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 65% at 50% 50%,rgba(22,163,74,.09) 0%,transparent 65%)", pointerEvents: "none" }} />
      <Leaf style={{ width: 190, top: "-9%", left: "-2%", transform: "rotate(-14deg)" }} />
      <Leaf style={{ width: 150, bottom: "-8%", right: "-2%", transform: "rotate(20deg)" }} />
      <div className="rv" style={{ position: "relative", zIndex: 1 }}>
        <span className="stag">Get in Touch</span>
        <h2 style={{ fontFamily: "var(--font-d)", fontSize: "clamp(24px,4.2vw,58px)", fontWeight: 500, color: "var(--cream)", margin: "10px 0 12px", lineHeight: 1.07 }}>
          Need Help Choosing the<br /><span style={{ color: "var(--leaf)", fontStyle: "italic" }}>Right Bird?</span>
        </h2>
        <p style={{ color: "var(--fog)", fontSize: 14.5, maxWidth: 400, margin: "0 auto 34px", lineHeight: 1.85 }}>
          Contact us for expert guidance, best deals, and personalised recommendations for your home.
        </p>
        <a href="https://wa.me/919556747518" className="btn-j" style={{ fontSize: 15, padding: "15px 42px" }}><WAIco size={16} /> Chat on WhatsApp</a>
      </div>
    </section>
  );
}
