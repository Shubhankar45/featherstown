/* ═══════════════════════════════════════════════════
   ABOUT — who-we-are cards grid
═══════════════════════════════════════════════════ */
import { Leaf } from "../ui/Icons";

const CARDS = [
  { icon: "🦜", title: "Our Services", color: "#22c55e", items: ["Healthy & Verified Selling", "Personalised Diet Guide", "Bird Taming & Training", "Complete Care Guidance", "24/7 WhatsApp Support"] },
  { icon: "🏆", title: "Why Choose Us?", color: "#e8b050", body: "We focus on ethical bird care, proper training, and long-term support. Our goal is not just selling birds but helping you build a genuine bond with your pet." },
  { icon: "🚀", title: "Future Plans", color: "#a088ee", body: "We will be adding more breeds and bird-related products soon. You can also request specific breeds — we'll try our best to make them available." },
  { icon: "📸", title: "Reviews & Videos", color: "#60b0e0", body: "Multiple happy customers and a growing community. Visit our Instagram page to see real bird videos, reviews, and daily updates.", link: { href: "https://www.instagram.com/feather_town__?igsh=MWV2ZXdqbzlidmk4aw==", label: "Visit Instagram →" } },
];

export default function About({ standalone = false }) {
  return (
    <section id="about" className="sp" style={{ background: "var(--j0)", position: "relative", overflow: "hidden" }}>
      <Leaf style={{ width: 180, top: "-7%", right: "-3%", transform: "rotate(22deg)" }} />
      <Leaf style={{ width: 100, bottom: "-5%", left: "1%", transform: "rotate(-11deg)" }} />
      {!standalone && (
        <div className="rv" style={{ textAlign: "center", marginBottom: 48 }}>
          <span className="stag">Who We Are</span>
          <h2 style={{ fontFamily: "var(--font-d)", fontSize: "clamp(26px,4vw,52px)", fontWeight: 500, color: "var(--cream)", lineHeight: 1.1, marginTop: 10, marginBottom: 12 }}>
            About <span style={{ color: "var(--leaf)", fontStyle: "italic" }}>Feathers Town</span>
          </h2>
          <p style={{ color: "var(--fog)", fontSize: 14.5, lineHeight: 1.9, maxWidth: 520, margin: "0 auto" }}>
            We go beyond selling birds. Every parrot is raised with care, trained with patience, and placed in a loving home — complete with guidance on behaviour, diet, and lifestyle.
          </p>
        </div>
      )}
      <div className="ag">
        {CARDS.map(({ icon, title, color, items, body, link }, idx) => (
          <div key={title} className="j-card rv" style={{ padding: "22px 20px", transitionDelay: `${idx * 70}ms` }}>
            <div style={{ width: 46, height: 46, borderRadius: "var(--r)", background: `${color}16`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 14, border: `1px solid ${color}26` }}>{icon}</div>
            <h3 style={{ fontWeight: 700, fontSize: 11, color, marginBottom: 12, letterSpacing: 0.6, textTransform: "uppercase" }}>{title}</h3>
            {items && (
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
                {items.map((it) => (
                  <li key={it} style={{ display: "flex", gap: 8, color: "var(--fog)", fontSize: 13, alignItems: "flex-start" }}>
                    <span style={{ color: "var(--leaf2)", fontWeight: 800, flexShrink: 0, marginTop: 1 }}>✓</span>{it}
                  </li>
                ))}
              </ul>
            )}
            {body && <p style={{ color: "var(--fog)", fontSize: 13, lineHeight: 1.85 }}>{body}</p>}
            {link && <a href={link.href} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 10, color: "var(--leaf2)", fontWeight: 700, fontSize: 12, textDecoration: "none" }}>{link.label}</a>}
          </div>
        ))}
      </div>
    </section>
  );
}
