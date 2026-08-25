/* ═══════════════════════════════════════════════════
   ABOUT PAGE — standalone view of the About section
═══════════════════════════════════════════════════ */
import PageBanner from "../components/PageBanner";
import About from "../components/sections/About";
import TrustStrip from "../components/sections/TrustStrip";
import CTASection from "../components/sections/CTASection";

export default function AboutPage() {
  return (
    <div style={{ background: "var(--j0)", color: "var(--cream)", fontFamily: "var(--font-b)", minHeight: "100vh" }}>
      <PageBanner eyebrow="Who We Are" title="About" accent="Feathers Town" desc="We go beyond selling birds. Every parrot is raised with care, trained with patience, and placed in a loving home — complete with guidance on behaviour, diet, and lifestyle." />
      <About standalone />
      <hr className="jhr" />
      <TrustStrip />
      <hr className="jhr" />
      <CTASection />
    </div>
  );
}
