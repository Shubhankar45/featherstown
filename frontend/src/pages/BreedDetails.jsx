import { useParams, Link } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { parrots } from "../data/parrots";
import CompatibilityBadge from "../components/CompatibilityBadge";
import { calcCompatibility } from "../utils/recommendation";

/* ══════════════════════════════════════════════════════════
   DESIGN TOKENS — Parrot Feather Theme
   White base, with green & orange accents (matching the
   green-cheek conure's natural feather colors)
══════════════════════════════════════════════════════════ */
const T = {
  /* greens */
  canopy:    "#ffffff",   // page background — white
  forest:    "#ffffff",   // panel background — white
  moss:      "#15803d",   // deep green — hover states
  fern:      "#22c55e",   // light green accent
  leaf:      "#16a34a",   // primary green accent
  mist:      "#1a1a1a",   // dark neutral text
  /* earth / orange */
  bark:      "#3d2b1f",   // dark bark
  soil:      "#6b4226",   // rich soil
  amber:     "#f97316",   // primary orange accent
  /* neutrals */
  cream:     "#000000",   // headings — black
  fog:       "#333333",   // body text — neutral dark gray
  shadow:    "rgba(0,0,0,0.12)",
  /* gradients */
  leafGrad:  "linear-gradient(135deg,#16a34a,#22c55e)",
  orangeGrad:"linear-gradient(135deg,#f97316,#fb923c)",
  goldGrad:  "linear-gradient(135deg,#f97316,#fb923c)",
};

/* Subtle tiled leaf/palm texture used behind white sections */
const LEAF_TEXTURE = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'>
    <g fill='none' stroke='#16a34a' stroke-width='1.4' opacity='0.07'>
      <path d='M25 165 C25 120 45 80 90 55' />
      <path d='M90 55 C68 65 56 88 62 110' />
      <path d='M90 55 C108 70 114 92 108 114' />
      <path d='M140 25 C115 48 102 82 108 116' />
      <path d='M10 50 C35 28 68 22 100 33' />
      <path d='M150 140 C150 110 165 88 175 80' />
      <path d='M150 140 C140 148 134 160 137 170' />
    </g>
  </svg>`
)}")`;

/* ══════════════════════════════════════════════════════════
   FOREST SVG DECORATIONS
══════════════════════════════════════════════════════════ */
function LeafDeco({ style, opacity = 0.28, flip = false }) {
  return (
    <svg viewBox="0 0 80 120" style={{ position: "absolute", pointerEvents: "none", opacity, transform: flip ? "scaleX(-1)" : "none", ...style }}>
      <path d="M40 0 C70 20 75 70 40 120 C5 70 10 20 40 0Z" fill="#40916c" />
      <line x1="40" y1="0" x2="40" y2="120" stroke="#1a4a2e" strokeWidth="1.5" opacity="0.6" />
      <line x1="40" y1="30" x2="25" y2="55" stroke="#1a4a2e" strokeWidth="1" opacity="0.5" />
      <line x1="40" y1="50" x2="60" y2="70" stroke="#1a4a2e" strokeWidth="1" opacity="0.5" />
      <line x1="40" y1="70" x2="22" y2="90" stroke="#1a4a2e" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

function BranchDeco({ style }) {
  return (
    <svg viewBox="0 0 200 80" style={{ position: "absolute", pointerEvents: "none", opacity: 0.22, ...style }}>
      <path d="M0 60 Q50 20 120 40 Q160 50 200 30" stroke="#40916c" strokeWidth="3" fill="none" />
      <path d="M80 35 Q95 10 110 20" stroke="#40916c" strokeWidth="2" fill="none" />
      <path d="M130 38 Q150 15 165 25" stroke="#40916c" strokeWidth="2" fill="none" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   STAT RING — circular progress
══════════════════════════════════════════════════════════ */
function StatRing({ value, label, icon, color = T.leaf }) {
  const r = 28, circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="6" />
        <circle cx="36" cy="36" r={r} fill="none" stroke={color}
          strokeWidth="6" strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          strokeDashoffset={circ / 4}
          style={{ transition: "stroke-dasharray 1.2s cubic-bezier(.16,1,.3,1)" }}
        />
        <text x="36" y="36" textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: 11, fontWeight: 700, fill: "#000000", fontFamily: "Outfit,sans-serif" }}>
          {value}
        </text>
      </svg>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 16, marginBottom: 2 }}>{icon}</div>
        <div style={{ fontSize: 10, fontWeight: 600, color: "#000000", letterSpacing: 1, textTransform: "uppercase", fontFamily: "Outfit,sans-serif" }}>{label}</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   FOREST TAB BAR
══════════════════════════════════════════════════════════ */
function ForestTab({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 7,
      padding: "10px 20px", borderRadius: 12, cursor: "pointer",
      fontFamily: "Outfit,sans-serif", fontSize: 13, fontWeight: 600,
      transition: "all 0.25s cubic-bezier(.34,1.56,.64,1)",
      background: active ? T.leafGrad : "#ffffff",
      border: active ? "none" : "1px solid rgba(0,0,0,0.12)",
      color: active ? "#fff" : "#000000",
      boxShadow: active ? "0 4px 20px rgba(0,0,0,0.4)" : "none",
      transform: active ? "translateY(-2px)" : "none",
    }}>
      <span style={{ fontSize: 15 }}>{icon}</span>
      {label}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════
   INFO CHIP
══════════════════════════════════════════════════════════ */
function InfoChip({ label, value, icon }) {
  return (
    <div style={{
      background: "#ffffff", border: "1px solid rgba(0,0,0,0.12)",
      borderRadius: 14, padding: "14px 18px",
      display: "flex", flexDirection: "column", gap: 6,
      transition: "all 0.2s ease",
    }}
      onMouseEnter={e => { e.currentTarget.style.background = "#f7f7f7"; e.currentTarget.style.transform = "translateY(-3px)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.transform = "none"; }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#000000", fontFamily: "Outfit,sans-serif" }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: T.cream, fontFamily: "Outfit,sans-serif", lineHeight: 1.3 }}>{value || "—"}</span>    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CARE ITEM
══════════════════════════════════════════════════════════ */
function CareRow({ text, idx }) {
  const rawIcon = text.match(/^(\u2705|\u26a0\ufe0f|\ud83e\uddf4|\ud83c\udf3f|\ud83c\udfe0|\ud83e\udde0)/)?.[0] ?? "🌿";
  const clean = text.replace(/^(\u2705|\u26a0\ufe0f|\ud83e\uddf4|\ud83c\udf3f|\ud83c\udfe0|\ud83e\udde0)\s*/, "");
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 14,
      padding: "14px 0", borderBottom: idx % 2 === 0 ? "1px solid rgba(0,0,0,0.08)" : "none",
      animation: `fadeUp 0.4s ${idx * 0.06}s both`,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: "#ffffff", border: "1px solid rgba(0,0,0,0.1)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16,
      }}>{rawIcon}</div>
      <span style={{ fontSize: 14, color: T.fog, lineHeight: 1.7, fontFamily: "Outfit,sans-serif", paddingTop: 8 }}>{clean}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TRAINING STEP
══════════════════════════════════════════════════════════ */
function TrainingStep({ text, idx, color = T.leaf }) {
  return (
    <div style={{
      display: "flex", gap: 14, alignItems: "flex-start",
      padding: "12px 0", borderBottom: "1px solid rgba(0,0,0,0.06)",
      animation: `fadeUp 0.4s ${idx * 0.07}s both`,
    }}>
      <div style={{
        width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
        background: `linear-gradient(135deg,${color},${color}99)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 800, color: "#fff", fontFamily: "Outfit,sans-serif",
        boxShadow: `0 2px 8px ${color}55`,
      }}>{idx + 1}</div>
      <span style={{ fontSize: 13.5, color: T.fog, lineHeight: 1.7, fontFamily: "Outfit,sans-serif", paddingTop: 4 }}>{text}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PDF HELPERS (unchanged from original)
══════════════════════════════════════════════════════════ */
function safe(str) {
  if (str == null) return "";
  return String(str).replace(/[^\x20-\x7E]/g, " ").replace(/\s+/g, " ").trim();
}
function cleanBullet(str) {
  return safe(str).replace(/^[^a-zA-Z0-9(["']+/, "").trim();
}
async function loadJsPDF() {
  if (window.jspdf?.jsPDF) return window.jspdf.jsPDF;
  await new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    s.onload = resolve; s.onerror = () => reject(new Error("jsPDF CDN failed"));
    document.head.appendChild(s);
  });
  return window.jspdf.jsPDF;
}

async function generateParrotPDF(parrot) {
  const JsPDF = await loadJsPDF();
  const doc = new JsPDF({ unit: "mm", format: "a4" });
  const PW=210,PH=297,ML=15,MR=15,CW=PW-ML-MR,BOT=PH-16;
  const G={fill:[22,163,74],dark:[14,90,44],light:[220,252,231],border:[134,239,172]};
  const A={fill:[161,98,7],bg:[255,251,225],border:[251,191,36]};
  const N={dark:[17,17,17],body:[55,55,55],muted:[105,105,105],light:[160,160,160],bgCard:[246,248,250],border:[214,218,222],white:[255,255,255]};
  let y=0,page=1;
  const tc=(...rgb)=>doc.setTextColor(...rgb);
  const fc=(...rgb)=>doc.setFillColor(...rgb);
  const dc=(...rgb)=>doc.setDrawColor(...rgb);
  const lw=(w)=>doc.setLineWidth(w);
  const ft=(style,size)=>{doc.setFont("helvetica",style);doc.setFontSize(size);};
  function stampFooter(){dc(...N.border);lw(0.2);doc.line(ML,PH-11,PW-MR,PH-11);ft("normal",7);tc(...N.light);doc.text("FeatherTown  |  Bird Details Report",ML,PH-7);doc.text(`Page ${page}`,PW-MR,PH-7,{align:"right"});}
  function guard(need=8){if(y+need>BOT){stampFooter();doc.addPage();page++;y=14;}}
  const gap=(mm)=>{y+=mm;};
  function sectionHeader(num,title){gap(6);guard(16);fc(...[235,245,235]);dc(...G.border);lw(0.3);doc.rect(ML,y,CW,11,"FD");fc(...G.fill);doc.rect(ML,y,3,11,"F");fc(...G.fill);doc.circle(ML+10,y+5.5,3.8,"F");ft("bold",8);tc(...N.white);doc.text(String(num),ML+10,y+7,{align:"center"});ft("bold",11);tc(...G.dark);doc.text(title,ML+18,y+7.5);y+=14;}
  function subLabel(text,color=G.dark){guard(10);ft("bold",9);tc(...color);doc.text(safe(text),ML,y);dc(...color);lw(0.2);doc.line(ML,y+1,ML+doc.getTextWidth(safe(text)),y+1);y+=7;}
  function body(text,x=ML,maxW=CW,lineH=5.2){ft("normal",9);tc(...N.body);doc.splitTextToSize(safe(text),maxW).forEach(line=>{guard(lineH+1);doc.text(line,x,y);y+=lineH;});}
  function bullet(raw){const text=cleanBullet(raw);if(!text)return;const INDENT=8,DOT_X=ML+2.5;ft("normal",9);tc(...N.body);doc.splitTextToSize(text,CW-INDENT).forEach((line,i)=>{guard(6);if(i===0){fc(...G.fill);doc.circle(DOT_X,y-1.2,1.1,"F");}doc.text(line,ML+INDENT,y);y+=5.2;});y+=1.2;}
  let _rowIdx=0;
  function resetRows(){_rowIdx=0;}
  function tableRow(label,value){const LABEL_W=42,VAL_W=CW-LABEL_W-2;ft("normal",9);const valueLines=doc.splitTextToSize(safe(value),VAL_W);const rowH=Math.max(8,valueLines.length*5.2+3);guard(rowH+1);if(_rowIdx%2===0){fc(...N.bgCard);dc(...N.border);lw(0.15);doc.rect(ML,y,CW,rowH,"FD");}else{fc(...N.white);dc(...N.border);lw(0.15);doc.rect(ML,y,CW,rowH,"FD");}_rowIdx++;ft("bold",8);tc(...N.muted);doc.text(safe(label).toUpperCase(),ML+2.5,y+rowH/2+1.5);dc(...N.border);lw(0.15);doc.line(ML+LABEL_W,y,ML+LABEL_W,y+rowH);ft("normal",9);tc(...N.dark);const startY=y+(rowH-valueLines.length*5.2)/2+4;valueLines.forEach((line,i)=>doc.text(line,ML+LABEL_W+3,startY+i*5.2));y+=rowH;}
  function infoCards(pairs){const COLS=3,GAP=3,cardW=(CW-GAP*(COLS-1))/COLS,cardH=16;for(let i=0;i<pairs.length;i+=COLS){guard(cardH+4);for(let col=0;col<COLS;col++){const item=pairs[i+col];if(!item)break;const[label,value]=item;const cx=ML+col*(cardW+GAP);fc(...N.bgCard);dc(...N.border);lw(0.25);doc.roundedRect(cx,y,cardW,cardH,2,2,"FD");fc(...G.fill);doc.rect(cx,y,cardW,1.5,"F");ft("bold",6.5);tc(...N.muted);doc.text(safe(label).toUpperCase(),cx+3,y+6.5);const valSafe=safe(value||"—");ft("bold",9.5);tc(...N.dark);const maxValW=cardW-6;let displayVal=valSafe;while(doc.getTextWidth(displayVal)>maxValW&&displayVal.length>1)displayVal=displayVal.slice(0,-1);if(displayVal!==valSafe)displayVal=displayVal.slice(0,-2)+"..";doc.text(displayVal,cx+3,y+13.5);}y+=cardH+4;}}
  function traitBar(label,value){guard(14);const BAR_H=4.5,pct=Math.min(Math.max(value,0),100),fillW=(pct/100)*CW;ft("bold",9);tc(...N.dark);doc.text(label,ML,y);ft("normal",8);tc(...N.muted);doc.text(`${pct}%`,PW-MR,y,{align:"right"});y+=4;fc(216,216,216);dc(216,216,216);lw(0);doc.roundedRect(ML,y,CW,BAR_H,2,2,"F");if(fillW>0.5){fc(...G.fill);doc.roundedRect(ML,y,fillW,BAR_H,2,2,"F");}y+=BAR_H+6;}
  function noticeBox(boldLabel,rest,bgArr,borderArr,textArr){const PAD=4,LH=5;ft("normal",8.5);const allText=doc.splitTextToSize(safe(rest),CW-PAD*2-2);const boxH=allText.length*LH+PAD*2+4;guard(boxH+4);fc(...bgArr);dc(...borderArr);lw(0.4);doc.roundedRect(ML,y,CW,boxH,2.5,2.5,"FD");ft("bold",8.5);tc(...textArr);const labelW=doc.getTextWidth(safe(boldLabel)+" ");doc.text(safe(boldLabel),ML+PAD,y+PAD+4);ft("normal",8.5);tc(...textArr);const firstLine=allText[0]||"";if(labelW+doc.getTextWidth(firstLine)<CW-PAD*2){doc.text(firstLine,ML+PAD+labelW,y+PAD+4);allText.slice(1).forEach((line,i)=>doc.text(line,ML+PAD,y+PAD+4+(i+1)*LH));}else{allText.forEach((line,i)=>doc.text(line,ML+PAD+(i===0?labelW:0),y+PAD+4+i*LH));}y+=boxH+4;}
  fc(...G.fill);doc.rect(0,0,PW,44,"F");ft("bold",8.5);tc(...[180,240,200]);doc.text("FEATHERTOWN",ML,9);ft("normal",7);tc(...[160,230,185]);doc.text("Premium Bird Companion Guide",ML,14);ft("bold",24);tc(...N.white);doc.text(safe(parrot.name),ML,30);ft("bold",14);tc(...[180,255,200]);doc.text(safe(parrot.price||""),PW-MR,22,{align:"right"});ft("normal",6.5);tc(...[160,230,185]);doc.text("STARTING PRICE",PW-MR,27,{align:"right"});ft("normal",7);tc(...[180,240,200]);doc.text(safe((parrot.category||"Parrot")).toUpperCase(),PW-MR,33,{align:"right"});if(parrot.status){fc(...[255,255,255]);doc.roundedRect(ML,35,55,6.5,1.5,1.5,"F");ft("bold",7);tc(...G.dark);doc.text(safe(parrot.status),ML+4,39.8);}
  y=52;
  sectionHeader(1,"Basic Information");infoCards([["Size",parrot.size||"—"],["Lifespan",parrot.lifespan||"—"],["Talking Ability",parrot.talkingAbility||"—"],["Difficulty",parrot.difficulty||"—"],["Category",parrot.category||"—"],["Status",parrot.status||"—"]]);gap(2);
  sectionHeader(2,"Description");body(parrot.description||"No description provided.");gap(3);
  sectionHeader(3,"Overview");resetRows();[["Origin",parrot.origin],["Diet",parrot.diet],["Behavior",parrot.behavior],["Noise Level",parrot.noiseLevel]].filter(([,v])=>v).forEach(([l,v])=>tableRow(l,v));gap(3);
  sectionHeader(4,"Training Guide");const basicSteps=Array.isArray(parrot.training?.basic)?parrot.training.basic:[];const advancedSteps=Array.isArray(parrot.training?.advanced)?parrot.training.advanced:[];subLabel("Foundation — Basic Training",G.dark);if(basicSteps.length)basicSteps.forEach(bullet);else body("No basic training steps listed.");gap(4);subLabel("Advanced Training",A.fill);if(advancedSteps.length)advancedSteps.forEach(bullet);else body("No advanced training steps listed.");gap(4);noticeBox("Pro Tip:","Keep sessions under 15 minutes. Birds respond best to positive reinforcement — small treats and consistent praise deliver the fastest results.",A.bg,A.border,A.fill);
  sectionHeader(5,"Care & Maintenance");subLabel("Daily Care Checklist",G.dark);const careList=(parrot.care?.length?parrot.care:parrot.ownerTips)||["Provide fresh water and food every morning","Allow at least 2 hours of out-of-cage time daily","Offer puzzle toys for mental stimulation","Maintain a consistent sleep schedule of 10-12 hours","Clean cage and perches at least twice a week","Socialize daily — parrots are flock animals"];careList.forEach(bullet);gap(4);noticeBox("Vet Reminder:","Schedule an annual wellness checkup with an avian vet to catch health issues early and ensure a long, healthy life.",G.light,G.border,G.dark);
  sectionHeader(6,"Bird Traits");[{label:"Intelligence",value:parrot.intelligence??75},{label:"Noise Level",value:parrot.noiseLevelScore??60},{label:"Friendliness",value:parrot.friendliness??80},{label:"Maintenance",value:parrot.maintenanceScore??55}].forEach(({label,value})=>traitBar(label,value));gap(4);
  guard(20);fc(...N.bgCard);dc(...N.border);lw(0.2);doc.rect(ML,y,CW,16,"FD");fc(...G.fill);doc.rect(ML,y,3,16,"F");ft("bold",9);tc(...G.fill);doc.text("FeatherTown",ML+7,y+6.5);ft("normal",7.5);tc(...N.body);doc.text("Your trusted partner for healthy, ethically sourced birds.",ML+7,y+12);const ds=new Date().toLocaleDateString("en-GB",{year:"numeric",month:"long",day:"numeric"});ft("normal",7.5);tc(...N.muted);doc.text(`Generated: ${ds}`,PW-MR,y+6.5,{align:"right"});doc.text("www.feathertown.in",PW-MR,y+12,{align:"right"});y+=20;
  stampFooter();
  doc.save(`${safe(parrot.name).replace(/\s+/g,"-").toLowerCase()}-details.pdf`);
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export default function BreedDetails() {
  const { id } = useParams();
  const parrot = parrots.find((p) =>
    String(p.id) === String(id) ||
    p.slug === id ||
    p.name?.toLowerCase().replace(/\s+/g, "-") === id
  );

  const [tab,       setTab]       = useState("overview");
  const [saved,     setSaved]     = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!parrot) return;
    try {
      const prev = JSON.parse(localStorage.getItem("ft_recently_viewed") || "[]");
      const next = [parrot.id, ...prev.filter((i) => i !== parrot.id)].slice(0, 6);
      localStorage.setItem("ft_recently_viewed", JSON.stringify(next));
    } catch {}
  }, [parrot]);

  const recentIds = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("ft_recently_viewed") || "[]").filter(i => i !== parrot?.id); }
    catch { return []; }
  }, [parrot]);

  const savedAnswers = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("ft_quiz_answers") || "null"); }
    catch { return null; }
  }, []);

  if (!parrot) return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <p style={{ fontFamily: "Playfair Display,serif", fontSize: 28, color: T.cream }}>Bird not found 🦜</p>
      <Link to="/" style={{ color: T.leaf, fontFamily: "Outfit,sans-serif", fontSize: 14 }}>← Back to all birds</Link>
    </div>
  );

  const score         = savedAnswers ? calcCompatibility(savedAnswers, parrot) : null;
  const whatsappLink  = `https://wa.me/919556747518?text=Hi, I'm interested in ${parrot.name}`;
  const galleryImages = parrot.gallery?.length ? parrot.gallery : [parrot.image, parrot.image, parrot.image];
  const ownerTips     = parrot.ownerTips ?? ["✅ Needs daily social interaction","⚠️ Can be vocal — plan for it","🧠 Provide puzzle toys for mental stimulation","🌿 A varied fresh-food diet keeps them healthy","🏠 A spacious cage is non-negotiable"];
  const stats = [
    { label: "Intelligence", icon: "🧠", value: parrot.intelligence     ?? 75, color: "#16a34a" },
    { label: "Noise Level",  icon: "🔊", value: parrot.noiseLevelScore  ?? 60, color: "#f97316" },
    { label: "Friendliness", icon: "🤝", value: parrot.friendliness     ?? 80, color: "#22c55e" },
    { label: "Maintenance",  icon: "🧹", value: parrot.maintenanceScore ?? 55, color: "#fb923c" },
  ];

  async function handleDownloadPDF() {
    if (exporting) return;
    setExporting(true);
    try { await generateParrotPDF(parrot); }
    catch (err) { console.error(err); alert("Could not generate PDF."); }
    finally { setExporting(false); }
  }

  /* Adjust this to match the height of your site's fixed/sticky Navbar
     so the hero starts right after it instead of going underneath it. */
  const NAVBAR_HEIGHT = 76;

  return (
    <div style={{
      minHeight: "100vh", fontFamily: "Outfit,sans-serif",
      backgroundColor: T.canopy,
      backgroundImage: LEAF_TEXTURE,
      backgroundRepeat: "repeat",
      backgroundSize: "180px 180px",
    }}>

      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes floatLeaf { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-12px) rotate(3deg)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        .ft-scroll::-webkit-scrollbar{height:4px} .ft-scroll::-webkit-scrollbar-track{background:rgba(0,0,0,0.08)} .ft-scroll::-webkit-scrollbar-thumb{background:#333333;border-radius:4px}
        .gallery-thumb:hover{border-color:${T.leaf} !important; opacity:1 !important;}

        /* Full-screen hero image — sized to clear the navbar, bird stays fully visible on small screens */
        .ft-hero { height: calc(100vh - ${NAVBAR_HEIGHT}px); min-height: 520px; }
        .ft-hero-img { object-position: center 22%; }
        @media (max-width: 768px) {
          .ft-hero { height: 70vh !important; min-height: 460px !important; }
          .ft-hero-img { object-position: center 14% !important; }
        }
        @media (max-width: 480px) {
          .ft-hero { height: 62vh !important; min-height: 420px !important; }
          .ft-hero-img { object-position: center 10% !important; }
        }
      `}</style>

      {/* ══════════════════════════════════════
          HERO — full-screen image, fading to white
      ══════════════════════════════════════ */}
      <div className="ft-hero" style={{ position: "relative", overflow: "hidden", marginTop: NAVBAR_HEIGHT }}>

        {/* Full-bleed image */}
        <img className="ft-hero-img" src={galleryImages[0]} alt={parrot.name} style={{
          position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
        }} />

        {/* Decorative leaves — sit on the photo itself */}
        <LeafDeco style={{ width: 110, top: "4%", left: "-2%", animation: "floatLeaf 7s ease-in-out infinite" }} opacity={0.5} />
        <LeafDeco style={{ width: 85, top: "10%", right: "-1%", animation: "floatLeaf 9s ease-in-out infinite 2s" }} opacity={0.4} flip />
        <BranchDeco style={{ width: 260, top: "4%", right: "4%" }} />

        {/* Fade to white at the bottom so the black/colored text below reads clearly */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(255,255,255,0) 42%, rgba(255,255,255,0.55) 68%, #ffffff 92%)",
        }} />

        {/* Top bar: back link + save button — sits just below the navbar */}
        <div style={{ position: "absolute", top: 20, left: 0, right: 0, padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 5 }}>
          <Link to="/" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            color: "#000000", fontFamily: "Outfit,sans-serif", fontSize: 13, fontWeight: 600,
            textDecoration: "none", letterSpacing: 0.5,
            background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)",
            padding: "8px 16px", borderRadius: 30, border: "1px solid rgba(0,0,0,0.1)",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#ffffff"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.85)"}
          >
            ← All Birds
          </Link>
          <button onClick={() => setSaved(s => !s)} style={{
            display: "flex", alignItems: "center", gap: 8,
            color: saved ? "#ff6b6b" : "#000000", fontSize: 13, fontWeight: 600,
            background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)",
            padding: "8px 16px", borderRadius: 30, border: `1px solid ${saved ? "rgba(255,107,107,0.35)" : "rgba(0,0,0,0.1)"}`,
            cursor: "pointer", fontFamily: "Outfit,sans-serif", transition: "all 0.2s",
          }}>
            <span style={{ transition: "transform 0.3s", transform: saved ? "scale(1.3)" : "scale(1)" }}>{saved ? "❤️" : "🤍"}</span>
            {saved ? "Saved" : "Save"}
          </button>
        </div>

        {/* Bottom content — sits in the white-faded zone, fully legible */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 24px 32px", zIndex: 5, animation: "fadeUp 0.7s ease both" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>

            {/* Category badge — green */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              marginBottom: 14,
              background: "rgba(22,163,74,0.12)", border: "1px solid rgba(22,163,74,0.35)",
              borderRadius: 30, padding: "5px 14px",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.leaf, display: "inline-block" }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: T.moss }}>{parrot.category}</span>
            </div>

            {/* Bird name */}
            <h1 style={{
              fontFamily: "Playfair Display,serif", fontWeight: 400,
              fontSize: "clamp(36px,6.5vw,72px)", color: "#000000", lineHeight: 1.05,
              marginBottom: 12, textShadow: "0 2px 16px rgba(255,255,255,0.6)",
            }}>
              {parrot.name}
            </h1>

            {/* Price + status row */}
            <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              <span style={{
                fontFamily: "Outfit,sans-serif", fontSize: 25, fontWeight: 700,
                background: T.orangeGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>{parrot.price}</span>
              <span style={{
                fontSize: 12, fontWeight: 600, color: "#ffffff",
                background: T.leaf, borderRadius: 20, padding: "4px 14px",
              }}>{parrot.status}</span>
            </div>

            {/* Quick stat pills */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
              {[
                { icon: "📏", label: parrot.size },
                { icon: "⏳", label: parrot.lifespan },
                { icon: "🗣️", label: parrot.talkingAbility },
                { icon: "🎓", label: parrot.difficulty },
              ].filter(x => x.label).map((x, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "rgba(255,255,255,0.85)", backdropFilter: "blur(6px)",
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: 20, padding: "5px 12px",
                  fontSize: 12, color: "#000000", fontWeight: 500,
                }}>
                  <span>{x.icon}</span>{x.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          BODY — white panels
      ══════════════════════════════════════ */}
      <div style={{ background: "transparent", position: "relative" }}>

        {/* ── GALLERY + DESCRIPTION ROW ── */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 24px 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>

            {/* Gallery */}
            <div style={{ animation: "fadeUp 0.6s 0.1s both" }}>
              {/* Main image */}
              <div style={{
                borderRadius: 24, overflow: "hidden", position: "relative",
                boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
                border: "1px solid rgba(0,0,0,0.15)",
              }}>
                <img src={galleryImages[activeImg]} alt={parrot.name}
                  style={{ width: "100%", height: 380, objectFit: "cover", display: "block", transition: "opacity 0.3s" }} />
                {/* gradient toe */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
                  background: "linear-gradient(transparent,rgba(0,0,0,0.6))",
                }} />
              </div>
              {/* Thumbnails */}
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                {galleryImages.map((img, i) => (
                  <button key={i} className="gallery-thumb" onClick={() => setActiveImg(i)} style={{
                    flex: 1, borderRadius: 12, overflow: "hidden", cursor: "pointer",
                    border: `2px solid ${activeImg === i ? T.leaf : "rgba(0,0,0,0.15)"}`,
                    opacity: activeImg === i ? 1 : 0.55, transition: "all 0.2s", background: "none", padding: 0,
                  }}>
                    <img src={img} alt="" style={{ width: "100%", height: 60, objectFit: "cover", display: "block" }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Description + info */}
            <div style={{ animation: "fadeUp 0.6s 0.2s both" }}>
              {/* Forest divider label */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg,rgba(0,0,0,0.4),transparent)" }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, color: "#000000", textTransform: "uppercase" }}>About</span>
                <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg,transparent,rgba(0,0,0,0.4))" }} />
              </div>

              <p style={{ fontSize: 15, color: T.fog, lineHeight: 1.85, marginBottom: 28 }}>{parrot.description}</p>

              {/* Info grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
                <InfoChip icon="📍" label="Origin"      value={parrot.origin} />
                <InfoChip icon="🥗" label="Diet"        value={parrot.diet} />
                <InfoChip icon="🧠" label="Behavior"    value={parrot.behavior} />
                <InfoChip icon="🔊" label="Noise Level" value={parrot.noiseLevel} />
              </div>

              {/* Compatibility */}
              {savedAnswers && (
                <div style={{
                  background: "#ffffff", border: "1px solid rgba(0,0,0,0.12)",
                  borderRadius: 18, padding: "16px 20px", marginBottom: 20,
                }}>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#000000", textTransform: "uppercase", marginBottom: 8 }}>Your Compatibility</p>
                  <CompatibilityBadge parrot={parrot} answers={savedAnswers} />
                  <p style={{ marginTop: 8, fontSize: 13, color: T.moss, fontWeight: 600 }}>
                    {score >= 80 ? "Perfect Match 🏆" : score >= 60 ? "Great Choice 👍" : "Needs Experience ⚠️"}
                  </p>
                </div>
              )}

              {/* CTA */}
              <a href={whatsappLink} target="_blank" rel="noreferrer" style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                width: "100%", padding: "16px 24px", borderRadius: 16, textDecoration: "none",
                background: "linear-gradient(135deg,#1a9b48,#128036)",
                color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: "Outfit,sans-serif",
                boxShadow: "0 8px 32px rgba(18,128,54,0.4)",
                transition: "all 0.25s cubic-bezier(.34,1.56,.64,1)",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 14px 40px rgba(18,128,54,0.5)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(18,128,54,0.4)"; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* ── STAT RINGS ── */}
        <div style={{ maxWidth: 1200, margin: "48px auto 0", padding: "0 24px" }}>
          <div style={{
            background: "#ffffff", border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: 24, padding: "40px 48px",
            position: "relative", overflow: "hidden",
          }}>
            <p style={{ textAlign: "center", fontSize: 10, fontWeight: 700, letterSpacing: 3, color: "#000000", textTransform: "uppercase", marginBottom: 32 }}>Bird Traits</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "clamp(24px,5vw,72px)", flexWrap: "wrap" }}>
              {stats.map(s => <StatRing key={s.label} {...s} />)}
            </div>
          </div>
        </div>

        {/* ── TABS SECTION ── */}
        <div style={{ maxWidth: 1200, margin: "48px auto 0", padding: "0 24px" }}>

          {/* Tab bar */}
          <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
            <ForestTab active={tab === "overview"} onClick={() => setTab("overview")} icon="🌿" label="Overview" />
            <ForestTab active={tab === "training"} onClick={() => setTab("training")} icon="🎓" label="Training" />
            <ForestTab active={tab === "care"}     onClick={() => setTab("care")}     icon="🍃" label="Care" />
          </div>

          {/* Panel */}
          <div style={{
            background: "#ffffff", border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: 24, padding: "36px 40px",
            position: "relative", overflow: "hidden",
            animation: "fadeIn 0.35s ease both",
          }}>

            {tab === "overview" && (
              <div>
                <h2 style={{ fontFamily: "Playfair Display,serif", fontSize: 32, fontWeight: 400, color: T.cream, marginBottom: 8 }}>
                  About <em>{parrot.name}</em>
                </h2>
                <div style={{ height: 2, width: 60, background: T.leafGrad, borderRadius: 2, marginBottom: 28 }} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 14 }}>
                  {[
                    { icon: "📍", label: "Origin",      value: parrot.origin },
                    { icon: "🥗", label: "Diet",        value: parrot.diet },
                    { icon: "🧠", label: "Behavior",    value: parrot.behavior },
                    { icon: "🔊", label: "Noise Level", value: parrot.noiseLevel },
                    { icon: "📏", label: "Size",        value: parrot.size },
                    { icon: "⏳", label: "Lifespan",    value: parrot.lifespan },
                  ].filter(x => x.value).map((x, i) => (
                    <div key={i} style={{
                      background: "#fff", border: "1px solid rgba(0,0,0,0.1)",
                      borderRadius: 16, padding: "18px 20px",
                      animation: `fadeUp 0.4s ${i * 0.06}s both`,
                      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                    }}>
                      <div style={{ fontSize: 20, marginBottom: 8 }}>{x.icon}</div>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#000000", textTransform: "uppercase", marginBottom: 4 }}>{x.label}</div>
                      <div style={{ fontSize: 14, color: T.fog, fontWeight: 500, lineHeight: 1.4 }}>{x.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "training" && (
              <div>
                <h2 style={{ fontFamily: "Playfair Display,serif", fontSize: 32, fontWeight: 400, color: T.cream, marginBottom: 8 }}>Training Guide</h2>
                <div style={{ height: 2, width: 60, background: T.leafGrad, borderRadius: 2, marginBottom: 28 }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
                  {/* Basic */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: T.leaf, boxShadow: `0 0 10px ${T.leaf}` }} />
                      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#000000", textTransform: "uppercase" }}>Foundation</span>
                    </div>
                    <h3 style={{ fontFamily: "Playfair Display,serif", fontSize: 20, color: T.cream, marginBottom: 16 }}>Basic Training</h3>
                    <div>{(parrot.training?.basic ?? []).map((item, i) => <TrainingStep key={i} text={item} idx={i} color={T.leaf} />)}</div>
                  </div>
                  {/* Advanced */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: T.amber, boxShadow: `0 0 10px ${T.amber}` }} />
                      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#000000", textTransform: "uppercase" }}>Advanced</span>
                    </div>
                    <h3 style={{ fontFamily: "Playfair Display,serif", fontSize: 20, color: T.cream, marginBottom: 16 }}>Advanced Techniques</h3>
                    <div>{(parrot.training?.advanced ?? []).map((item, i) => <TrainingStep key={i} text={item} idx={i} color={T.amber} />)}</div>
                  </div>
                </div>
                {/* Pro tip */}
                <div style={{
                  marginTop: 28, display: "flex", alignItems: "flex-start", gap: 14,
                  background: "#ffffff", border: "1px solid rgba(212,160,23,0.3)",
                  borderRadius: 16, padding: "16px 20px",
                }}>
                  <span style={{ fontSize: 20 }}>💡</span>
                  <p style={{ fontSize: 13.5, color: T.fog, lineHeight: 1.7 }}>
                    <strong style={{ color: T.amber }}>Pro Tip:</strong> Keep sessions under 15 minutes. Birds learn best with positive reinforcement — small treats and consistent praise deliver the fastest results.
                  </p>
                </div>
              </div>
            )}

            {tab === "care" && (
              <div>
                <h2 style={{ fontFamily: "Playfair Display,serif", fontSize: 32, fontWeight: 400, color: T.cream, marginBottom: 8 }}>Care & Maintenance</h2>
                <div style={{ height: 2, width: 60, background: T.leafGrad, borderRadius: 2, marginBottom: 28 }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
                  {(parrot.care ?? []).map((item, i) => <CareRow key={i} text={item} idx={i} />)}
                </div>
                <div style={{
                  marginTop: 24, display: "flex", alignItems: "center", gap: 12,
                  background: "#ffffff", border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: 14, padding: "14px 18px",
                }}>
                  <span>🏥</span>
                  <p style={{ fontSize: 13, color: T.mist }}>Schedule an <strong>annual avian vet checkup</strong> to ensure your bird's long-term health.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── OWNER TIPS — horizontal scroll ── */}
        <div style={{ maxWidth: 1200, margin: "48px auto 0", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: 20 }}>💡</span>
            <h2 style={{ fontFamily: "Playfair Display,serif", fontSize: 26, color: T.cream, fontWeight: 400 }}>Owner Tips</h2>
          </div>
          <div className="ft-scroll" style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8 }}>
            {ownerTips.map((tip, i) => (
              <div key={i} style={{
                flexShrink: 0, width: 220,
                background: "#fff", border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: 18, padding: "20px 18px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                animation: `fadeUp 0.4s ${i * 0.08}s both`,
              }}>
                <p style={{ fontSize: 13.5, color: T.fog, lineHeight: 1.7 }}>{tip}</p>              </div>
            ))}
          </div>
        </div>

        {/* ── SIMILAR BIRDS ── */}
        <div style={{ maxWidth: 1200, margin: "64px auto 0", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ height: 1, width: 40, background: T.leafGrad }} />
            <h2 style={{ fontFamily: "Playfair Display,serif", fontSize: 26, color: T.cream, fontWeight: 400 }}>Similar Birds</h2>
            <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg,rgba(0,0,0,0.4),transparent)" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
            {parrots.slice(0, 3).map((b, i) => (
              <Link key={b.id} to={`/breed/${b.id}`} style={{ textDecoration: "none", animation: `fadeUp 0.5s ${i * 0.1}s both` }}>
                <div style={{
                  borderRadius: 20, overflow: "hidden", position: "relative",
                  background: "#fff", border: "1px solid rgba(0,0,0,0.1)",
                  transition: "all 0.3s cubic-bezier(.34,1.56,.64,1)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.14)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.07)"; }}
                >
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    <img src={b.image} alt={b.name} style={{ width: "100%", height: 180, objectFit: "cover", display: "block", transition: "transform 0.5s ease" }}
                      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "none"}
                    />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 50%,rgba(26,74,46,0.5))" }} />
                  </div>
                  <div style={{ padding: "16px 18px" }}>
                    <p style={{ fontFamily: "Playfair Display,serif", fontSize: 18, color: T.cream, marginBottom: 4 }}>{b.name}</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: T.leaf }}>{b.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── RECENTLY VIEWED ── */}
        {recentIds.length > 0 && (
          <div style={{ maxWidth: 1200, margin: "48px auto 0", padding: "0 24px" }}>
            <h2 style={{ fontFamily: "Playfair Display,serif", fontSize: 22, color: T.cream, fontWeight: 400, marginBottom: 16 }}>🕓 Recently Viewed</h2>
            <div className="ft-scroll" style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8 }}>
              {recentIds.map(rid => parrots.find(p => p.id === rid)).filter(Boolean).slice(0, 5).map((b) => (
                <Link key={b.id} to={`/breed/${b.id}`} style={{ textDecoration: "none", flexShrink: 0 }}>
                  <div style={{
                    width: 160, borderRadius: 16, overflow: "hidden",
                    background: "#fff", border: "1px solid rgba(0,0,0,0.1)",
                    transition: "transform 0.2s", boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "none"}
                  >
                    <img src={b.image} alt={b.name} style={{ width: "100%", height: 110, objectFit: "cover", display: "block" }} />
                    <div style={{ padding: "10px 12px" }}>
                      <p style={{ fontFamily: "Playfair Display,serif", fontSize: 14, color: T.cream, marginBottom: 2 }}>{b.name}</p>
                      <p style={{ fontSize: 11, color: T.leaf, fontWeight: 600 }}>{b.price}</p>                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── TRUST STRIP ── */}
        <div style={{ maxWidth: 1200, margin: "64px auto 0", padding: "0 24px 80px" }}>
          <div style={{
            background: "#ffffff", border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: 24, padding: "40px 48px",
            display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32,
            position: "relative", overflow: "hidden",
          }}>
            {[
              { icon: "✅", title: "Healthy Birds Guaranteed", desc: "Every bird is vet-checked before it comes home with you." },
              { icon: "🏡", title: "Safe & Ethical Sourcing",  desc: "We partner only with responsible, licensed breeders." },
              { icon: "📞", title: "Lifetime Support",          desc: "Our avian advisors are available for the life of your bird." },
            ].map(({ icon, title, desc }, i) => (
              <div key={title} style={{ display: "flex", gap: 16, alignItems: "flex-start", animation: `fadeUp 0.5s ${i * 0.1}s both` }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: "#ffffff", border: "1px solid rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                }}>{icon}</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: T.cream, marginBottom: 4 }}>{title}</p>
                  <p style={{ fontSize: 12.5, color: T.fog, lineHeight: 1.6 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FLOATING ACTIONS ── */}
      {/* WhatsApp */}
      <a href={whatsappLink} target="_blank" rel="noreferrer" style={{
        position: "fixed", right: 24, bottom: "5.5rem", zIndex: 50,
        display: "flex", alignItems: "center", gap: 8,
        background: "linear-gradient(135deg,#1a9b48,#128036)",
        color: "#fff", padding: "12px 20px", borderRadius: 999,
        fontSize: 13, fontWeight: 700, fontFamily: "Outfit,sans-serif",
        textDecoration: "none", boxShadow: "0 8px 28px rgba(18,128,54,0.5)",
        transition: "all 0.25s cubic-bezier(.34,1.56,.64,1)",
      }}
        onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px) scale(1.04)"}
        onMouseLeave={e => e.currentTarget.style.transform = "none"}
      >
        💬 WhatsApp
      </a>

      {/* PDF */}
      <button onClick={handleDownloadPDF} disabled={exporting} style={{
        position: "fixed", right: 24, bottom: 24, zIndex: 50,
        display: "flex", alignItems: "center", gap: 8,
        background: T.leafGrad,
        color: "#fff", padding: "12px 20px", borderRadius: 999,
        fontSize: 13, fontWeight: 700, fontFamily: "Outfit,sans-serif",
        border: "none", cursor: exporting ? "wait" : "pointer",
        boxShadow: "0 8px 28px rgba(0,0,0,0.45)",
        opacity: exporting ? 0.75 : 1,
        transition: "all 0.25s cubic-bezier(.34,1.56,.64,1)",
      }}
        onMouseEnter={e => !exporting && (e.currentTarget.style.transform = "translateY(-3px) scale(1.04)")}
        onMouseLeave={e => e.currentTarget.style.transform = "none"}
      >
        {exporting ? "⏳ Generating…" : "⬇ Download PDF"}
      </button>
    </div>
  );
}