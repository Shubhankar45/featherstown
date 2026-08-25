/* ═══════════════════════════════════════════════════
   FOOTER — global site footer (rendered on every page)
═══════════════════════════════════════════════════ */
const LINKS = [["/#about", "About Us"], ["/#birds", "Our Birds"], ["/#compare", "Compare Birds"], ["/#reviews", "Reviews"], ["https://wa.me/919556747518", "WhatsApp"]];
const CONTACT = [["📧", "support@feathertown.online"], ["📞", "+91 9556747518"], ["📍", "Sundargarh, Odisha, India"]];
const HOURS = [["Mon – Sat", "9 AM – 8 PM"], ["Sunday", "10 AM – 6 PM"], ["WhatsApp", "Always On 💚"]];

export default function Footer() {
  return (
    <footer id="contact" style={{ background: "var(--j0)", borderTop: "1px solid rgba(34,197,94,.08)", padding: "58px 60px 24px" }}>
      <div className="fg">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontFamily: "var(--font-d)", fontWeight: 500, fontSize: 22 }}>
              <span style={{ color: "var(--leaf)" }}>Feather</span><span style={{ color: "var(--gold2)" }}>Town</span>
            </span>
          </div>
          <p style={{ color: "var(--mist)", fontSize: 13, lineHeight: 1.85, maxWidth: 230, marginBottom: 14 }}>
            Healthy parrots, training support, and complete care guidance for bird lovers across Bhubaneswar.
          </p>
          <a href="https://www.instagram.com/feather_town__?igsh=MWV2ZXdqbzlidmk4aw==" target="_blank" rel="noreferrer" className="ig-btn">📸 Instagram</a>
        </div>
        <div>
          <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", color: "var(--mist)" }}>Quick Links</h3>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9 }}>
            {LINKS.map(([h, l]) => <li key={l}><a href={h} className="fl">{l}</a></li>)}
          </ul>
        </div>
        <div>
          <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", color: "var(--mist)" }}>Contact</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {CONTACT.map(([icon, text]) => (
              <div key={text} style={{ display: "flex", gap: 9, color: "var(--fog)", fontSize: 13, alignItems: "flex-start" }}>
                <span>{icon}</span><span>{text}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", color: "var(--mist)" }}>Hours</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {HOURS.map(([d, t]) => (
              <div key={d}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "var(--leaf2)", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 1 }}>{d}</div>
                <div style={{ fontSize: 13, color: "var(--fog)", fontWeight: 500 }}>{t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(34,197,94,.06)", paddingTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <span style={{ color: "var(--mist)", fontSize: 12 }}>© 2026 Feathers Town · All rights reserved</span>
        <span style={{ color: "var(--mist)", fontSize: 12 }}>Made with 💚 in Sundargarh</span>
      </div>
    </footer>
  );
}
