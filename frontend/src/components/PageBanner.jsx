/* ═══════════════════════════════════════════════════
   PAGE BANNER — used at the top of standalone section
   pages (About, Birds, Compare, Reviews, Contact) so
   they read as real pages, not orphaned fragments.
═══════════════════════════════════════════════════ */
import { Link } from "react-router-dom";

export default function PageBanner({ eyebrow, title, accent, desc }) {
  return (
    <div className="page-banner">
      <div className="page-banner-crumb"><Link to="/">Home</Link><span>/</span><span>{eyebrow}</span></div>
      <span className="stag">{eyebrow}</span>
      <h1 style={{ fontFamily: "var(--font-d)", fontSize: "clamp(30px,5vw,58px)", fontWeight: 500, color: "var(--cream)", marginTop: 10, marginBottom: 12, lineHeight: 1.08 }}>
        {title} {accent && <span style={{ color: "var(--leaf)", fontStyle: "italic" }}>{accent}</span>}
      </h1>
      {desc && <p style={{ color: "var(--fog)", fontSize: 14.5, lineHeight: 1.85, maxWidth: 520, margin: "0 auto" }}>{desc}</p>}
    </div>
  );
}
