/* ═══════════════════════════════════════════════════
   HOME — composes every section in order. This is the
   "everything in one page" view; each section also has
   its own standalone route (see pages/About.jsx etc.)
═══════════════════════════════════════════════════ */
import { parrots } from "../data/parrots";
import BirdQuiz from "../components/Quiz/BirdQuiz";
import ChatAssistant from "../components/ChatAssistant/ChatAssistant";

import Hero from "../components/sections/Hero";
import TrustStrip from "../components/sections/TrustStrip";
import About from "../components/sections/About";
import BirdsShowcase from "../components/sections/BirdsShowcase";
import CompareSection from "../components/sections/CompareSection";
import Reviews from "../components/sections/Reviews";
import FAQSection from "../components/sections/FAQSection";
import Newsletter from "../components/sections/Newsletter";
import CTASection from "../components/sections/CTASection";

export default function Home() {
  return (
    <div style={{ background: "var(--j0)", color: "var(--cream)", fontFamily: "var(--font-b)", minHeight: "100vh" }}>
      <Hero />
      <TrustStrip />
      <BirdQuiz parrots={parrots} />
      <hr className="jhr" />
      <About />
      <hr className="jhr" />
      <Reviews />
      <hr className="jhr" />
      <BirdsShowcase parrots={parrots} />
      <hr className="jhr" />
      <CompareSection parrots={parrots} />
      <hr className="jhr" />
      <FAQSection />
      <hr className="jhr" />
      <Newsletter />
      <hr className="jhr" />
      <CTASection />
      <ChatAssistant parrots={parrots} />
    </div>
  );
}
