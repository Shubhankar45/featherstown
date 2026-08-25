/* ═══════════════════════════════════════════════════
   CONTACT PAGE — newsletter + CTA + (global) footer
═══════════════════════════════════════════════════ */
import PageBanner from "../components/PageBanner";
import FAQSection from "../components/sections/FAQSection";
import Newsletter from "../components/sections/Newsletter";
import CTASection from "../components/sections/CTASection";

export default function ContactPage() {
  return (
    <div style={{ background: "var(--j0)", color: "var(--cream)", fontFamily: "var(--font-b)", minHeight: "100vh" }}>
      <PageBanner eyebrow="Get in Touch" title="Contact" accent="Feathers Town" desc="Have a question, need advice, or want to bring home a new bird? Reach out — we reply fast on WhatsApp." />
      <CTASection />
      <hr className="jhr" />
      <Newsletter />
      <hr className="jhr" />
      <FAQSection standalone />
    </div>
  );
}
