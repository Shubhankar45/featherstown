/* ═══════════════════════════════════════════════════
   COMPARE PAGE — standalone view of the compare tool
═══════════════════════════════════════════════════ */
import { parrots } from "../data/parrots";
import PageBanner from "../components/PageBanner";
import CompareSection from "../components/sections/CompareSection";

export default function ComparePage() {
  return (
    <div style={{ background: "var(--j0)", color: "var(--cream)", fontFamily: "var(--font-b)", minHeight: "100vh" }}>
      <PageBanner eyebrow="Side by Side" title="Compare" accent="Your Parrots" desc="Pick up to 3 birds and see them head-to-head — price, temperament, noise level, and more." />
      <CompareSection parrots={parrots} standalone />
    </div>
  );
}
