/* ═══════════════════════════════════════════════════
   REVIEWS — rating summary, review grid, submit form
═══════════════════════════════════════════════════ */
import { useState, useEffect, useCallback } from "react";
import { Leaf, CheckIco, Spin } from "../ui/Icons";
import Avatar from "../ui/Avatar";
import Stars from "../ui/Stars";
import { toast } from "../ui/Toast";

export default function Reviews({ standalone = false }) {
  const [reviews, setReviews] = useState([]);
  const [reviewsError, setReviewsError] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewName, setRN] = useState("");
  const [reviewComment, setRC] = useState("");
  const [reviewLoading, setRL] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(`/api/reviews`, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
        setReviewsError(false);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Reviews fetch failed:", err);
        setReviewsError(true);
      }
    })();
    return () => controller.abort();
  }, []);

  const handleReviewSubmit = useCallback(async () => {
    if (!reviewName.trim()) { toast.warn("Please enter your name."); return; }
    if (!reviewComment.trim()) { toast.warn("Please write a comment."); return; }
    setRL(true);
    try {
      const res = await fetch(`/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: reviewName.trim(), rating, comment: reviewComment.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.msg || "Failed to submit");
      setReviews((prev) => [data, ...prev]);
      setRN(""); setRC(""); setRating(5); setReviewsError(false);
      toast.success("Review submitted 🎉");
    } catch (err) {
      console.error("Review submit error:", err);
      toast.error("Could not reach the server.");
    } finally {
      setRL(false);
    }
  }, [reviewName, reviewComment, rating]);

  const avgRating = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : "5.0";
  const rDist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => { if (rDist[r.rating] !== undefined) rDist[r.rating]++; });

  return (
    <section id="reviews" className="sp" style={{ background: "var(--j1)", position: "relative", overflow: "hidden" }}>
      <Leaf style={{ width: 130, top: "4%", right: "3%", transform: "rotate(14deg)" }} />
      {!standalone && (
        <div className="rv" style={{ textAlign: "center", marginBottom: 44 }}>
          <span className="stag">Happy Customers</span>
          <h2 style={{ fontFamily: "var(--font-d)", fontSize: "clamp(24px,3.8vw,50px)", fontWeight: 500, color: "var(--cream)", marginTop: 10 }}>What People Are Saying</h2>
        </div>
      )}
      {reviewsError && (
        <div className="offline-banner rv">
          <span style={{ fontSize: 18 }}>⚠️</span>
          <span>
            Reviews couldn't load — the backend server isn't reachable. Check that{" "}
            <code style={{ background: "rgba(153,27,27,.1)", padding: "1px 5px", borderRadius: 4, fontSize: 12 }}>VITE_API_URL</code>{" "}
            is set correctly in your hosting environment variables and that your Flask server is running.{" "}
            <a href="https://wa.me/919556747518">Contact us on WhatsApp</a> if you need help.
          </span>
        </div>
      )}
      {!reviewsError && (
        <div className="rv" style={{ display: "flex", gap: 28, alignItems: "center", background: "var(--j0)", borderRadius: "var(--rXL)", padding: "24px 28px", maxWidth: 640, margin: "0 auto 44px", border: "1px solid rgba(34,197,94,.1)", flexWrap: "wrap" }}>
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontFamily: "var(--font-d)", fontSize: 52, fontWeight: 500, color: "var(--cream)", lineHeight: 1 }}>{avgRating}</div>
            <div style={{ color: "var(--gold3)", fontSize: 16, letterSpacing: 2, margin: "4px 0" }}>{"★".repeat(Math.round(Number(avgRating)))}</div>
            <div style={{ fontSize: 11, color: "var(--mist)", fontWeight: 600 }}>{reviews.length} reviews</div>
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            {[5, 4, 3, 2, 1].map((n) => {
              const cnt = rDist[n] || 0, pct = reviews.length ? (cnt / reviews.length) * 100 : 0;
              return (
                <div key={n} className="rbar-row">
                  <span style={{ fontSize: 11, fontWeight: 600, color: "var(--mist)", width: 12 }}>{n}</span>
                  <span style={{ color: "var(--gold3)", fontSize: 11 }}>★</span>
                  <div className="rbar-bg"><div className="rbar-fill" style={{ width: `${pct}%` }} /></div>
                  <span style={{ fontSize: 11, color: "var(--mist)", width: 18, textAlign: "right" }}>{cnt}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {reviews.length > 0 && (
        <div className="rg">
          {reviews.map((r, i) => (
            <div key={r.id ?? i} className="rev-card rv" style={{ transitionDelay: `${i * 45}ms` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <Avatar name={r.name} />
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: 13, marginBottom: 3, color: "var(--cream)" }}>{r.name}</h4>
                  <div style={{ color: "var(--gold3)", fontSize: 12.5, letterSpacing: 1.5 }}>{"★".repeat(r.rating)}<span style={{ color: "var(--j4)" }}>{"★".repeat(5 - r.rating)}</span></div>
                </div>
              </div>
              <p style={{ color: "var(--fog)", fontSize: 13.5, lineHeight: 1.85, position: "relative", zIndex: 1 }}>{r.comment}</p>
            </div>
          ))}
        </div>
      )}
      <div className="rv" style={{ background: "var(--j0)", border: "1px solid rgba(34,197,94,.11)", borderRadius: "var(--rXL)", padding: "32px 28px", maxWidth: 500, margin: "0 auto" }}>
        <h3 style={{ fontFamily: "var(--font-d)", fontSize: 25, fontWeight: 500, marginBottom: 20, color: "var(--cream)" }}>Share Your Experience</h3>
        <input type="text" placeholder="Your Name" className="j-input" style={{ marginBottom: 11 }} value={reviewName} onChange={(e) => setRN(e.target.value)} />
        <textarea placeholder="Tell others about your experience…" className="j-input" rows={4} style={{ marginBottom: 11, resize: "vertical" }} value={reviewComment} onChange={(e) => setRC(e.target.value)} />
        <Stars onSelect={setRating} initial={rating} />
        <button className="btn-j" style={{ width: "100%", justifyContent: "center", marginTop: 4 }} onClick={handleReviewSubmit} disabled={reviewLoading}>
          {reviewLoading ? <><Spin />&nbsp;Submitting…</> : <><CheckIco />&nbsp;Submit Review</>}
        </button>
      </div>
    </section>
  );
}
