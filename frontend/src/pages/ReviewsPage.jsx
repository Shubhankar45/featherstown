/* ═══════════════════════════════════════════════════
   REVIEWS PAGE — standalone view of customer reviews
═══════════════════════════════════════════════════ */
import PageBanner from "../components/PageBanner";
import Reviews from "../components/sections/Reviews";

export default function ReviewsPage() {
  return (
    <div style={{ background: "var(--j0)", color: "var(--cream)", fontFamily: "var(--font-b)", minHeight: "100vh" }}>
      <PageBanner eyebrow="Happy Customers" title="What People" accent="Are Saying" desc="Real feedback from real bird owners across Odisha. Leave your own review below." />
      <Reviews standalone />
    </div>
  );
}
