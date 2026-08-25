/* ═══════════════════════════════════════════════════
   BIRDS SHOWCASE — search, filter, grid, lightbox,
   compare-tray. Self-contained so it can live on the
   Home page AND its own standalone /birds page.
═══════════════════════════════════════════════════ */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Leaf, SearchIco, WAIco, XIcon } from "../ui/Icons";
import CompatibilityBadge from "../CompatibilityBadge";
import useSavedQuizAnswers from "../../hooks/useSavedQuizAnswers";

const WA = (n) => `https://wa.me/919556747518?text=Hi%2C%20I'm%20interested%20in%20${encodeURIComponent(n)}`;

export default function BirdsShowcase({ parrots, standalone = false }) {
  const [cat, setCat] = useState("All");
  const [query, setQuery] = useState("");
  const [lightbox, setLB] = useState(null);
  const [compared, setCompared] = useState([]);
  const savedAnswers = useSavedQuizAnswers();

  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") setLB(null); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  const cats = ["All", ...new Set(parrots.map((p) => p.category))];
  const cntFor = (c) => (c === "All" ? parrots.length : parrots.filter((p) => p.category === c).length);
  const filtered = parrots
    .filter((p) => cat === "All" || p.category === cat)
    .filter((p) => !query || p.name.toLowerCase().includes(query.toLowerCase()) || (p.description || "").toLowerCase().includes(query.toLowerCase()));
  const toggleCompare = (p) =>
    setCompared((prev) => {
      if (prev.find((x) => x.id === p.id)) return prev.filter((x) => x.id !== p.id);
      if (prev.length >= 3) return prev;
      return [...prev, p];
    });

  return (
    <>
      <section id="birds" className="sp" style={{ background: "var(--j0)", position: "relative", overflow: "hidden" }}>
        <Leaf style={{ width: 145, bottom: "3%", right: "-2%", transform: "rotate(19deg)" }} />
        {!standalone && (
          <div className="rv" style={{ textAlign: "center", marginBottom: 32 }}>
            <span className="stag">Our Collection</span>
            <h2 style={{ fontFamily: "var(--font-d)", fontSize: "clamp(24px,3.8vw,50px)", fontWeight: 500, color: "var(--cream)", marginTop: 10 }}>Popular Parrots</h2>
            <p style={{ color: "var(--mist)", fontSize: 12.5, marginTop: 8 }}>Check up to 3 birds to compare on WhatsApp.</p>
          </div>
        )}
        <div className="srch-wrap rv">
          <span className="srch-ico"><SearchIco /></span>
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or species…" className="srch-input" />
        </div>
        <div className="cat-row rv">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`cat-btn${cat === c ? " act" : ""}`}>
              {c}<span className="cnt">{cntFor(c)}</span>
            </button>
          ))}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "56px 20px", color: "var(--mist)" }}>
            <div style={{ fontSize: 38, marginBottom: 10 }}>🔍</div>
            <p style={{ fontSize: 15, fontWeight: 600 }}>No birds found for "{query}"</p>
            <p style={{ fontSize: 13, marginTop: 5 }}>Try a different name or clear the search.</p>
            <button className="btn-sm" style={{ marginTop: 14 }} onClick={() => { setQuery(""); setCat("All"); }}>Clear filters</button>
          </div>
        )}
        <div className="bg">
          {filtered.map((p, i) => {
            const isCmp = compared.find((x) => x.id === p.id);
            return (
              <div key={p.id} className="bird-card rv" style={{ transitionDelay: `${i * 45}ms` }}>
                <div style={{ position: "relative", height: 215, overflow: "hidden" }}>
                  <img src={p.image} className="bimg" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", cursor: "zoom-in" }} alt={p.name} onClick={() => setLB({ img: p.image, name: p.name })} />
                  <div className="boverlay" />
                  <input type="checkbox" className="cmp-chk" checked={!!isCmp} onChange={() => toggleCompare(p)} title="Add to compare" />
                  <div style={{ position: "absolute", top: 12, right: 12, zIndex: 2 }}>
                    <span className={p.status === "available" ? "b-av" : "b-so"}>{p.status === "available" ? "● Available" : "○ Sold Out"}</span>
                  </div>
                  <div style={{ position: "absolute", bottom: 10, left: 10, zIndex: 2, background: "rgba(4,13,6,.7)", backdropFilter: "blur(6px)", color: "var(--ghost)", fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 999, border: "1px solid rgba(34,197,94,.13)", letterSpacing: 0.8, textTransform: "uppercase" }}>{p.category}</div>
                  <div style={{ position: "absolute", bottom: 10, right: 10, zIndex: 2, background: "rgba(0,0,0,.42)", color: "#fff", fontSize: 9.5, padding: "3px 7px", borderRadius: 6, backdropFilter: "blur(4px)" }}>🔍 Zoom</div>
                </div>
                <div style={{ position: "relative", zIndex: 2, padding: "16px 18px 18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <h3 style={{ fontFamily: "var(--font-d)", fontWeight: 500, fontSize: 19, color: "var(--cream)", lineHeight: 1.1 }}>{p.name}</h3>
                    <span style={{ fontWeight: 700, fontSize: 11.5, color: "var(--leaf)", background: "rgba(34,197,94,.1)", padding: "3px 9px", borderRadius: 7, flexShrink: 0, marginLeft: 8, border: "1px solid rgba(34,197,94,.17)" }}>{p.price}</span>
                  </div>
                  <p style={{ color: "var(--mist)", fontSize: 13, lineHeight: 1.75, marginBottom: savedAnswers ? 10 : 14 }}>{p.description}</p>
                  {savedAnswers && (
                    <div style={{ marginBottom: 12 }}><CompatibilityBadge parrot={p} answers={savedAnswers} variant="bar" /></div>
                  )}
                  <div className="bc-foot">
                    <Link to={`/breed/${p.id}`}>
                      <button style={{ background: "none", border: "none", color: "var(--leaf2)", fontWeight: 700, fontSize: 12.5, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontFamily: "var(--font-b)", padding: 0, transition: "gap .2s" }} onMouseEnter={(e) => (e.currentTarget.style.gap = "10px")} onMouseLeave={(e) => (e.currentTarget.style.gap = "5px")}>
                        View Details →
                      </button>
                    </Link>
                    <a href={WA(p.name)} className="btn-wa"><WAIco /> WhatsApp</a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {lightbox && (
        <div className="lb-bg" onClick={() => setLB(null)}>
          <button className="lb-close" onClick={() => setLB(null)}>✕</button>
          <img src={lightbox.img} alt={lightbox.name} className="lb-img" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {compared.length > 0 && (
        <div className="cmp-bar">
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--leaf)", letterSpacing: 0.5, textTransform: "uppercase", flexShrink: 0 }}>Compare ({compared.length}/3)</span>
          {compared.map((p) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 7, background: "var(--j2)", borderRadius: "var(--r)", padding: "5px 11px", border: "1px solid rgba(34,197,94,.15)" }}>
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>{p.name}</span>
              <button onClick={() => toggleCompare(p)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--mist)", display: "flex", padding: 0 }}><XIcon /></button>
            </div>
          ))}
          <a href={WA(compared.map((p) => p.name).join(" vs "))} className="btn-j" style={{ padding: "7px 18px", fontSize: 12.5, marginLeft: "auto" }}><WAIco /> Compare on WhatsApp</a>
          <button onClick={() => setCompared([])} className="btn-sm" style={{ padding: "7px 13px" }}>Clear</button>
        </div>
      )}
    </>
  );
}
