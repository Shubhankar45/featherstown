import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const NAV_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Outfit:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');

:root{
  --leaf:#16a34a; --leaf2:#22c55e; --gold:#f59e0b; --gold2:#fbbf24;
  --fog:#475569; --ink:#0f172a;
  --r:10px;
  --ease-spring:cubic-bezier(.34,1.56,.64,1);
  --ease-out:cubic-bezier(.16,1,.3,1);
}

/* ─── Shell ─── */
.ft-nav{
  position:fixed; top:0; left:0; right:0; z-index:1000;
  height:68px;
  display:flex; align-items:center; justify-content:space-between;
  padding:0 48px;
  background:rgba(255,255,255,0);
  transition:background .4s ease, box-shadow .4s ease;
}
.ft-nav.scrolled{
  background:rgba(255,255,255,.92);
  backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px);
  box-shadow:0 1px 0 rgba(0,0,0,.06), 0 8px 32px rgba(0,0,0,.06);
}

/* ─── Logo ─── */
.ft-logo{
  text-decoration:none;
  display:flex; align-items:center; gap:9px; flex-shrink:0;
}
.ft-logo-mark{
  width:32px; height:32px;
  background:linear-gradient(135deg,var(--leaf),var(--leaf2));
  border-radius:9px;
  display:flex; align-items:center; justify-content:center;
  flex-shrink:0;
  box-shadow:0 3px 10px rgba(22,163,74,.28);
}
.ft-logo-mark svg{ display:block; }
.ft-logo-text{
  font-family:var(--font-d, 'Cormorant Garamond', serif);
  font-size:24px; font-weight:700; line-height:1;
  letter-spacing:-.01em;
}
.ft-logo-text .w1{ color:var(--leaf); }
.ft-logo-text .w2{ color:var(--gold); }

/* ─── Center pill tray ─── */
.ft-center{
  position:absolute; left:50%; transform:translateX(-50%);
  display:flex; align-items:center;
  background:rgba(248,250,252,.85);
  border:1px solid rgba(0,0,0,.07);
  border-radius:999px;
  padding:4px;
  gap:1px;
  backdrop-filter:blur(12px);
  box-shadow:0 1px 4px rgba(0,0,0,.05);
}

.ft-link{
  position:relative;
  color:var(--fog);
  padding:7px 16px;
  border-radius:999px;
  text-decoration:none;
  font-family:var(--font-s, 'Outfit', sans-serif);
  font-size:13.5px; font-weight:500;
  white-space:nowrap;
  transition:color .18s ease, background .18s ease;
}
.ft-link:hover{
  color:var(--ink);
  background:rgba(255,255,255,.9);
}
.ft-link.active{
  color:#fff;
  background:linear-gradient(135deg,var(--leaf),var(--leaf2));
  box-shadow:0 2px 10px rgba(22,163,74,.32);
  font-weight:600;
}

/* ─── Right zone ─── */
.ft-right{ display:flex; align-items:center; gap:10px; flex-shrink:0; }

/* ghost phone button */
.ft-phone{
  display:flex; align-items:center; gap:6px;
  color:var(--fog); font-family:var(--font-b, 'Inter', sans-serif);
  font-size:13px; font-weight:500;
  padding:8px 14px; border-radius:var(--r);
  background:transparent; border:1.5px solid rgba(0,0,0,.1);
  text-decoration:none;
  transition:color .18s, border-color .18s, background .18s;
}
.ft-phone:hover{
  color:var(--ink); border-color:rgba(0,0,0,.2);
  background:rgba(0,0,0,.03);
}

/* WhatsApp CTA */
.ft-wa{
  display:flex; align-items:center; gap:7px;
  background:linear-gradient(135deg,var(--leaf),var(--leaf2));
  color:#fff; padding:9px 18px; border-radius:var(--r);
  text-decoration:none; font-family:var(--font-b, 'Inter', sans-serif);
  font-size:13px; font-weight:600; white-space:nowrap;
  box-shadow:0 3px 12px rgba(22,163,74,.3);
  transition:transform .25s var(--ease-spring), box-shadow .22s, opacity .18s;
}
.ft-wa:hover{
  transform:translateY(-2px);
  box-shadow:0 8px 24px rgba(22,163,74,.42);
}
.ft-wa:active{ transform:translateY(0); opacity:.88; }

/* Subscribe CTA — gold, to stand apart from the green WhatsApp button */
.ft-sub{
  display:flex; align-items:center; gap:7px;
  background:transparent;
  color:var(--gold); padding:8.5px 18px; border-radius:var(--r);
  border:1.5px solid rgba(245,158,11,.4);
  text-decoration:none; font-family:var(--font-b, 'Inter', sans-serif);
  font-size:13px; font-weight:600; white-space:nowrap;
  cursor:pointer;
  transition:transform .25s var(--ease-spring), background .22s, border-color .22s, opacity .18s;
}
.ft-sub:hover{
  transform:translateY(-2px);
  background:rgba(245,158,11,.09);
  border-color:rgba(245,158,11,.6);
}
.ft-sub:active{ transform:translateY(0); opacity:.88; }

/* ─── Hamburger ─── */
.ft-ham{
  display:none;
  flex-direction:column; justify-content:center; align-items:center;
  gap:5px; width:38px; height:38px;
  background:transparent; border:1.5px solid rgba(0,0,0,.1);
  border-radius:var(--r); cursor:pointer; padding:0; flex-shrink:0;
  transition:border-color .2s;
}
.ft-ham:hover{ border-color:rgba(34,197,94,.45); }
.hbar{
  width:16px; height:1.8px; border-radius:2px; background:var(--ink);
  transition:transform .3s var(--ease-spring), opacity .2s, width .2s;
  transform-origin:center;
}
.ft-ham.open .hbar:nth-child(1){ transform:translateY(7px) rotate(45deg); }
.ft-ham.open .hbar:nth-child(2){ opacity:0; width:0; }
.ft-ham.open .hbar:nth-child(3){ transform:translateY(-7px) rotate(-45deg); }

/* ─── Backdrop ─── */
.ft-backdrop{
  display:none; position:fixed; inset:0;
  background:rgba(0,0,0,.25); z-index:998; backdrop-filter:blur(2px);
}
.ft-backdrop.open{ display:block; }

/* ─── Mobile drawer ─── */
.ft-mob{
  position:fixed; top:68px; left:0; right:0;
  background:rgba(255,255,255,.97);
  backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
  border-bottom:1px solid rgba(0,0,0,.07);
  z-index:999; max-height:0; overflow:hidden;
  transition:max-height .35s var(--ease-out);
  box-shadow:0 16px 48px rgba(0,0,0,.08);
}
.ft-mob.open{ max-height:640px; }
.ft-mob-inner{ padding:12px 16px 20px; }

.ft-mob-link{
  display:flex; align-items:center;
  padding:12px 18px; color:var(--fog);
  text-decoration:none; font-family:var(--font-b, 'Inter', sans-serif);
  font-size:14px; font-weight:500;
  border-radius:var(--r);
  transition:color .18s, background .18s;
}
.ft-mob-link:hover{ color:var(--ink); background:rgba(0,0,0,.04); }
.ft-mob-link.active{
  color:var(--leaf); font-weight:600;
  background:rgba(34,197,94,.07);
}
.ft-mob-link.active .mob-dot{
  background:var(--leaf);
}
.mob-dot{
  width:6px; height:6px; border-radius:50%;
  background:transparent; margin-right:12px; flex-shrink:0;
  transition:background .18s;
}

.ft-mob-divider{ height:1px; background:rgba(0,0,0,.06); margin:8px 0; }

.ft-mob-wa{
  display:flex; align-items:center; justify-content:center; gap:8px;
  width:100%; padding:13px; border-radius:var(--r); margin-top:4px;
  background:linear-gradient(135deg,var(--leaf),var(--leaf2));
  color:#fff; font-family:var(--font-b, 'Inter', sans-serif);
  font-size:14px; font-weight:700; text-decoration:none;
  box-shadow:0 4px 16px rgba(22,163,74,.28);
  transition:transform .25s var(--ease-spring), opacity .18s;
}
.ft-mob-wa:hover{ transform:scale(1.01); }

.ft-mob-sub{
  display:flex; align-items:center; justify-content:center; gap:8px;
  width:100%; padding:12.5px; border-radius:var(--r); margin-top:8px;
  background:transparent; border:1.5px solid rgba(245,158,11,.4);
  color:var(--gold); font-family:var(--font-b, 'Inter', sans-serif);
  font-size:14px; font-weight:700;
  cursor:pointer;
  transition:transform .25s var(--ease-spring), background .18s, opacity .18s;
}
.ft-mob-sub:hover{ background:rgba(245,158,11,.09); }
.ft-mob-sub:active{ transform:scale(.99); }

/* ─── Subscribe modal ─── */
.ft-sub-backdrop{
  position:fixed; inset:0; z-index:1200;
  background:rgba(15,23,42,.5);
  backdrop-filter:blur(3px);
  display:flex; align-items:center; justify-content:center;
  padding:20px;
  opacity:0; pointer-events:none;
  transition:opacity .22s ease;
}
.ft-sub-backdrop.open{ opacity:1; pointer-events:auto; }

.ft-sub-card{
  position:relative;
  width:100%; max-width:400px;
  background:#fff; border-radius:16px;
  padding:32px 28px 26px;
  box-shadow:0 24px 64px rgba(0,0,0,.28);
  transform:translateY(10px) scale(.97);
  opacity:0;
  transition:transform .28s var(--ease-spring), opacity .22s ease;
}
.ft-sub-backdrop.open .ft-sub-card{ transform:translateY(0) scale(1); opacity:1; }

.ft-sub-close{
  position:absolute; top:14px; right:14px;
  width:28px; height:28px; border-radius:8px;
  display:flex; align-items:center; justify-content:center;
  background:transparent; border:none; cursor:pointer;
  color:var(--fog);
  transition:background .18s, color .18s;
}
.ft-sub-close:hover{ background:rgba(0,0,0,.06); color:var(--ink); }

.ft-sub-icon{
  width:44px; height:44px; border-radius:12px;
  background:linear-gradient(135deg,var(--gold),var(--gold2));
  display:flex; align-items:center; justify-content:center;
  margin-bottom:14px;
  box-shadow:0 4px 14px rgba(245,158,11,.3);
}

.ft-sub-title{
  font-family:var(--font-d, 'Cormorant Garamond', serif);
  font-size:24px; font-weight:700; color:var(--ink);
  margin:0 0 6px;
}
.ft-sub-desc{
  font-family:var(--font-b, 'Inter', sans-serif);
  font-size:13.5px; color:var(--fog); line-height:1.6;
  margin:0 0 20px;
}

.ft-sub-input{
  width:100%; padding:12px 14px; border-radius:10px;
  border:1.5px solid rgba(0,0,0,.12);
  font-family:var(--font-b, 'Inter', sans-serif); font-size:14px; color:var(--ink);
  outline:none; box-sizing:border-box;
  transition:border-color .18s;
}
.ft-sub-input:focus{ border-color:rgba(245,158,11,.6); }
.ft-sub-input.err{ border-color:#dc2626; }

.ft-sub-error{
  font-family:var(--font-b, 'Inter', sans-serif); font-size:12px; color:#dc2626;
  margin:7px 0 0;
}

.ft-sub-submit{
  width:100%; margin-top:14px; padding:12.5px; border-radius:10px;
  border:none; cursor:pointer;
  background:linear-gradient(135deg,var(--gold),var(--gold2));
  color:#fff; font-family:var(--font-b, 'Inter', sans-serif); font-size:14px; font-weight:700;
  display:flex; align-items:center; justify-content:center; gap:8px;
  box-shadow:0 4px 14px rgba(245,158,11,.3);
  transition:transform .2s var(--ease-spring), opacity .18s;
}
.ft-sub-submit:hover{ transform:translateY(-1px); }
.ft-sub-submit:disabled{ opacity:.7; cursor:default; transform:none; }

.ft-sub-fine{
  font-family:var(--font-b, 'Inter', sans-serif); font-size:11px; color:#94a3b8;
  text-align:center; margin:12px 0 0;
}

.ft-sub-success{
  display:flex; flex-direction:column; align-items:center; text-align:center;
  padding:8px 0 4px;
}
.ft-sub-success-icon{
  width:52px; height:52px; border-radius:50%;
  background:rgba(245,158,11,.12);
  display:flex; align-items:center; justify-content:center;
  margin-bottom:14px;
}
.ft-sub-success p{
  font-family:var(--font-b, 'Inter', sans-serif); font-size:14px; color:var(--fog);
  margin:0;
}

.ft-spin{
  width:14px; height:14px; border-radius:50%;
  border:2px solid rgba(255,255,255,.4); border-top-color:#fff;
  animation:ft-spin .7s linear infinite;
}
@keyframes ft-spin{ to{ transform:rotate(360deg); } }

/* ─── Responsive ─── */
@media(max-width:1040px){
  .ft-link{ padding:7px 13px; font-size:12.5px; }
  .ft-phone{ display:none; }
}
@media(max-width:900px){
  .ft-center{ display:none; }
  .ft-ham{ display:flex; }
  .ft-nav{ padding:0 20px; }
  .ft-right .ft-wa{ display:none; }
  .ft-right .ft-sub{ display:none; }
}
@media(min-width:901px){
  .ft-mob{ display:none; }
  .ft-backdrop{ display:none!important; }
}
@media(max-width:480px){
  .ft-nav{ padding:0 14px; }
  .ft-logo-text{ font-size:20px; }
}
`;

const WAIco = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const MailIco = ({ size = 14, stroke = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const CheckIco = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);

const BirdIco = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);

// Order MUST match top→bottom DOM order in Home.jsx:
// About → Reviews → BirdsShowcase → CompareSection → (footer=contact)
const LINKS = [
  { href: "#about",   label: "About",   section: "about",   path: "/about"   },
  { href: "#reviews", label: "Reviews", section: "reviews", path: "/reviews" },
  { href: "#birds",   label: "Birds",   section: "birds",   path: "/birds"   },
  { href: "#compare", label: "Compare", section: "compare", path: "/compare" },
  { href: "#contact", label: "Contact", section: "contact", path: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen]    = useState(false);
  const [scrolled, setScrolled]    = useState(false);
  const [activeSection, setActive] = useState("");
  const location = useLocation();
  const rafRef   = useRef(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    if (location.pathname !== "/") {
      const match = LINKS.find((l) => l.path === location.pathname);
      setActive(match ? match.section : "");
      return;
    }

    const NAV_H      = 80;
    const FOOT_SLACK = 120;

    const update = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - FOOT_SLACK
      ) {
        setActive("contact");
        return;
      }

      /*
        Walk bottom-up. For each section:
        - If top <= NAV_H, we've scrolled past (or into) it.
        - Pick the LAST one in the list whose top <= NAV_H.
        This correctly handles tall sections (Birds, Compare) where
        both top and bottom may be far above/below viewport.
      */
      let hit = "";
      for (let i = LINKS.length - 1; i >= 0; i--) {
        const el = document.getElementById(LINKS[i].section);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= NAV_H) {
          hit = LINKS[i].section;
          break;
        }
      }

      setActive(hit);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [location.pathname]);

  useEffect(() => { setMenuOpen(false); }, [location]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const close    = () => setMenuOpen(false);
  const navigate = useNavigate();

  const handleNavClick = (e, link) => {
    e.preventDefault();
    navigate(link.path);
    close();
  };

  // ─── Subscribe modal ───
  const [subOpen, setSubOpen]       = useState(false);
  const [subEmail, setSubEmail]     = useState("");
  const [subLoading, setSubLoading] = useState(false);
  const [subDone, setSubDone]       = useState(false);
  const [subError, setSubError]     = useState("");

  const openSubscribe = () => {
    close();
    setSubOpen(true);
  };

  const closeSubscribe = () => {
    setSubOpen(false);
    // reset shortly after the close animation so the card doesn't
    // visibly flash back to its initial state mid-transition
    setTimeout(() => {
      setSubEmail("");
      setSubDone(false);
      setSubError("");
      setSubLoading(false);
    }, 220);
  };

  const handleSubscribeSubmit = async (e) => {
    e.preventDefault();
    if (!subEmail || !subEmail.includes("@")) {
      setSubError("Please enter a valid email address.");
      return;
    }
    setSubError("");
    setSubLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubDone(true);
        setSubEmail("");
      } else {
        setSubError(data.msg ?? "Something went wrong. Please try again.");
      }
    } catch {
      setSubError("Could not reach the server. Please try again.");
    } finally {
      setSubLoading(false);
    }
  };

  return (
    <>
      <style>{NAV_STYLES}</style>

      <div className={`ft-backdrop${menuOpen ? " open" : ""}`} onClick={close} />

      <nav
        className={`ft-nav${scrolled ? " scrolled" : ""}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link to="/" className="ft-logo" onClick={close}>
          
          <span className="ft-logo-text">
            <span className="w1">Feather</span>
            <span className="w2">Town</span>
          </span>
        </Link>

        {/* Desktop pill nav */}
        <div className="ft-center">
          {LINKS.map((link) => (
            <a
              key={link.section}
              href={link.path}
              className={`ft-link${activeSection === link.section ? " active" : ""}`}
              onClick={(e) => handleNavClick(e, link)}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="ft-right">
          <button className="ft-sub" onClick={openSubscribe}>
            <MailIco /> Subscribe
          </button>
          <a
            href="https://wa.me/919556747518"
            className="ft-wa"
            target="_blank"
            rel="noreferrer"
          >
            <WAIco /> WhatsApp
          </a>
          <button
            className={`ft-ham${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className="hbar" />
            <span className="hbar" />
            <span className="hbar" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`ft-mob${menuOpen ? " open" : ""}`} aria-hidden={!menuOpen}>
        <div className="ft-mob-inner">
          {LINKS.map((link) => (
            <a
              key={link.section}
              href={link.path}
              className={`ft-mob-link${activeSection === link.section ? " active" : ""}`}
              onClick={(e) => handleNavClick(e, link)}
            >
              <span className="mob-dot" />
              {link.label}
            </a>
          ))}
          <div className="ft-mob-divider" />
          <a
            href="https://wa.me/919556747518"
            className="ft-mob-wa"
            target="_blank"
            rel="noreferrer"
            onClick={close}
          >
            <WAIco /> Chat on WhatsApp
          </a>
          <button className="ft-mob-sub" onClick={openSubscribe}>
            <MailIco /> Subscribe to Updates
          </button>
        </div>
      </div>

      {/* Subscribe modal */}
      <div
        className={`ft-sub-backdrop${subOpen ? " open" : ""}`}
        onClick={closeSubscribe}
        aria-hidden={!subOpen}
      >
        <div className="ft-sub-card" onClick={(e) => e.stopPropagation()}>
          <button className="ft-sub-close" onClick={closeSubscribe} aria-label="Close">
            ✕
          </button>

          {subDone ? (
            <div className="ft-sub-success">
              <div className="ft-sub-success-icon">
                <CheckIco size={24} />
              </div>
              <h3 className="ft-sub-title" style={{ marginBottom: 8 }}>You're subscribed!</h3>
              <p>Welcome to Feather Town 🌿 — we'll keep you posted on care tips and new arrivals.</p>
            </div>
          ) : (
            <>
              <div className="ft-sub-icon">
                <MailIco size={20} stroke="#fff" />
              </div>
              <h3 className="ft-sub-title">Stay in the loop</h3>
              <p className="ft-sub-desc">
                Get weekly bird care tips, nutrition guides, and a first look at new species.
              </p>

              <form onSubmit={handleSubscribeSubmit} noValidate>
                <input
                  type="email"
                  autoFocus
                  value={subEmail}
                  onChange={(e) => { setSubEmail(e.target.value); if (subError) setSubError(""); }}
                  placeholder="your@email.com"
                  className={`ft-sub-input${subError ? " err" : ""}`}
                  disabled={subLoading}
                />
                {subError && <p className="ft-sub-error">{subError}</p>}

                <button type="submit" className="ft-sub-submit" disabled={subLoading}>
                  {subLoading ? (<><span className="ft-spin" />Subscribing…</>) : "Subscribe"}
                </button>
              </form>

              <p className="ft-sub-fine">No spam, unsubscribe anytime.</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
