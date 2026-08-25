import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import fs from "fs";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import morgan from "morgan";

import connectDB from "./config/db.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import Review from "./models/Review.js";
import Subscriber from "./models/Subscriber.js";

/* ───────── PATHS (fixed Windows-safe resolution) ───────── */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ───────── ENV ───────── */
dotenv.config({ path: path.join(__dirname, ".env") });

const isProd = process.env.NODE_ENV === "production";

/* ───────── REQUIRED ENV CHECK ─────────
   Fail fast and loudly on startup instead of limping along with
   undefined values that cause confusing runtime errors later.
*/
const requiredEnv = ["MONGO_URI"];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length) {
  console.error("❌ Missing required environment variables:", missingEnv.join(", "));
  process.exit(1);
}

await connectDB();

const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");

/* ───────── LOGGING ───────── */
app.use(morgan(isProd ? "combined" : "dev"));

/* ───────── SECURITY HEADERS ───────── */
app.use(
  helmet({
    contentSecurityPolicy: false, // enable/configure if you serve inline scripts you control
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

/* ───────── COMPRESSION ───────── */
app.use(compression());

/* ───────── CORS ───────── */
const allowedOrigins = [
  "http://localhost:5173",
  "https://featherstown-y1cy.onrender.com",
  "https://feathertown.online",
  "https://www.feathertown.online",
];

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without Origin
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn("Blocked Origin:", origin);
      return callback(null, false);
      // Never throw Error here
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "100kb" })); // cap body size against abuse

/* ───────── RATE LIMITING ───────── */
// General API limiter — generous, just stops brute-force/scraping abuse.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

// Tighter limiter specifically for subscribe — this is the route most
// likely to get hit by bots/spam signups.
const subscribeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { msg: "Too many attempts. Please try again later." },
});

/* ───────── PATHS: frontend dist ───────── */
const frontendPath = path.join(__dirname, "../frontend/dist");
const indexPath = path.join(frontendPath, "index.html");

console.log("📁 frontendPath:", frontendPath);
console.log("📦 Dist exists:", fs.existsSync(frontendPath));
console.log("📄 Index exists:", fs.existsSync(indexPath));

/* ═══════════════════════════════════════════════════════════════
   EMAIL AUTOMATION
   Single source of truth for the automated welcome email.
   One email, one template, one transporter — configured entirely
   through MAIL_* environment variables.
═══════════════════════════════════════════════════════════════ */

/* ───────── Branded sender identity ─────────
   From-address defaults to the authenticated mailbox (most SMTP
   providers require From == auth user). MAIL_FROM lets advanced
   setups override it; MAIL_FROM_NAME sets the friendly display name.
*/
const MAIL_FROM_ADDRESS = process.env.MAIL_FROM || process.env.MAIL_USER;
const MAIL_FROM_NAME = process.env.MAIL_FROM_NAME || "FeatherTown 🦜";
const WELCOME_SUBJECT = "Welcome to FeatherTown 🦜";

/* ───────── EMAIL DEBUG (mask password) ───────── */
console.log("📧 MAIL DEBUG:", {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  user: process.env.MAIL_USER,
  from: MAIL_FROM_ADDRESS,
  pass: process.env.MAIL_PASS ? "EXISTS" : "MISSING",
});

/* ───────── TRANSPORTER ───────── */
let transporter = null;

if (process.env.MAIL_HOST && process.env.MAIL_USER && process.env.MAIL_PASS) {
  const mailPort = Number(process.env.MAIL_PORT) || 465;
  const mailSecure =
    process.env.MAIL_SECURE !== undefined
      ? process.env.MAIL_SECURE === "true"
      : mailPort === 465;

  transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: mailPort,
    secure: mailSecure,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  transporter.verify((err) => {
    if (err) {
      console.error("❌ Mail Error:", err.message);
    } else {
      console.log(`✅ Mail Ready (host: ${process.env.MAIL_HOST}, port: ${mailPort}, secure: ${mailSecure})`);
    }
  });
} else {
  console.warn("⚠️ Mail disabled (env missing)");
}

/* ───────── EMAIL TEMPLATE (loaded once, cached) ─────────
   NOTE: the template is read at startup and cached in memory, so
   restart the server after editing templates/welcome_email.html.
*/
let welcomeEmailHTML = "<p>Welcome to FeatherTown 🦜</p>";

try {
  const templatePath = path.join(__dirname, "templates", "welcome_email.html");
  if (fs.existsSync(templatePath)) {
    welcomeEmailHTML = fs.readFileSync(templatePath, "utf-8");
    console.log("✅ Email template loaded");
  } else {
    console.warn("⚠️ Template not found, using fallback");
  }
} catch (err) {
  console.warn("⚠️ Template error:", err.message);
}

/* Plain-text fallback — shown by text-only clients and improves
   deliverability (mail with both HTML + text is less spam-flagged). */
const welcomeEmailText = [
  "Welcome to FeatherTown 🦜",
  "",
  "Thanks for subscribing! You'll now get expert bird-care tips, nutrition",
  "guides, and a first look at our newest arrivals — straight to your inbox.",
  "",
  "Explore our birds:  https://www.feathertown.online",
  "Chat on WhatsApp:   https://wa.me/919556747518",
  "",
  "FeatherTown · Sundargarh, Odisha, India",
  "support@feathertown.online · +91 9556747518",
  "",
  "You're receiving this because you subscribed at feathertown.online.",
  "To unsubscribe, reply to this email with the subject 'Unsubscribe'.",
].join("\n");

/* ───────── Background email sender (never blocks the response) ───────── */
function sendWelcomeEmailAsync(email) {
  if (!transporter) {
    console.warn("⚠️ Email not sent (transporter missing) for:", email);
    return;
  }

  transporter
    .sendMail({
      from: `"${MAIL_FROM_NAME}" <${MAIL_FROM_ADDRESS}>`,
      to: email,
      replyTo: MAIL_FROM_ADDRESS,
      subject: WELCOME_SUBJECT,
      html: welcomeEmailHTML,
      text: welcomeEmailText,
      headers: {
        // One-click unsubscribe hint for inbox providers — matches the
        // unsubscribe link inside the template.
        "List-Unsubscribe": `<mailto:${MAIL_FROM_ADDRESS}?subject=Unsubscribe>`,
      },
    })
    .then((info) =>
      console.log("✅ Welcome email sent to:", email, "(id:", info.messageId + ")")
    )
    .catch((err) => console.error("❌ Email send failed for", email, "-", err.message));
}

/* ───────── API ROUTES ───────── */
app.use("/api/reviews", reviewRoutes);

app.get("/api/health", (req, res) => res.json({ status: "OK", uptime: process.uptime() }));

/* GET Reviews */
app.get("/api/reviews/all", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(200);
    res.json(reviews);
  } catch (err) {
    console.error("Fetch reviews error:", err.message);
    res.status(500).json({ msg: "Failed to fetch reviews" });
  }
});

/* POST Review */
app.post("/api/reviews/add", async (req, res) => {
  try {
    const { name, rating, comment } = req.body || {};

    if (
      !name || typeof name !== "string" || name.trim().length === 0 || name.length > 80 ||
      !comment || typeof comment !== "string" || comment.trim().length === 0 || comment.length > 1000 ||
      rating === undefined || Number(rating) < 1 || Number(rating) > 5
    ) {
      return res.status(400).json({ msg: "All fields required and must be valid" });
    }

    const review = await Review.create({
      name: name.trim(),
      rating: Number(rating),
      comment: comment.trim(),
    });
    res.status(201).json(review);

  } catch (err) {
    console.error("Add review error:", err.message);
    res.status(500).json({ msg: "Failed to submit review" });
  }
});

/* ───────── SUBSCRIBE (real-time response, background email, rate limited) ───────── */
app.post("/api/subscribe", subscribeLimiter, async (req, res) => {
  try {
    const rawEmail = req.body?.email;
    const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email) || email.length > 254) {
      return res.status(400).json({ msg: "Invalid email" });
    }

    const exists = await Subscriber.findOne({ email });
    if (exists) {
      return res.json({ msg: "Already subscribed 🌿" });
    }

    await Subscriber.create({ email });

    // Respond immediately — don't wait on email.
    res.json({ msg: "Subscribed 🎉" });

    // Fire-and-forget background email.
    sendWelcomeEmailAsync(email);

  } catch (err) {
    console.error("Subscribe error:", err.message);
    if (!res.headersSent) {
      res.status(500).json({ msg: "Server error" });
    }
  }
});

/* ───────── STATIC FRONTEND ───────── */
app.use(
  express.static(frontendPath, {
    maxAge: isProd ? "1y" : 0,
    index: false, // index.html served explicitly via catch-all below
  })
);

app.get("/favicon.ico", (req, res) => res.status(204).end());

/* ───────── CATCH-ALL: serve React for all non-API routes ───────── */
app.use((req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ msg: "API not found" });
  }

  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }

  res.status(500).send("Frontend build not found");
});

/* ───────── GLOBAL ERROR HANDLER ─────────
   Never leaks stack traces to clients, even in dev.
*/
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  if (!res.headersSent) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

/* ───────── PROCESS-LEVEL SAFETY NETS ─────────
   Without these, one unhandled rejection or sync throw can crash
   the whole process in production with no clean log/restart path.
*/
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // Exit so the process manager (PM2/Render/Docker) can restart cleanly
  // rather than continuing in a possibly-corrupted state.
  process.exit(1);
});

/* ───────── START + GRACEFUL SHUTDOWN ───────── */
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} (${isProd ? "production" : "development"})`);
});

function shutdown(signal) {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log("✅ HTTP server closed");
    process.exit(0);
  });

  // Force-exit if something hangs during shutdown.
  setTimeout(() => {
    console.error("⏱️ Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
