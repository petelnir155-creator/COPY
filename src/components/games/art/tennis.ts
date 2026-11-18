import { crowdRows, f, skin, skinShade } from "./shared";

// במה 400x300. מבט מאחורי קו הבסיס הקרוב אל הרשת.
// מגרש: קו בסיס רחוק y=160 (x 118..282), רשת y=198, קו בסיס קרוב y=296 (x 8..392).

const edge = (y: number, side: "l" | "r", inset = 0) => {
  // קצה המגרש בגובה y (אינטרפולציה בין הבסיס הרחוק לקרוב); inset = כמה פנימה (0..1 מהרוחב)
  const t = (y - 160) / (296 - 160);
  const l = 118 + (8 - 118) * t;
  const r = 282 + (392 - 282) * t;
  const w = r - l;
  return side === "l" ? l + w * inset : r - w * inset;
};

export function tennisScene() {
  const bands = Array.from({ length: 12 }, (_, i) => {
    const y = 150 + i * 13;
    return `<rect x="0" y="${y}" width="400" height="13" fill="${i % 2 ? "#709a70" : "#789f76"}"/>`;
  }).join("");
  const courtBands = Array.from({ length: 11 }, (_, i) => {
    const y0 = 160 + i * 12.4;
    const y1 = Math.min(296, y0 + 12.4);
    return `<polygon points="${f(edge(y0, "l"))},${f(y0)} ${f(edge(y0, "r"))},${f(y0)} ${f(edge(y1, "r"))},${f(y1)} ${f(edge(y1, "l"))},${f(y1)}" fill="${i % 2 ? "#8fb589" : "#98bd91"}"/>`;
  }).join("");
  const tree = (cx: number, r: number, c: string) => `<circle cx="${cx}" cy="${96 - r * 0.2}" r="${r}" fill="${c}"/>`;
  const wallMarks = Array.from({ length: 9 }, (_, i) => {
    const x = 14 + i * 46;
    return i % 3 === 0
      ? `<circle cx="${x + 8}" cy="128" r="6" fill="#F4EFE6" opacity=".8"/><rect x="${x + 18}" y="125" width="18" height="6" fill="#F4EFE6" opacity=".8"/>`
      : i % 3 === 1
        ? `<rect x="${x}" y="120" width="34" height="4" fill="#F4EFE6" opacity=".75"/><rect x="${x}" y="130" width="22" height="4" fill="#FF4A1C" opacity=".9"/>`
        : `<polygon points="${x + 4},136 ${x + 17},118 ${x + 30},136" fill="#F4EFE6" opacity=".7"/>`;
  }).join("");

  const sy = 198;
  const ln = (y0: number, y1: number) => `<line x1="${f(edge(y0, "l"))}" y1="${y0}" x2="${f(edge(y1, "l"))}" y2="${y1}"/>`;
  const nl = (a: number, b: number, inset: number) =>
    `<line x1="${f(edge(a, "l", inset))}" y1="${a}" x2="${f(edge(b, "l", inset))}" y2="${b}"/><line x1="${f(edge(a, "r", inset))}" y1="${a}" x2="${f(edge(b, "r", inset))}" y2="${b}"/>`;

  return `
  <defs>
    <linearGradient id="tnSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9d3e0"/><stop offset="1" stop-color="#ece9df"/></linearGradient>
    <linearGradient id="tnWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26463a"/><stop offset="1" stop-color="#1a3228"/></linearGradient>
    <pattern id="tnMesh" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 0H6M0 0V6" stroke="#111" stroke-opacity=".5" stroke-width=".8" fill="none"/></pattern>
  </defs>
  <rect width="400" height="150" fill="url(#tnSky)"/>
  <g opacity=".85"><ellipse cx="70" cy="24" rx="40" ry="9" fill="#fff"/><ellipse cx="96" cy="30" rx="28" ry="7" fill="#fff"/><ellipse cx="300" cy="18" rx="46" ry="9" fill="#fff"/><ellipse cx="330" cy="26" rx="26" ry="6" fill="#fff"/></g>
  ${tree(20, 26, "#4d7a5c")}${tree(70, 22, "#5c8a68")}${tree(130, 28, "#4d7a5c")}${tree(205, 20, "#5c8a68")}${tree(270, 27, "#4d7a5c")}${tree(335, 22, "#5c8a68")}${tree(385, 28, "#4d7a5c")}
  <rect x="0" y="88" width="400" height="18" fill="#3f6b50"/>
  ${crowdRows({ y0: 80, y1: 98, rows: 4, seed: 5, palette: ["#e6e0d2", "#c9c2b3", "#FF4A1C", "#8e9a93", "#2a2d35", "#a8421f", "#f4efe6"] })}
  <rect x="0" y="106" width="400" height="48" fill="url(#tnWall)"/>
  ${wallMarks}
  <rect x="0" y="152" width="400" height="3" fill="#0e1f18"/>
  ${bands}
  ${courtBands}
  <g fill="none" stroke="#F4EFE6" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round">
    <line x1="118" y1="160" x2="282" y2="160"/><line x1="8" y1="296" x2="392" y2="296" stroke-width="4.5"/>
    ${ln(160, 296)}
    <line x1="${f(edge(296, "r"))}" y1="296" x2="${f(edge(160, "r"))}" y2="160"/>
    ${nl(160, 296, 0.1)}
    <line x1="${f(edge(178, "l", 0.1))}" y1="178" x2="${f(edge(178, "r", 0.1))}" y2="178" stroke-width="2.6"/>
    <line x1="${f(edge(250, "l", 0.1))}" y1="250" x2="${f(edge(250, "r", 0.1))}" y2="250" stroke-width="3.6"/>
    <line x1="200" y1="178" x2="200" y2="250" stroke-width="2.6"/>
    <line x1="200" y1="294" x2="200" y2="289" stroke-width="3"/>
  </g>
  <!-- כיסא שופט -->
  <g>
    <ellipse cx="344" cy="214" rx="20" ry="3.5" fill="#000" opacity=".22"/>
    <g stroke="#1a3228" stroke-width="3" stroke-linecap="round"><line x1="334" y1="212" x2="337" y2="172"/><line x1="354" y1="212" x2="351" y2="172"/><line x1="336" y1="196" x2="352" y2="196" stroke-width="2"/><line x1="337" y1="184" x2="351" y2="184" stroke-width="2"/></g>
    <rect x="330" y="168" width="28" height="5" rx="1.5" fill="#26463a"/>
    <rect x="352" y="148" width="5" height="22" rx="1.5" fill="#26463a"/>
    <path d="M338 168 L338 152 Q344 146 350 152 L350 168 Z" fill="#111"/>
    <rect x="337" y="160" width="14" height="3" fill="#F4EFE6" opacity=".9"/>
    <circle cx="344" cy="146" r="5.6" fill="${skin}"/><path d="M338.6 144 Q344 138 349.4 144 Z" fill="#F4EFE6"/>
  </g>
  <!-- שופטי קו -->
  ${[96, 306].map((x) => `<g><rect x="${x - 5}" y="140" width="10" height="13" rx="2" fill="#111"/><circle cx="${x}" cy="137" r="4.2" fill="${skin}"/><path d="M${x - 4.4} 136 Q${x} 131 ${x + 4.4} 136 Z" fill="#F4EFE6"/></g>`).join("")}
  <!-- רשת -->
  <ellipse cx="200" cy="${sy + 7}" rx="125" ry="4" fill="#000" opacity=".22"/>
  <polygon points="86,${sy - 15} 314,${sy - 15} 314,${sy + 3} 86,${sy + 3}" fill="#fff" opacity=".18"/>
  <polygon points="86,${sy - 15} 314,${sy - 15} 314,${sy + 3} 86,${sy + 3}" fill="url(#tnMesh)"/>
  <line x1="86" y1="${sy - 15}" x2="314" y2="${sy - 15}" stroke="#F4EFE6" stroke-width="4.5"/>
  <line x1="86" y1="${sy + 3}" x2="314" y2="${sy + 3}" stroke="#F4EFE6" stroke-width="1.6" stroke-opacity=".8"/>
  <g stroke="#111" stroke-width="5" stroke-linecap="round"><line x1="84" y1="${sy - 18}" x2="84" y2="${sy + 6}"/><line x1="316" y1="${sy - 18}" x2="316" y2="${sy + 6}"/></g>
  <g stroke="#F4EFE6" stroke-width="1.4" stroke-linecap="round" opacity=".7"><line x1="84" y1="${sy - 18}" x2="84" y2="${sy + 6}"/><line x1="316" y1="${sy - 18}" x2="316" y2="${sy + 6}"/></g>
  <rect x="198" y="${sy - 15}" width="4" height="18" fill="#F4EFE6" opacity=".9"/>`;
}

export function tennisOverlay() {
  return `
  <defs><radialGradient id="tnVig" cx=".5" cy=".55" r=".8"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".32"/></radialGradient></defs>
  <rect width="400" height="300" fill="url(#tnVig)"/>`;
}

export type TennisPose = "idle" | "throw" | "runA" | "runB";

// שחקן מאחור (viewBox 100x160): בגדי טניס לבנים, מחבט ביד שמאל (בצד שמאל של התמונה)
export function tennisPlayer(pose: TennisPose) {
  const sock = (x1: number, y1: number, x2: number, y2: number) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="#F4EFE6" stroke-width="10.5" stroke-linecap="round"/>`;
  const thigh = (x1: number, y1: number, x2: number, y2: number) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${skin}" stroke-width="11" stroke-linecap="round"/>`;
  const shoe = (cx: number, cy: number, rot = 0) => `<g transform="rotate(${rot} ${cx} ${cy})"><ellipse cx="${cx}" cy="${cy}" rx="10" ry="5" fill="#F4EFE6" stroke="#111" stroke-width="2.2"/><path d="M${cx - 6} ${cy} H${cx + 6}" stroke="#FF4A1C" stroke-width="2"/></g>`;
  let legs = "";
  if (pose === "idle" || pose === "throw") {
    legs = thigh(41, 100, 40, 122) + sock(40, 120, 39, 146) + shoe(38, 150) + thigh(59, 100, 60, 122) + sock(60, 120, 61, 146) + shoe(62, 150);
  } else if (pose === "runA") {
    legs = thigh(41, 100, 39, 124) + sock(39, 122, 37, 146) + shoe(36, 150) + thigh(59, 100, 66, 118) + sock(66, 118, 58, 136) + shoe(57, 140, -20);
  } else {
    legs = thigh(59, 100, 61, 124) + sock(61, 122, 63, 146) + shoe(64, 150) + thigh(41, 100, 34, 118) + sock(34, 118, 42, 136) + shoe(43, 140, 20);
  }
  const armL = pose === "idle" || pose === "throw" ? "M31 42 L25 70 L27 86" : "M31 42 L24 62 L30 78";
  const handL = pose === "idle" || pose === "throw" ? [27, 87] : [30, 79];
  const armR = pose === "idle" ? "M69 42 L82 62 L86 74" : pose === "throw" ? "M69 42 L88 14" : "M69 42 L78 60 L72 76";
  const handR = pose === "idle" ? [86, 75] : pose === "throw" ? [89, 11] : [71, 77];
  const racket = (hx: number, hy: number) => `
    <g transform="rotate(12 ${hx} ${hy})">
      <line x1="${hx}" y1="${hy}" x2="${hx}" y2="${hy + 20}" stroke="#111" stroke-width="3.4" stroke-linecap="round"/>
      <ellipse cx="${hx}" cy="${hy + 38}" rx="11" ry="16" fill="#fff" fill-opacity=".35" stroke="#FF4A1C" stroke-width="3.6"/>
      <g stroke="#111" stroke-opacity=".38" stroke-width=".9"><line x1="${hx}" y1="${hy + 23}" x2="${hx}" y2="${hy + 53}"/><line x1="${hx - 8}" y1="${hy + 30}" x2="${hx - 8}" y2="${hy + 46}"/><line x1="${hx + 8}" y1="${hy + 30}" x2="${hx + 8}" y2="${hy + 46}"/><line x1="${hx - 10}" y1="${hy + 33}" x2="${hx + 10}" y2="${hy + 33}"/><line x1="${hx - 10}" y1="${hy + 43}" x2="${hx + 10}" y2="${hy + 43}"/><line x1="${hx - 11}" y1="${hy + 38}" x2="${hx + 11}" y2="${hy + 38}"/></g>
    </g>`;
  return `
  <ellipse cx="50" cy="155" rx="30" ry="5" fill="#000" opacity=".28"/>
  <g stroke-linecap="round" stroke-linejoin="round" fill="none">${legs}</g>
  <path d="M33 90 Q50 95 67 90 L69 112 Q50 116 31 112 Z" fill="#F4EFE6" stroke="#111" stroke-width="2.4" stroke-linejoin="round"/>
  <path d="M50 95 V113" stroke="#111" stroke-opacity=".35" stroke-width="1.4"/>
  <g stroke="${skin}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="${armL}"/><path d="${armR}"/></g>
  ${racket(handL[0], handL[1])}
  <circle cx="${handL[0]}" cy="${handL[1]}" r="4.4" fill="${skin}"/><circle cx="${handR[0]}" cy="${handR[1]}" r="4.4" fill="${skin}"/>
  <path d="M28 42 L29 38 L72 38 L72 42 L68 44" fill="none"/>
  <path d="M30 40 Q50 32 70 40 L68 94 Q50 98 32 94 Z" fill="#F4EFE6" stroke="#111" stroke-width="2.6" stroke-linejoin="round"/>
  <path d="M30 40 L25 51 L33 55 L35 43 Z M70 40 L75 51 L67 55 L65 43 Z" fill="#F4EFE6" stroke="#111" stroke-width="2.2" stroke-linejoin="round"/>
  <path d="M33 62 H67" stroke="#FF4A1C" stroke-width="4"/>
  <path d="M43 39 Q50 44 57 39" stroke="#111" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <g stroke="#F4EFE6" stroke-width="5.4" stroke-linecap="round"><path d="${pose === "idle" || pose === "throw" ? "M25 67 L26 71" : "M24 60 L26 64"}"/></g>
  <ellipse cx="38.5" cy="22" rx="2.6" ry="4.4" fill="${skinShade}"/><ellipse cx="61.5" cy="22" rx="2.6" ry="4.4" fill="${skinShade}"/>
  <circle cx="50" cy="21" r="12.5" fill="#17120f"/>
  <path d="M39 27 Q50 36 61 27 L60.5 31 Q50 38 39.5 31 Z" fill="${skin}"/>
  <path d="M37.6 17 Q50 22 62.4 17" stroke="#F4EFE6" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M37.6 17 Q50 22 62.4 17" stroke="#FF4A1C" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
}

// שולחן רגיל מעץ (viewBox 120x80). broken = רגל ימנית שבורה וסדק בלוח
export function table(broken: boolean) {
  const top = "#A9774F";
  const edgeC = "#6E4B33";
  const leg = "#7B5538";
  const legHi = "#94694a";
  return `
  <ellipse cx="60" cy="78" rx="52" ry="3.4" fill="#000" opacity=".22"/>
  <g stroke-linecap="round">
    <line x1="22" y1="34" x2="24" y2="62" stroke="${legHi}" stroke-width="5"/>
    <line x1="98" y1="34" x2="${broken ? 108 : 96}" y2="${broken ? 58 : 62}" stroke="${legHi}" stroke-width="5"/>
    <line x1="8" y1="42" x2="6" y2="76" stroke="${leg}" stroke-width="7"/>
    ${broken ? `<line x1="112" y1="42" x2="113" y2="55" stroke="${leg}" stroke-width="7"/><path d="M109 55 L112 51 L114 56 L117 52 L118 56 Z" fill="#d7b38c"/>` : `<line x1="112" y1="42" x2="114" y2="76" stroke="${leg}" stroke-width="7"/>`}
  </g>
  <rect x="6" y="40" width="108" height="5" fill="${edgeC}"/>
  <polygon points="14,14 106,14 120,34 0,34" fill="${top}"/>
  <polygon points="0,34 120,34 120,42 0,42" fill="${edgeC}"/>
  <polygon points="0,34 120,34 120,36.5 0,36.5" fill="#fff" opacity=".12"/>
  <g stroke="#7a5233" stroke-opacity=".5" stroke-width="1" fill="none"><path d="M24 20 Q60 24 98 20"/><path d="M18 27 Q60 31 104 27"/><path d="M30 17 Q60 18 90 17" stroke-opacity=".3"/></g>
  ${broken ? `<path d="M58 14 L54 22 L62 25 L55 32 L60 34 L58 42" stroke="#2a1a10" stroke-width="2" fill="none" stroke-linejoin="round"/><path d="M92 14 L88 20 L95 22" stroke="#2a1a10" stroke-width="1.6" fill="none"/>` : ""}`;
}

export function tableLeg() {
  return `<rect x="1" y="1" width="7" height="34" rx="3" fill="#7B5538"/><path d="M0 31 L3 36 L5 31 L8 36 L8 32 Z" fill="#d7b38c"/>`;
}
