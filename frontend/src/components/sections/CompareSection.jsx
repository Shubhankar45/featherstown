/* ═══════════════════════════════════════════════════
   COMPARE — side-by-side bird comparison tool
═══════════════════════════════════════════════════ */
import { useState } from "react";
import { Leaf, WAIco } from "../ui/Icons";
import CompatibilityBadge from "../CompatibilityBadge";
import { calcCompatibility } from "../../utils/recommendation";
import useSavedQuizAnswers from "../../hooks/useSavedQuizAnswers";

const SCORE_LABELS = { intelligence: "Intelligence", tamability: "Tamability", talkativeness: "Talkativeness", noise: "Low Noise", lifespan: "Longevity", beginner: "Beginner Friendly" };
const SPEC_ROWS = [{ key: "price", label: "Price" }, { key: "category", label: "Size" }, { key: "temperament", label: "Temperament" }, { key: "noise", label: "Noise Level" }, { key: "lifespan", label: "Lifespan" }, { key: "difficulty", label: "Experience Needed" }, { key: "talker", label: "Talking Ability" }];
const CMP_COLORS = ["var(--leaf2)", "var(--gold3)", "#60a5fa"];

export default function CompareSection({ parrots, standalone = false }) {
  const savedAnswers = useSavedQuizAnswers();
  const img = (n) => parrots.find((p) => p.name === n)?.image ?? "";
  const CB = [
    { id: "afg", name: "African Grey", category: "Large", price: "₹45,000", image: img("African Grey"), description: "Highly intelligent, long-lived companion known for extraordinary speech.", temperament: "Gentle & Loyal", noise: "Medium", lifespan: "50+ years", difficulty: "Moderate", talker: "Excellent", scores: { intelligence: 10, tamability: 8, talkativeness: 10, noise: 5, lifespan: 10, beginner: 5 } },
    { id: "ckt", name: "Cockatiel", category: "Small", price: "₹3,500", image: img("Cockatiel"), description: "Friendly, affectionate birds perfect for first-time parrot owners.", temperament: "Gentle & Playful", noise: "Low-Medium", lifespan: "15–20 years", difficulty: "Easy", talker: "Good", scores: { intelligence: 7, tamability: 10, talkativeness: 6, noise: 8, lifespan: 5, beginner: 10 } },
    { id: "snc", name: "Sun Conure", category: "Medium", price: "₹18,000", image: img("Sun Conure"), description: "Brilliantly coloured, exuberant bird that loves attention and play.", temperament: "Playful & Loud", noise: "High", lifespan: "20–30 years", difficulty: "Moderate", talker: "Fair", scores: { intelligence: 7, tamability: 8, talkativeness: 5, noise: 3, lifespan: 7, beginner: 6 } },
    { id: "gcc", name: "Green Cheek Conure", category: "Small", price: "₹5,000", image: img("Green Cheek Conure"), description: "Friendly and gentle — one of the quietest conures, great for apartments.", temperament: "Gentle & Social", noise: "Low-Medium", lifespan: "25 years", difficulty: "Easy", talker: "Fair", scores: { intelligence: 6, tamability: 9, talkativeness: 4, noise: 8, lifespan: 6, beginner: 9 } },
    { id: "pnc", name: "Pineapple Conure", category: "Small", price: "₹6,000", image: img("Pineapple Conure"), description: "Vibrant, energetic little birds with big personalities and strong bonds.", temperament: "Bold & Energetic", noise: "Medium-High", lifespan: "20 years", difficulty: "Moderate", talker: "Fair", scores: { intelligence: 6, tamability: 7, talkativeness: 4, noise: 5, lifespan: 5, beginner: 8 } },
    { id: "cnm", name: "Cinnamon Conure", category: "Small", price: "₹8,000", image: img("Cinnamon Conure"), description: "Affectionate and intelligent — playful personality with a calm streak.", temperament: "Playful & Affectionate", noise: "Medium", lifespan: "22 years", difficulty: "Easy", talker: "Fair", scores: { intelligence: 6, tamability: 8, talkativeness: 4, noise: 6, lifespan: 5, beginner: 9 } },
  ];
  const [selected, setSel] = useState([]);
  const [pickerOpen, setPO] = useState(false);
  const [pickerTemp, setPT] = useState([]);
  const [activeCat, setAC] = useState("All");
  const [activeTab, setAT] = useState("overview");
  const cats = ["All", ...new Set(CB.map((b) => b.category))];
  const remove = (id) => setSel((p) => p.filter((b) => b.id !== id));
  const clearAll = () => { setSel([]); setAT("overview"); };
  const openPicker = () => { if (selected.length >= 3) return; setPT(selected.map((b) => b.id)); setPO(true); };
  const confirm = () => {
    const nb = [];
    pickerTemp.forEach((id) => {
      if (!selected.find((b) => b.id === id)) {
        const bird = CB.find((b) => b.id === id);
        if (bird && selected.length + nb.length < 3) nb.push(bird);
      }
    });
    setSel((p) => [...p, ...nb]);
    setPO(false);
  };
  const togglePick = (id) => {
    if (selected.find((b) => b.id === id)) return;
    setPT((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length + selected.length < 3 ? [...p, id] : p));
  };
  const shareWA = () => window.open(`https://wa.me/919556747518?text=${encodeURIComponent("Hi! I'd like to compare: " + selected.map((b) => b.name).join(" vs ") + ". Help me choose?")}`, "_blank");
  const has2 = selected.length >= 2;
  const totals = selected.map((b) => ({ b, total: Object.values(b.scores).reduce((a, v) => a + v, 0) }));
  const winner = totals.length ? totals.reduce((best, cur) => (cur.total > best.total ? cur : best)) : null;
  const tip = () => {
    const names = selected.map((b) => b.name);
    if (names.includes("African Grey")) return "African Greys are the top choice for a long-term intelligent companion — budget for 50+ years of care. For first-timers, a Cockatiel offers a gentler start.";
    if (names.some((n) => n.includes("Conure"))) return "Conures are fun, social birds — Green Cheek Conures are the quietest of the bunch and perfect for apartment living. Sun Conures are louder but more visually striking.";
    if (selected.every((b) => b.category === "Small")) return "All selected birds are small breeds — great for apartment living. Cockatiels are consistently the most beginner-friendly pick.";
    return "Each bird brings something unique! Chat with us on WhatsApp and we'll help you find the perfect match for your lifestyle.";
  };
  const pList = activeCat === "All" ? CB : CB.filter((b) => b.category === activeCat);
  const cbToParrot = (b) => ({ name: b.name, price: b.price, category: b.category });

  return (
    <>
      <section id="compare" className="sp" style={{ background: "var(--j1)", position: "relative", overflow: "hidden" }}>
        <Leaf style={{ width: 150, top: "-5%", right: "-2%", transform: "rotate(18deg)" }} />
        <Leaf style={{ width: 100, bottom: "-4%", left: "1%", transform: "rotate(-11deg)" }} />
        {!standalone && (
          <div className="rv" style={{ textAlign: "center", marginBottom: 44 }}>
            <span className="stag">Side by Side</span>
            <h2 style={{ fontFamily: "var(--font-d)", fontSize: "clamp(26px,4vw,54px)", fontWeight: 500, color: "var(--cream)", marginTop: 10, marginBottom: 10, lineHeight: 1.06 }}>
              Compare <span style={{ color: "var(--leaf)", fontStyle: "italic" }}>Your Parrots</span>
            </h2>
            <p style={{ color: "var(--fog)", fontSize: 14.5, lineHeight: 1.85, maxWidth: 480, margin: "0 auto" }}>Pick up to 3 birds and see them head-to-head — price, temperament, noise level, and more.</p>
            {savedAnswers && (
              <p style={{ fontSize: 11.5, color: "var(--leaf2)", fontWeight: 600, marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--leaf2)", display: "inline-block" }} />
                Quiz answers loaded — compatibility scores shown for each bird
              </p>
            )}
          </div>
        )}
        <div className="cmp-slot-grid rv" style={{ maxWidth: 860, margin: "0 auto 24px", gridTemplateColumns: selected.length === 0 ? "repeat(auto-fill,minmax(220px,1fr))" : `repeat(${Math.min(selected.length + (selected.length < 3 ? 1 : 0), 3)},1fr)` }}>
          {selected.map((b, i) => (
            <div key={b.id} className="cmp-slot-card filled" style={{ flexDirection: "column", alignItems: "flex-start", padding: 0, overflow: "hidden", minHeight: 230, animation: `fadeUp .4s var(--ease-out) ${i * 80}ms both` }}>
              <div style={{ width: "100%", height: 130, overflow: "hidden", position: "relative" }}>
                <img src={b.image} alt={b.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform .5s var(--ease-out)" }} onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.07)")} onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(4,13,6,.75) 0%,transparent 55%)" }} />
                <span style={{ position: "absolute", bottom: 8, left: 10, fontSize: 9, fontWeight: 700, background: "rgba(0,0,0,.4)", color: "#fff", padding: "2px 8px", borderRadius: 999, letterSpacing: 0.8, textTransform: "uppercase", backdropFilter: "blur(4px)" }}>{b.category}</span>
              </div>
              <div style={{ padding: "12px 14px 14px", flex: 1, width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6, marginBottom: 5 }}>
                  <h4 style={{ fontFamily: "var(--font-d)", fontWeight: 500, fontSize: 18, color: "var(--cream)", lineHeight: 1.1 }}>{b.name}</h4>
                  <span style={{ fontWeight: 700, fontSize: 11, color: "var(--leaf)", background: "rgba(34,197,94,.1)", padding: "2px 8px", borderRadius: 7, border: "1px solid rgba(34,197,94,.17)", flexShrink: 0 }}>{b.price}</span>
                </div>
                <p style={{ color: "var(--mist)", fontSize: 12, lineHeight: 1.65, marginBottom: savedAnswers ? 10 : 0 }}>{b.description}</p>
                {savedAnswers && (
                  <div style={{ marginTop: 4 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--mist)", marginBottom: 5 }}>Your Compatibility</div>
                    <CompatibilityBadge parrot={cbToParrot(b)} answers={savedAnswers} variant="bar" />
                  </div>
                )}
              </div>
              <button className="cmp-slot-remove" onClick={() => remove(b.id)}>✕</button>
            </div>
          ))}
          {selected.length < 3 && (
            <div className="cmp-slot-card" onClick={openPicker} style={{ flexDirection: "column", gap: 8, minHeight: 230 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(34,197,94,.1)", border: "1.5px dashed rgba(34,197,94,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "var(--leaf2)" }}>+</div>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--mist)" }}>Add a Bird</span>
              <span style={{ fontSize: 11, color: "var(--ghost)" }}>{3 - selected.length} slot{3 - selected.length !== 1 ? "s" : ""} remaining</span>
            </div>
          )}
        </div>
        <div className="rv" style={{ textAlign: "center", marginBottom: 36, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
          <button className="btn-j" onClick={openPicker} disabled={selected.length >= 3} style={{ padding: "11px 26px", fontSize: 13.5 }}>+ Add a Bird</button>
          {selected.length > 0 && <button className="btn-sm" onClick={clearAll}>✕ Clear All</button>}
        </div>
        {selected.length === 0 && (
          <div style={{ textAlign: "center", padding: "8px 0 12px", animation: "fadeUp .5s var(--ease-out) .3s both", opacity: 0, animationFillMode: "both" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(34,197,94,.06)", border: "1px solid rgba(34,197,94,.13)", borderRadius: 999, padding: "7px 18px", fontSize: 12.5, fontWeight: 600, color: "var(--leaf)" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--leaf2)", display: "inline-block", animation: "blink 2s infinite" }} />Click "+ Add a Bird" to start comparing
            </span>
          </div>
        )}
        {has2 && (
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div className="cmp-tab-row">
              {["overview", "specs", "scores", "verdict"].map((t) => (
                <button key={t} className={`cmp-tab-btn${activeTab === t ? " active" : ""}`} onClick={() => setAT(t)} style={{ textTransform: "capitalize" }}>{t}</button>
              ))}
            </div>
            {activeTab === "overview" && (
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${selected.length},1fr)`, gap: 16, marginBottom: 16 }}>
                {selected.map((b, i) => (
                  <div key={b.id} style={{ background: "var(--j0)", border: "1px solid rgba(34,197,94,.1)", borderRadius: "var(--rL)", overflow: "hidden", animation: "slideIn .4s var(--ease-out) both" }}>
                    <div style={{ background: "linear-gradient(135deg,rgba(22,163,74,.07),rgba(34,197,94,.03))", padding: "16px 18px", borderBottom: "1px solid rgba(34,197,94,.07)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <div style={{ width: 9, height: 9, borderRadius: "50%", background: CMP_COLORS[i], flexShrink: 0 }} />
                        <span style={{ fontFamily: "var(--font-d)", fontSize: 20, fontWeight: 500, color: "var(--cream)" }}>{b.name}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "var(--mist)", fontWeight: 600, letterSpacing: 0.4, paddingLeft: 17 }}>{b.category} · {b.price}</div>
                      {savedAnswers && (
                        <div style={{ marginTop: 10, paddingLeft: 17 }}>
                          <CompatibilityBadge parrot={cbToParrot(b)} answers={savedAnswers} variant="bar" />
                        </div>
                      )}
                    </div>
                    <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
                      {Object.entries(SCORE_LABELS).map(([k, l]) => (
                        <div key={k}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: 10.5, fontWeight: 600, color: "var(--mist)", letterSpacing: 0.5, textTransform: "uppercase" }}>{l}</span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--leaf)" }}>{b.scores[k]}/10</span>
                          </div>
                          <div className="cmp-score-bar-bg"><div className="cmp-score-bar-fill" style={{ width: `${b.scores[k] * 10}%`, background: CMP_COLORS[i] }} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "specs" && (
              <div style={{ background: "var(--j0)", border: "1px solid rgba(34,197,94,.1)", borderRadius: "var(--rL)", overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                  <table className="cmp-table" style={{ minWidth: 380 }}>
                    <thead><tr><th style={{ minWidth: 110 }}>Spec</th>{selected.map((b, i) => <th key={b.id}><div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: CMP_COLORS[i] }} />{b.name}</div></th>)}</tr></thead>
                    <tbody>
                      {SPEC_ROWS.map(({ key, label }) => {
                        const prices = selected.map((b) => parseInt(b.price.replace(/\D/g, "")));
                        const minP = Math.min(...prices);
                        return (
                          <tr key={key}>
                            <td>{label}</td>
                            {selected.map((b) => {
                              const isBest = key === "price" && parseInt(b.price.replace(/\D/g, "")) === minP && selected.length > 1;
                              return <td key={b.id} className={`bird-val${isBest ? " best-val" : ""}`}>{b[key]}{isBest && <span style={{ display: "inline-block", fontSize: 9, fontWeight: 800, padding: "1px 6px", borderRadius: 999, background: "rgba(34,197,94,.12)", color: "var(--leaf)", marginLeft: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>Lowest</span>}</td>;
                            })}
                          </tr>
                        );
                      })}
                      {savedAnswers && (
                        <tr>
                          <td>My Match</td>
                          {selected.map((b) => {
                            const score = calcCompatibility(cbToParrot(b), savedAnswers);
                            const isHighest = score === Math.max(...selected.map((s) => calcCompatibility(cbToParrot(s), savedAnswers)));
                            return (
                              <td key={b.id} className={`bird-val${isHighest && selected.length > 1 ? " best-val" : ""}`}>
                                <CompatibilityBadge parrot={cbToParrot(b)} answers={savedAnswers} variant="bar" />
                              </td>
                            );
                          })}
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === "scores" && (
              <div style={{ background: "var(--j0)", border: "1px solid rgba(34,197,94,.1)", borderRadius: "var(--rL)", padding: "24px 26px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", marginBottom: 22 }}>
                  {selected.map((b, i) => (
                    <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: CMP_COLORS[i] }} />
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--fog)" }}>{b.name}</span>
                    </div>
                  ))}
                </div>
                {Object.entries(SCORE_LABELS).map(([k, l]) => (
                  <div key={k} style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--mist)", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>{l}</div>
                    {selected.map((b, i) => (
                      <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--fog)", minWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.name}</span>
                        <div style={{ flex: 1, height: 7, background: "var(--j3)", borderRadius: 999, overflow: "hidden" }}><div style={{ height: "100%", borderRadius: 999, background: CMP_COLORS[i], width: `${b.scores[k] * 10}%`, transition: "width 1s var(--ease-out)" }} /></div>
                        <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--cream)", minWidth: 24, textAlign: "right" }}>{b.scores[k]}</span>
                      </div>
                    ))}
                  </div>
                ))}
                {savedAnswers && (
                  <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(34,197,94,.1)" }}>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--leaf2)", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 14 }}>🎯 Your Personal Compatibility</div>
                    {selected.map((b) => (
                      <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--fog)", minWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.name}</span>
                        <div style={{ flex: 1 }}><CompatibilityBadge parrot={cbToParrot(b)} answers={savedAnswers} variant="bar" /></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === "verdict" && winner && (
              <div style={{ background: "var(--j0)", border: "1px solid rgba(34,197,94,.1)", borderRadius: "var(--rL)", padding: "28px 26px" }}>
                <div style={{ textAlign: "center", marginBottom: 26 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: "var(--mist)", marginBottom: 8 }}>Overall Winner</div>
                  <div style={{ fontFamily: "var(--font-d)", fontSize: "clamp(28px,4vw,42px)", fontWeight: 500, color: "var(--cream)", marginBottom: 8 }}>{winner.b.name}</div>
                  <span className="cmp-winner-badge">🏆 Best Overall · {winner.total}/60</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12, marginBottom: 22 }}>
                  {totals.map(({ b, total }, i) => (
                    <div key={b.id} style={{ background: b === winner.b ? "rgba(34,197,94,.04)" : "var(--j2)", border: `1px solid ${b === winner.b ? "rgba(34,197,94,.3)" : "rgba(34,197,94,.1)"}`, borderRadius: "var(--r)", padding: "16px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: CMP_COLORS[i] }} />
                        <span style={{ fontFamily: "var(--font-d)", fontSize: 18, fontWeight: 500, color: "var(--cream)" }}>{b.name}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "var(--mist)", marginBottom: 11 }}>{b.price} · {b.category}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                        <div style={{ flex: 1, height: 6, background: "var(--j3)", borderRadius: 999, overflow: "hidden" }}><div style={{ height: "100%", borderRadius: 999, background: CMP_COLORS[i], width: `${(total / 60) * 100}%`, transition: "width 1s var(--ease-out)" }} /></div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--cream)" }}>{total}<span style={{ fontSize: 10, color: "var(--mist)" }}>{"/60"}</span></span>
                      </div>
                      {Object.entries(b.scores).slice(0, 3).map(([k, v]) => (
                        <div key={k} style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(34,197,94,.07)", paddingTop: 6, marginTop: 6 }}>
                          <span style={{ fontSize: 11, color: "var(--mist)" }}>{SCORE_LABELS[k]}</span><span style={{ fontSize: 11, fontWeight: 700, color: "var(--cream)" }}>{v}/10</span>
                        </div>
                      ))}
                      {savedAnswers && (
                        <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid rgba(34,197,94,.07)" }}>
                          <div style={{ fontSize: 9, fontWeight: 700, color: "var(--mist)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 5 }}>Your Match</div>
                          <CompatibilityBadge parrot={cbToParrot(b)} answers={savedAnswers} variant="bar" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ background: "rgba(34,197,94,.04)", border: "1px solid rgba(34,197,94,.13)", borderRadius: "var(--r)", padding: "16px 20px" }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--leaf)", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 7 }}>Expert Tip</div>
                  <p style={{ fontSize: 13.5, color: "var(--fog)", lineHeight: 1.85 }}>{tip()}</p>
                </div>
              </div>
            )}
            <div style={{ textAlign: "center", marginTop: 24 }}><button className="btn-wa-lg" onClick={shareWA}><WAIco size={15} /> Share Comparison on WhatsApp</button></div>
          </div>
        )}
      </section>
      {pickerOpen && (
        <div className="cmp-modal-bg" onClick={() => setPO(false)}>
          <div className="cmp-modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div>
                <h3 style={{ fontFamily: "var(--font-d)", fontSize: 26, fontWeight: 500, color: "var(--cream)" }}>Pick a Bird to Compare</h3>
                <p style={{ fontSize: 12, color: "var(--mist)", marginTop: 3 }}>{pickerTemp.length + selected.filter((b) => pickerTemp.includes(b.id)).length} selected · max 3</p>
              </div>
              <button onClick={() => setPO(false)} style={{ background: "var(--j2)", border: "1px solid var(--j3)", borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, color: "var(--fog)" }}>✕</button>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>{cats.map((c) => <button key={c} className={`cmp-pill-btn${activeCat === c ? " act" : ""}`} onClick={() => setAC(c)}>{c}</button>)}</div>
            <div className="cmp-picker-grid">
              {pList.map((b) => {
                const inS = !!selected.find((s) => s.id === b.id);
                const inT = pickerTemp.includes(b.id);
                const isC = inS || inT;
                const canAdd = pickerTemp.length + selected.length < 3;
                const isDis = !isC && !canAdd;
                return (
                  <div key={b.id} className={`cmp-picker-card${isC ? " selected" : ""}${isDis ? " disabled" : ""}`} onClick={() => !isDis && !inS && togglePick(b.id)}>
                    <img src={b.image} alt={b.name} style={{ width: "100%", height: 105, objectFit: "cover", display: "block" }} />
                    <div style={{ padding: "10px 12px" }}>
                      <div style={{ fontFamily: "var(--font-d)", fontSize: 16, fontWeight: 500, color: "var(--cream)", marginBottom: 2 }}>{b.name}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: savedAnswers ? 8 : 0 }}>
                        <span style={{ fontSize: 11, color: "var(--mist)", fontWeight: 600 }}>{b.category}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--leaf)" }}>{b.price}</span>
                      </div>
                      {savedAnswers && <CompatibilityBadge parrot={cbToParrot(b)} answers={savedAnswers} variant="bar" />}
                    </div>
                    {isC && <div className="cmp-sel-check">✓</div>}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button className="btn-sm" onClick={() => setPO(false)}>Cancel</button>
              <button className="btn-j" style={{ padding: "11px 26px" }} onClick={confirm}>Add Selected →</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
