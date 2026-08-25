/* ═══════════════════════════════════════════════════════════════
   Feathers Town — Recommendation & Compatibility Engine
   /utils/recommendation.js
═══════════════════════════════════════════════════════════════ */

/**
 * Bird trait profiles — keyed by parrot name (matches parrots data).
 * Each trait is 0–10. These supplement whatever's in the parrots array.
 */
export const BIRD_PROFILES = {
  "African Grey": {
    noise: 5,          // medium
    talkativeness: 10,
    tamability: 8,
    beginner: 3,       // not beginner friendly
    spaceNeeded: 8,    // needs space
    timeNeeded: 9,     // high time demand
    minBudget: 40000,
    decorative: 5,
    friendly: 8,
    matchReason: "Extraordinarily intelligent and the best talker in the parrot world. Ideal for experienced owners who can invest serious time.",
  },
  "Cockatiel": {
    noise: 8,
    talkativeness: 6,
    tamability: 10,
    beginner: 10,
    spaceNeeded: 4,
    timeNeeded: 5,
    minBudget: 2500,
    decorative: 7,
    friendly: 10,
    matchReason: "The perfect starter bird — gentle, affectionate, quiet enough for apartments, and absolutely loves human company.",
  },
  "Lovebird": {
    noise: 6,
    talkativeness: 3,
    tamability: 7,
    beginner: 7,
    spaceNeeded: 3,
    timeNeeded: 6,
    minBudget: 1500,
    decorative: 9,
    friendly: 8,
    matchReason: "Stunning colours and a deeply affectionate nature make lovebirds a beautiful, compact companion for smaller spaces.",
  },
  "Sun Conure": {
    noise: 2,
    talkativeness: 5,
    tamability: 8,
    beginner: 5,
    spaceNeeded: 5,
    timeNeeded: 8,
    minBudget: 15000,
    decorative: 10,
    friendly: 9,
    matchReason: "Brilliantly colourful and incredibly affectionate — best for owners who want a visually spectacular, energetic companion.",
  },
  "Green Cheek Conure": {
    noise: 8,
    talkativeness: 4,
    tamability: 9,
    beginner: 8,
    spaceNeeded: 4,
    timeNeeded: 6,
    minBudget: 4000,
    decorative: 8,
    friendly: 9,
    matchReason: "One of the quietest conures — great for apartments. Cuddly and gentle, with a playful personality that's hard to resist.",
  },
  "Pineapple Conure": {
    noise: 5,
    talkativeness: 4,
    tamability: 7,
    beginner: 6,
    spaceNeeded: 4,
    timeNeeded: 7,
    minBudget: 5000,
    decorative: 10,
    friendly: 8,
    matchReason: "Stunning pineapple colouring and a bold, energetic personality. A real showstopper that loves attention.",
  },
  "Cinnamon Conure": {
    noise: 6,
    talkativeness: 4,
    tamability: 8,
    beginner: 8,
    spaceNeeded: 4,
    timeNeeded: 6,
    minBudget: 7000,
    decorative: 9,
    friendly: 9,
    matchReason: "Warm cinnamon tones with an affectionate, calm personality. A gorgeous bird that's surprisingly easy to bond with.",
  },
};

/**
 * Returns a profile for any bird, falling back to sensible defaults.
 */
export function getProfile(name) {
  return BIRD_PROFILES[name] ?? {
    noise: 5, talkativeness: 5, tamability: 5, beginner: 5,
    spaceNeeded: 5, timeNeeded: 5, minBudget: 5000,
    decorative: 5, friendly: 5,
    matchReason: "A wonderful companion with a unique personality.",
  };
}

/**
 * Quiz answers shape:
 * {
 *   budget: number (₹),
 *   noise: "Low" | "Medium" | "High",
 *   experience: "Beginner" | "Intermediate" | "Expert",
 *   purpose: "Talking" | "Friendly" | "Decorative",
 *   space: "Apartment" | "House",
 *   time: "Low" | "High",
 * }
 *
 * Returns 0–100 compatibility score.
 */
export function calcCompatibility(parrot, answers) {
  const p = getProfile(parrot.name);
  let score = 0;
  let maxScore = 0;

  // ── Budget (20 pts) ─────────────────────────────────────────
  maxScore += 20;
  const price = parsePriceNum(parrot.price);
  if (answers.budget && price <= answers.budget) score += 20;
  else if (answers.budget && price <= answers.budget * 1.25) score += 12;
  else if (answers.budget && price <= answers.budget * 1.5) score += 5;

  // ── Noise tolerance (18 pts) ────────────────────────────────
  maxScore += 18;
  const noisePref = { Low: 10, Medium: 5, High: 0 }[answers.noise] ?? 5;
  const noiseScore = Math.abs(p.noise - noisePref) <= 2 ? 18 : Math.abs(p.noise - noisePref) <= 4 ? 10 : 3;
  // Low tolerance → want high noise score (quiet bird)
  if (answers.noise === "Low") score += p.noise >= 7 ? 18 : p.noise >= 5 ? 10 : 3;
  else if (answers.noise === "Medium") score += p.noise >= 4 && p.noise <= 7 ? 18 : 8;
  else score += 18; // High tolerance → any bird is fine

  // ── Experience (18 pts) ─────────────────────────────────────
  maxScore += 18;
  const expMap = { Beginner: p.beginner, Intermediate: Math.min(10, p.beginner + 3), Expert: 10 };
  score += Math.round((expMap[answers.experience] ?? 5) / 10 * 18);

  // ── Purpose (22 pts) ────────────────────────────────────────
  maxScore += 22;
  if (answers.purpose === "Talking") score += Math.round(p.talkativeness / 10 * 22);
  else if (answers.purpose === "Friendly") score += Math.round(p.friendly / 10 * 22);
  else score += Math.round(p.decorative / 10 * 22); // Decorative

  // ── Space (12 pts) ──────────────────────────────────────────
  maxScore += 12;
  if (answers.space === "Apartment") score += p.spaceNeeded <= 5 ? 12 : p.spaceNeeded <= 7 ? 6 : 2;
  else score += 12; // House → all fine

  // ── Time (10 pts) ───────────────────────────────────────────
  maxScore += 10;
  if (answers.time === "Low") score += p.timeNeeded <= 5 ? 10 : p.timeNeeded <= 7 ? 5 : 1;
  else score += 10;

  return Math.round(Math.min(100, (score / maxScore) * 100));
}

/** Compatibility label & colour */
export function compatLabel(pct) {
  if (pct >= 80) return { label: "Perfect Match", color: "#22c55e", bg: "rgba(34,197,94,.12)", border: "rgba(34,197,94,.28)" };
  if (pct >= 60) return { label: "Good Choice",   color: "#f59e0b", bg: "rgba(245,158,11,.10)", border: "rgba(245,158,11,.26)" };
  return               { label: "Needs Consideration", color: "#ef4444", bg: "rgba(239,68,68,.08)", border: "rgba(239,68,68,.2)" };
}

/** Parse "₹3,500" → 3500 */
export function parsePriceNum(str = "") {
  return parseInt(str.replace(/[^\d]/g, ""), 10) || 0;
}

/**
 * Given answers + full parrots list, return sorted array of
 * { parrot, score, label, reason } objects.
 */
export function rankParrots(parrots, answers) {
  return parrots
    .map(p => {
      const score = calcCompatibility(p, answers);
      const { label, color, bg, border } = compatLabel(score);
      const profile = getProfile(p.name);
      return { parrot: p, score, label, color, bg, border, reason: profile.matchReason };
    })
    .sort((a, b) => b.score - a.score);
}

/* ─── Chat / Intent Matching ────────────────────────────────── */

const INTENTS = [
  { keys: ["beginner", "starter", "first", "easy", "new to"],    type: "beginner"  },
  { keys: ["quiet", "silent", "low noise", "apartment", "flat"],  type: "quiet"     },
  { keys: ["talk", "speaking", "speaks", "vocal", "words"],       type: "talker"    },
  { keys: ["cheap", "budget", "affordable", "under", "less than", "₹"], type: "budget" },
  { keys: ["friendly", "social", "cuddly", "affectionate"],       type: "friendly"  },
  { keys: ["beautiful", "pretty", "colourful", "colorful", "decor", "decorative"], type: "decorative" },
  { keys: ["intelligent", "smart", "clever"],                     type: "intelligent"},
  { keys: ["small", "tiny", "compact"],                           type: "small"     },
];

export function detectIntent(text) {
  const lower = text.toLowerCase();
  for (const intent of INTENTS) {
    if (intent.keys.some(k => lower.includes(k))) return intent.type;
  }
  return "general";
}

export function extractBudget(text) {
  const m = text.match(/[₹\d,]+/g);
  if (!m) return null;
  const nums = m.map(s => parseInt(s.replace(/[^\d]/g, ""), 10)).filter(Boolean);
  return nums.length ? Math.max(...nums) : null;
}

export function filterByIntent(parrots, intent, budget = null) {
  const sorted = [...parrots];
  const profileSort = (key, desc = true) =>
    sorted.sort((a, b) => desc
      ? (getProfile(b.name)[key] ?? 0) - (getProfile(a.name)[key] ?? 0)
      : (getProfile(a.name)[key] ?? 0) - (getProfile(b.name)[key] ?? 0)
    );

  switch (intent) {
    case "beginner":   return profileSort("beginner").slice(0, 3);
    case "quiet":      return profileSort("noise").slice(0, 3);
    case "talker":     return profileSort("talkativeness").slice(0, 3);
    case "friendly":   return profileSort("friendly").slice(0, 3);
    case "decorative": return profileSort("decorative").slice(0, 3);
    case "intelligent":return profileSort("tamability").slice(0, 3);
    case "small":      return sorted.filter(p => p.category === "Small").slice(0, 3);
    case "budget": {
      const cap = budget ?? 5000;
      const filtered = sorted.filter(p => parsePriceNum(p.price) <= cap);
      return filtered.length ? filtered.slice(0, 3) : profileSort("beginner").slice(0, 3);
    }
    default: return profileSort("beginner").slice(0, 3);
  }
}

export function buildChatReply(intent, birds, budget) {
  const msgs = {
    beginner:    "Here are our most beginner-friendly parrots — gentle, easy to tame, and perfect for first-time owners:",
    quiet:       "These are our quietest birds — great for apartments or noise-sensitive homes:",
    talker:      "Want a chatty companion? These birds are our best talkers:",
    friendly:    "Looking for an affectionate cuddler? Meet our friendliest parrots:",
    decorative:  "These birds are absolute stunners — eye-catching colours and gorgeous plumage:",
    intelligent: "Our most intelligent and trainable parrots:",
    small:       "Compact but full of personality — our small-breed parrots:",
    budget:      budget ? `Here are our best birds under ₹${budget.toLocaleString("en-IN")}:` : "Our most affordable parrots:",
    general:     "Here are some of our most popular parrots I'd recommend:",
  };
  return msgs[intent] ?? msgs.general;
}