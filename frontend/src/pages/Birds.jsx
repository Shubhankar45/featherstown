/* ═══════════════════════════════════════════════════
   BIRDS PAGE — standalone view of the showcase/shop
═══════════════════════════════════════════════════ */
import { parrots } from "../data/parrots";
import PageBanner from "../components/PageBanner";
import BirdsShowcase from "../components/sections/BirdsShowcase";

export default function BirdsPage() {
  return (
    <div style={{ background: "var(--j0)", color: "var(--cream)", fontFamily: "var(--font-b)", minHeight: "100vh" }}>
      <PageBanner eyebrow="Our Collection" title="Popular" accent="Parrots" desc="Check up to 3 birds to compare on WhatsApp. Every bird is hand-fed and vet-checked before sale." />
      <BirdsShowcase parrots={parrots} standalone />
    </div>
  );
}
