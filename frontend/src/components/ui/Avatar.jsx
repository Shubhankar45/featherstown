const AV = [["#0f1f10","#5ec96e"],["#1c140a","#e8b050"],["#100f1f","#8888ee"],["#1f0a12","#ee88a0"],["#0a1218","#66aadd"],["#181008","#cc8850"]];

export default function Avatar({ name }) {
  const i = name.charCodeAt(0) % AV.length;
  const [bg, fg] = AV[i];
  return (
    <div style={{
      width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
      background: bg, border: `2px solid ${fg}40`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-d)", fontSize: 20, color: fg,
    }}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
