import { useState } from "react";
import { Leaf } from "../ui/Icons";

const FAQS = [
  { q: "Are your parrots hand-fed from birth?", a: "Yes, every parrot we raise is hand-fed from hatch. This makes them exceptionally tame, social, and comfortable with human interaction from day one." },
  { q: "What species do you currently have available?", a: "We stock a rotating selection including African Greys, Cockatiels, Lovebirds, Conures, and more. Use the filter above to see what's currently listed." },
  { q: "Do you provide training support after purchase?", a: "Absolutely. Every purchase includes one-to-one WhatsApp guidance from our experts for the lifetime of your bird — from diet and taming to health checks and behaviour." },
  { q: "Can I request a breed not listed?", a: "Yes! Contact us on WhatsApp and we'll do our best to source it. We're continually expanding our collection and love taking requests." },
  { q: "Do you offer delivery or in-person pickup only?", a: "Currently we operate from Bhubaneswar, Odisha. Local pickup is preferred for the bird's well-being, but we can discuss safe transport options for serious buyers." },
  { q: "What does the price include?", a: "The listed price covers the bird, a starter diet pack, a care guide booklet, and lifetime WhatsApp support. Cage, accessories, and follow-up training add-ons are available separately." },
];

export default function FAQSection({ standalone = false }) {
  const [openFaq, setFaq] = useState(null);

  return (
    <section
      className="sp"
      style={{ background: "var(--j1)", position: "relative", overflow: "hidden" }}
    >
      <Leaf style={{ width: 120, top: "5%", left: "-1%", transform: "rotate(-10deg)" }} />
      <Leaf style={{ width: 95, bottom: "5%", right: "1%", transform: "rotate(18deg)" }} />

      {!standalone && (
        <div className="rv" style={{ textAlign: "center", marginBottom: 44 }}>
          <span className="stag">Got Questions?</span>
          <h2
            style={{
              fontFamily: "var(--font-d)",
              fontSize: "clamp(24px,3.8vw,50px)",
              fontWeight: 500,
              color: "var(--cream)",
              marginTop: 10,
              marginBottom: 12,
            }}
          >
            Frequently Asked{" "}
            <span style={{ color: "var(--leaf)", fontStyle: "italic" }}>Questions</span>
          </h2>
          <p
            style={{
              color: "var(--fog)",
              fontSize: 14.5,
              lineHeight: 1.85,
              maxWidth: 480,
              margin: "0 auto",
            }}
          >
            Everything you need to know before bringing your new feathered friend home.
          </p>
        </div>
      )}

      <div style={{ maxWidth: 740, margin: "0 auto" }}>
        {FAQS.map((f, i) => {
          const isOpen = openFaq === i;
          return (
            <div
              key={i}
              className="rv"
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                transitionDelay: `${i * 50}ms`,
              }}
            >
              {/* Question button */}
              <button
                onClick={() => setFaq(isOpen ? null : i)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                  padding: "20px 0",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--cream)",
                  fontFamily: "var(--font-b)",
                  fontSize: 15.5,
                  fontWeight: 500,
                  textAlign: "left",
                  lineHeight: 1.5,
                }}
              >
                <span>{f.q}</span>
                <span
                  style={{
                    flexShrink: 0,
                    fontSize: 24,
                    fontWeight: 300,
                    color: "var(--leaf)",
                    lineHeight: 1,
                    transition: "transform 0.35s ease",
                    transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                  }}
                >
                  +
                </span>
              </button>

              {/* Answer — inline max-height toggle */}
              <div
                style={{
                  maxHeight: isOpen ? "400px" : "0px",
                  overflow: "hidden",
                  transition: "max-height 0.4s ease",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    paddingBottom: 20,
                    color: "var(--fog)",
                    fontSize: 14.5,
                    lineHeight: 1.85,
                  }}
                >
                  {f.a}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}