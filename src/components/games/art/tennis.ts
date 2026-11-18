import { crowdRows, f, fxDefs, limb, skin, skinShade } from "./shared";
import type { P } from "./shared";

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
    <pattern id="tnMesh" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M0 0H5M0 0V5" stroke="#111" stroke-opacity=".55" stroke-width=".7" fill="none"/></pattern>
    <radialGradient id="tnSun" cx=".82" cy=".05" r=".9"><stop offset="0" stop-color="#fff6dc" stop-opacity=".9"/><stop offset=".4" stop-color="#fff6dc" stop-opacity=".18"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <linearGradient id="tnCourtG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>
    <linearGradient id="tnLight" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".7" stop-color="#fff" stop-opacity=".16"/><stop offset="1" stop-color="#fff" stop-opacity=".02"/></linearGradient>
    <linearGradient id="tnBand" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#cfc9b8"/></linearGradient>
    <linearGradient id="tnPostG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a4e5a"/><stop offset="1" stop-color="#0c0d10"/></linearGradient>
    ${fxDefs("tn")}
  </defs>
  <rect width="400" height="150" fill="url(#tnSky)"/>
  <rect width="400" height="150" fill="url(#tnSun)"/><g opacity=".85" filter="url(#tnBlur1)"><ellipse cx="70" cy="24" rx="40" ry="9" fill="#fff"/><ellipse cx="96" cy="30" rx="28" ry="7" fill="#fff"/><ellipse cx="300" cy="18" rx="46" ry="9" fill="#fff"/><ellipse cx="330" cy="26" rx="26" ry="6" fill="#fff"/></g>
  <g filter="url(#tnBlur2)">${tree(20, 26, "#4d7a5c")}${tree(70, 22, "#5c8a68")}${tree(130, 28, "#4d7a5c")}${tree(205, 20, "#5c8a68")}${tree(270, 27, "#4d7a5c")}${tree(335, 22, "#5c8a68")}${tree(385, 28, "#4d7a5c")}</g>
  <rect x="0" y="88" width="400" height="18" fill="#3f6b50"/>
  <g filter="url(#tnBlur1)">${crowdRows({ y0: 80, y1: 98, rows: 4, seed: 5, palette: ["#e6e0d2", "#c9c2b3", "#FF4A1C", "#8e9a93", "#2a2d35", "#a8421f", "#f4efe6"] })}</g>
  <rect x="0" y="106" width="400" height="48" fill="url(#tnWall)"/>
  <rect x="0" y="106" width="400" height="48" fill="url(#tnLight)"/>
  <g stroke="#000" stroke-opacity=".22" stroke-width=".8">${Array.from({ length: 40 }, (_, i) => `<line x1="${i * 10}" y1="106" x2="${i * 10}" y2="154"/>`).join("")}</g>
  ${wallMarks}
  <rect x="0" y="152" width="400" height="3" fill="#0e1f18"/>
  ${bands}
  ${courtBands}
  <rect x="0" y="150" width="400" height="150" filter="url(#tnTurf)" opacity=".18"/>
  <rect x="0" y="150" width="400" height="150" fill="url(#tnCourtG)"/>
  <ellipse cx="300" cy="262" rx="90" ry="24" fill="#fff" opacity=".07" filter="url(#tnSoft)"/>
  <!-- כתמי שחיקה בקו הבסיס -->
  <ellipse cx="200" cy="288" rx="110" ry="6" fill="#6b4f3a" opacity=".16" filter="url(#tnBlur2)"/>
  <g fill="none" stroke="#F4EFE6" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round" style="filter:drop-shadow(0 .8px .6px rgba(0,0,0,.28))">
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
    <ellipse cx="348" cy="215" rx="22" ry="3.8" fill="#000" opacity=".3" filter="url(#tnBlur1)"/>
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
  <ellipse cx="206" cy="${sy + 8}" rx="125" ry="5" fill="#000" opacity=".3" filter="url(#tnBlur1)"/>
  <polygon points="86,${sy - 15} 314,${sy - 15} 314,${sy + 3} 86,${sy + 3}" fill="#fff" opacity=".18"/>
  <polygon points="86,${sy - 15} 314,${sy - 15} 314,${sy + 3} 86,${sy + 3}" fill="url(#tnMesh)"/>
  <line x1="86" y1="${sy - 15}" x2="314" y2="${sy - 15}" stroke="url(#tnBand)" stroke-width="4.8"/><line x1="86" y1="${sy - 16.6}" x2="314" y2="${sy - 16.6}" stroke="#fff" stroke-width="1"/>
  <line x1="86" y1="${sy + 3}" x2="314" y2="${sy + 3}" stroke="#F4EFE6" stroke-width="1.6" stroke-opacity=".8"/>
  <g stroke="url(#tnPostG)" stroke-width="5" stroke-linecap="round"><line x1="84" y1="${sy - 18}" x2="84" y2="${sy + 6}"/><line x1="316" y1="${sy - 18}" x2="316" y2="${sy + 6}"/></g>
  <g stroke="#F4EFE6" stroke-width="1.4" stroke-linecap="round" opacity=".7"><line x1="84" y1="${sy - 18}" x2="84" y2="${sy + 6}"/><line x1="316" y1="${sy - 18}" x2="316" y2="${sy + 6}"/></g>
  <rect x="198" y="${sy - 15}" width="4" height="18" fill="#F4EFE6" opacity=".9"/>`;
}

export function tennisOverlay() {
  return `
  <defs>
    <radialGradient id="tnVig" cx=".55" cy=".5" r=".8"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#1a1208" stop-opacity=".5"/></radialGradient>
    <linearGradient id="tnGrade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd28a" stop-opacity=".0"/><stop offset="1" stop-color="#ff9a4d" stop-opacity=".2"/></linearGradient>
    <linearGradient id="tnRays" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3d0" stop-opacity=".22"/><stop offset="1" stop-color="#fff3d0" stop-opacity="0"/></linearGradient>
    <filter id="tnGrain2" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  1.6 0 0 0 -.62"/></filter>
  </defs>
  <polygon points="400,0 330,0 120,300 400,300" fill="url(#tnRays)" style="mix-blend-mode:screen"/>
  <rect width="400" height="300" fill="url(#tnGrade)" style="mix-blend-mode:soft-light"/>
  <rect width="400" height="300" fill="url(#tnVig)"/>
  <rect width="400" height="300" filter="url(#tnGrain2)" opacity=".18" style="mix-blend-mode:overlay"/>`;
}
export type TennisPose = "idle" | "throw" | "runA" | "runB";

// שחקן מאחור (viewBox 100x160): בגדי טניס לבנים, מחבט ביד שמאל (בצד שמאל של התמונה)
export function tennisPlayer(pose: TennisPose) {
  const white = "#F4EFE6";
  const shoe = (cx: number, cy: number, rot = 0) => `<g transform="rotate(${rot} ${cx} ${cy})"><path d="M${cx - 10} ${cy + 3} Q${cx - 9} ${cy - 4} ${cx - 2} ${cy - 4.6} L${cx + 4} ${cy - 3.4} Q${cx + 10} ${cy - 1} ${cx + 10.4} ${cy + 3} Z" fill="url(#tnShoe)" stroke="#111" stroke-width="1.6" stroke-linejoin="round"/><path d="M${cx - 10} ${cy + 1.6} H${cx + 10.4}" stroke="#FF4A1C" stroke-width="2"/><path d="M${cx - 10} ${cy + 3.6} H${cx + 10.4}" stroke="#111" stroke-width="2.2" stroke-linecap="round"/></g>`;
  const leg = (pts: P[]) => limb([pts[0], pts[1]], [12, 10], skin, skinShade, "#fff") + limb([pts[1], pts[2]], [9.8, 7.6], white, "#9a9486", "#fff") + `<path d="M${pts[1][0] - 4} ${pts[1][1] + (pts[2][1] - pts[1][1]) * 0.55} H${pts[1][0] + 4.4}" stroke="#FF4A1C" stroke-width="1.6" stroke-linecap="round"/>`;
  let legs = "";
  if (pose === "idle" || pose === "throw") legs = leg([[41, 100], [40, 122], [39, 146]]) + leg([[59, 100], [60, 122], [61, 146]]) + shoe(38, 150) + shoe(62, 150);
  else if (pose === "runA") legs = leg([[41, 100], [39, 124], [37, 146]]) + leg([[59, 100], [66, 118], [58, 136]]) + shoe(36, 150) + shoe(57, 140, -20);
  else legs = leg([[59, 100], [61, 124], [63, 146]]) + leg([[41, 100], [34, 118], [42, 136]]) + shoe(64, 150) + shoe(43, 140, 20);

  const still = pose === "idle" || pose === "throw";
  const armL: P[] = still ? [[31, 43], [25, 66], [27, 85]] : [[31, 43], [24, 62], [30, 78]];
  const handL = armL[2];
  const armR: P[] = pose === "idle" ? [[69, 43], [82, 62], [86, 74]] : pose === "throw" ? [[69, 43], [80, 27], [89, 12]] : [[69, 43], [78, 60], [72, 76]];
  const handR = armR[2];
  const hand = (h: P) => `<circle cx="${h[0]}" cy="${h[1]}" r="4.5" fill="${skin}"/><circle cx="${f(h[0] - 1.2)}" cy="${f(h[1] - 1.2)}" r="1.5" fill="#fff" opacity=".3"/>`;
  const racket = (hx: number, hy: number) => `
    <g transform="rotate(12 ${hx} ${hy})">
      <line x1="${hx}" y1="${hy}" x2="${hx}" y2="${hy + 21}" stroke="#111" stroke-width="3.6" stroke-linecap="round"/>
      <line x1="${hx - 0.6}" y1="${hy + 1}" x2="${hx - 0.6}" y2="${hy + 12}" stroke="#555" stroke-width="1" stroke-linecap="round"/>
      <ellipse cx="${hx}" cy="${hy + 38}" rx="11" ry="16" fill="#fff" fill-opacity=".22" stroke="#7a1f06" stroke-width="4.4"/>
      <ellipse cx="${hx}" cy="${hy + 38}" rx="11" ry="16" fill="none" stroke="#FF4A1C" stroke-width="3.2"/>
      <path d="M${hx - 8} ${hy + 27} Q${hx - 4} ${hy + 24} ${hx} ${hy + 23.6}" stroke="#ffc4ae" stroke-width="1" fill="none"/>
      <g stroke="#fff" stroke-opacity=".55" stroke-width=".7">${[-8, -4, 0, 4, 8].map((d) => `<line x1="${hx + d}" y1="${hy + 24}" x2="${hx + d}" y2="${hy + 52}"/>`).join("")}${[28, 33, 38, 43, 48].map((d) => `<line x1="${hx - 10}" y1="${hy + d}" x2="${hx + 10}" y2="${hy + d}"/>`).join("")}</g>
    </g>`;
  return `
  <defs>
    <linearGradient id="tnShoe" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#b9b3a4"/></linearGradient>
    <linearGradient id="tnShirt" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fffdf7"/><stop offset=".55" stop-color="#F4EFE6"/><stop offset="1" stop-color="#b9b2a2"/></linearGradient>
    <filter id="tnShadowBlur" x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="2.4"/></filter>
  </defs>
  <ellipse cx="50" cy="155" rx="34" ry="5.4" fill="#000" opacity=".45" filter="url(#tnShadowBlur)"/>
  ${legs}
  <path d="M33 90 Q50 95 67 90 L69 112 Q50 116 31 112 Z" fill="url(#tnShirt)"/>
  <path d="M50 95 V113" stroke="#000" stroke-opacity=".22" stroke-width="1.4"/>
  <path d="M33 97 Q37 104 34 111" stroke="#000" stroke-opacity=".08" stroke-width="1.6" fill="none"/>
  <path d="M31 112 Q50 116 69 112" stroke="#8a8578" stroke-width="1.4" fill="none"/>
  ${limb(armL, [8.6, 6.8, 5.6], skin, skinShade, "#fff")}
  ${racket(handL[0], handL[1])}
  ${hand(handL)}
  <path d="M30 40 Q50 32 70 40 L68 94 Q50 98 32 94 Z" fill="url(#tnShirt)"/>
  <path d="M30 40 L25 51 L33 55 L35 43 Z" fill="url(#tnShirt)"/><path d="M70 40 L75 51 L67 55 L65 43 Z" fill="#cfc8b8"/>
  <path d="M36 58 Q40 74 36 92 M64 58 Q60 74 64 92" stroke="#000" stroke-opacity=".1" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <path d="M33 62 H67" stroke="#FF4A1C" stroke-width="4"/>
  <path d="M33 60.4 H67" stroke="#ff9a7c" stroke-opacity=".6" stroke-width="1"/>
  <path d="M30 40 Q50 32 70 40 L70 43 Q50 36 30 43 Z" fill="#000" opacity=".1"/>
  <path d="M30.6 41 L32 92" stroke="#fff" stroke-opacity=".9" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M43 39 Q50 44.4 57 39" stroke="#c9c2b3" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  ${limb(armR, [8.6, 6.8, 5.6], skin, skinShade, "#fff")}
  ${hand(handR)}
  <path d="M44 31 H56 L55.4 38 Q50 41 44.6 38 Z" fill="${skinShade}"/>
  <ellipse cx="38.5" cy="22" rx="2.6" ry="4.4" fill="${skinShade}"/><ellipse cx="61.5" cy="22" rx="2.6" ry="4.4" fill="#b38868"/>
  <circle cx="50" cy="21" r="12.5" fill="#1a1411"/>
  <path d="M39 27 Q50 36 61 27 L60.5 31 Q50 38 39.5 31 Z" fill="${skin}"/>
  <path d="M42 11.6 Q50 8.4 58 11.6 M40.4 16 Q50 12 59.6 16" stroke="#4a3a30" stroke-width="1.1" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M37.6 17 Q50 22 62.4 17" stroke="#b9b2a2" stroke-width="5.4" fill="none" stroke-linecap="round"/>
  <path d="M37.6 17 Q50 22 62.4 17" stroke="${white}" stroke-width="4.6" fill="none" stroke-linecap="round"/>
  <path d="M37.6 17 Q50 22 62.4 17" stroke="#FF4A1C" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
}

// שולחן רגיל מעץ (viewBox 120x80). broken = רגל ימנית שבורה וסדק בלוח
export function table(broken: boolean) {
  const edgeC = "#6E4B33";
  const legHi = "#94694a";
  return `
  <defs>
    <linearGradient id="tnTop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c8935f"/><stop offset=".55" stop-color="#A9774F"/><stop offset="1" stop-color="#7d5233"/></linearGradient>
    <linearGradient id="tnEdgeG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a5f3e"/><stop offset="1" stop-color="#4a3022"/></linearGradient>
    <linearGradient id="tnLegG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9a6e4b"/><stop offset=".5" stop-color="#7B5538"/><stop offset="1" stop-color="#4a3022"/></linearGradient>
    <filter id="tnTblBlur" x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="1.8"/></filter>
  </defs>
  <ellipse cx="60" cy="78" rx="54" ry="4" fill="#000" opacity=".4" filter="url(#tnTblBlur)"/>
  <g stroke-linecap="round">
    <line x1="22" y1="34" x2="24" y2="62" stroke="${legHi}" stroke-width="5"/>
    <line x1="98" y1="34" x2="${broken ? 108 : 96}" y2="${broken ? 58 : 62}" stroke="${legHi}" stroke-width="5"/>
    <line x1="8" y1="42" x2="6" y2="76" stroke="url(#tnLegG)" stroke-width="7"/>
    ${broken ? `<line x1="112" y1="42" x2="113" y2="55" stroke="url(#tnLegG)" stroke-width="7"/><path d="M109 55 L112 51 L114 56 L117 52 L118 56 Z" fill="#d7b38c"/>` : `<line x1="112" y1="42" x2="114" y2="76" stroke="url(#tnLegG)" stroke-width="7"/>`}
  </g>
  <rect x="6" y="40" width="108" height="5" fill="${edgeC}"/>
  <polygon points="14,14 106,14 120,34 0,34" fill="url(#tnTop)"/><polygon points="14,14 40,14 20,34 0,34" fill="#fff" opacity=".1"/>
  <polygon points="0,34 120,34 120,42 0,42" fill="url(#tnEdgeG)"/>
  <polygon points="0,34 120,34 120,36.5 0,36.5" fill="#fff" opacity=".12"/>
  <g stroke="#5a3a22" stroke-opacity=".45" stroke-width=".9" fill="none"><path d="M24 20 Q60 24 98 20"/><path d="M18 27 Q60 31 104 27"/><path d="M30 17 Q60 18 90 17" stroke-opacity=".3"/><path d="M10 31 Q60 34 112 31" stroke-opacity=".3"/><ellipse cx="40" cy="24" rx="3" ry="1.2" stroke-opacity=".3"/><ellipse cx="84" cy="27" rx="2.4" ry="1" stroke-opacity=".3"/></g>
  ${broken ? `<path d="M58 14 L54 22 L62 25 L55 32 L60 34 L58 42" stroke="#2a1a10" stroke-width="2" fill="none" stroke-linejoin="round"/><path d="M92 14 L88 20 L95 22" stroke="#2a1a10" stroke-width="1.6" fill="none"/>` : ""}`;
}

export function tableLeg() {
  return `<rect x="1" y="1" width="7" height="34" rx="3" fill="#7B5538"/><path d="M0 31 L3 36 L5 31 L8 36 L8 32 Z" fill="#d7b38c"/>`;
}
