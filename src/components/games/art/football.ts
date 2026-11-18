import { adBoards, crowdRows, f, fxDefs, limb, rng, skin, skinShade } from "./shared";
import type { P } from "./shared";

// במה 400x300. מבט מאחורי הבועט אל השער.
// שער: קורות ב-x=110..290, קורה עליונה y=70, קו שער y=128. (הקומפוננטה Football.tsx תלויה במספרים האלה)

export function footballScene() {
  const r = rng(19);
  // פסי כיסוח בפרספקטיבה, מתכנסים לנקודת מגוז (200,20)
  const V = { x: 200, y: 20 };
  const at = (xb: number, y: number) => V.x + (xb - V.x) * ((y - V.y) / (300 - V.y));
  let stripes = "";
  for (let i = -10; i < 14; i++) {
    const xa = i * 50;
    const xb = xa + 50;
    stripes += `<polygon points="${f(at(xa, 124))},124 ${f(at(xb, 124))},124 ${xb},300 ${xa},300" fill="${i % 2 ? "url(#fbStA)" : "url(#fbStB)"}"/>`;
  }
  // עשב: קווצות קצרות בקדמה (עומק) ובהירות בקצוות
  let blades = "";
  for (let i = 0; i < 260; i++) {
    const y = 150 + Math.pow(r(), 0.6) * 150;
    const x = r() * 400;
    const h = 2 + ((y - 150) / 150) * 7;
    const lean = (r() - 0.5) * 2.2;
    blades += `<path d="M${f(x)} ${f(y)} q${f(lean)} ${f(-h * 0.6)} ${f(lean * 1.8)} ${f(-h)}" stroke="${r() > 0.5 ? "#4f9468" : "#1f4733"}" stroke-width="${f(0.5 + (y - 150) / 150)}" opacity=".55" fill="none"/>`;
  }
  // פינות אבק/דשא שחוק מול השער
  let worn = `<ellipse cx="200" cy="140" rx="95" ry="9" fill="#5b4a33" opacity=".22" filter="url(#fbBlur2)"/>`;
  for (let i = 0; i < 40; i++) worn += `<circle cx="${f(130 + r() * 140)}" cy="${f(132 + r() * 14)}" r="${f(0.6 + r())}" fill="#6a5638" opacity=".35"/>`;

  const flare = (cx: number) =>
    `<circle cx="${cx}" cy="14" r="120" fill="url(#fbGlow)"/>` +
    `<rect x="${cx - 26}" y="3" width="52" height="14" rx="2" fill="#0d0e12" stroke="#2a2d36" stroke-width=".8"/>` +
    Array.from({ length: 10 }, (_, k) => `<circle cx="${cx - 20 + (k % 5) * 10}" cy="${7.5 + Math.floor(k / 5) * 5.5}" r="2.2" fill="#fff"/>`).join("") +
    `<rect x="${cx - 70}" y="9.5" width="140" height="1.4" fill="url(#fbStreak)"/><rect x="${cx - 1}" y="-30" width="2" height="90" fill="url(#fbStreakV)"/>`;

  // קהל: שלוש שכבות עומק עם טשטוש עולה, פסי מעקה ושבילים אנכיים
  const crowdFar = crowdRows({ y0: 26, y1: 58, rows: 4, seed: 11, flashes: 10 });
  const crowdNear = crowdRows({ y0: 62, y1: 100, rows: 4, seed: 12, flashes: 22 });
  let aisles = "";
  for (let x = 40; x < 400; x += 80) aisles += `<rect x="${x}" y="24" width="3" height="84" fill="#07080b" opacity=".6"/>`;

  return `
  <defs>
    <linearGradient id="fbSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#020306"/><stop offset="1" stop-color="#14161d"/></linearGradient>
    <radialGradient id="fbGlow"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset=".25" stop-color="#d8e6ff" stop-opacity=".28"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <linearGradient id="fbStreak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <linearGradient id="fbStreakV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".4"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <linearGradient id="fbStA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a6a49"/><stop offset="1" stop-color="#357d56"/></linearGradient>
    <linearGradient id="fbStB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#235b3f"/><stop offset="1" stop-color="#2d6d4a"/></linearGradient>
    <radialGradient id="fbPool" cx=".5" cy=".28" r=".7"><stop offset="0" stop-color="#e8ffd8" stop-opacity=".26"/><stop offset=".6" stop-color="#cfe8c0" stop-opacity=".07"/><stop offset="1" stop-color="#000" stop-opacity=".34"/></radialGradient>
    <linearGradient id="fbPost" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="#e9e5da"/><stop offset="1" stop-color="#8f8a7c"/></linearGradient>
    <linearGradient id="fbBar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#e3dfd3"/><stop offset="1" stop-color="#8f8a7c"/></linearGradient>
    <linearGradient id="fbLed" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FF4A1C"><animate attributeName="stop-color" values="#FF4A1C;#ff7a4d;#FF4A1C" dur="5s" repeatCount="indefinite"/></stop><stop offset="1" stop-color="#ff2a5c"/></linearGradient>
    <pattern id="fbNet" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0H6M0 0V6" stroke="#fff" stroke-opacity=".62" stroke-width=".8" fill="none"/></pattern>
    <pattern id="fbNet2" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><path d="M0 0H6" stroke="#fff" stroke-opacity=".35" stroke-width=".6" fill="none"/></pattern>
    ${fxDefs("fb")}
  </defs>
  <rect width="400" height="124" fill="url(#fbSky)"/>
  <g filter="url(#fbBlur2)">${crowdFar}</g>
  <g filter="url(#fbBlur1)">${crowdNear}</g>
  ${aisles}
  <rect x="0" y="0" width="400" height="18" fill="#030406"/>
  <g stroke="#1b1e27" stroke-width="1"><line x1="0" y1="16" x2="400" y2="16"/><line x1="0" y1="60" x2="400" y2="60" opacity=".7"/></g>
  ${flare(46)}${flare(354)}
  <!-- שלטי LED: זוהרים -->
  <rect x="0" y="106" width="400" height="18" fill="#08090c"/>
  ${adBoards(108, 14, 3)}
  <rect x="0" y="108" width="400" height="14" fill="url(#fbLed)" opacity=".16"/>
  <rect x="0" y="122" width="400" height="3" fill="#000" opacity=".55"/>
  <!-- מגרש -->
  <rect x="0" y="124" width="400" height="176" fill="#235b3f"/>
  ${stripes}
  <rect x="0" y="124" width="400" height="176" filter="url(#fbTurf)" opacity=".55"/>
  ${blades}
  ${worn}
  <rect x="0" y="124" width="400" height="176" fill="url(#fbPool)"/>
  <rect x="0" y="124" width="400" height="16" fill="#9fdcb0" opacity=".08"/>
  <g stroke="#F4EFE6" fill="none" stroke-linecap="round">
    <g opacity=".35" filter="url(#fbBlur1)"><line x1="0" y1="128" x2="400" y2="128" stroke-width="5"/><line x1="0" y1="160" x2="400" y2="160" stroke-width="6"/><line x1="0" y1="293" x2="400" y2="293" stroke-width="8"/></g>
    <line x1="0" y1="128" x2="400" y2="128" stroke-width="2.4" opacity=".95"/>
    <line x1="0" y1="160" x2="400" y2="160" stroke-width="3" opacity=".95"/>
    <line x1="0" y1="293" x2="400" y2="293" stroke-width="4.5" opacity=".95"/>
  </g>
  <ellipse cx="200" cy="237" rx="9" ry="3.6" fill="#7a6a4c" opacity=".35" filter="url(#fbBlur1)"/>
  <ellipse cx="200" cy="237" rx="5" ry="2.4" fill="#F4EFE6"/>
  <!-- צל השער וחלל הרשת -->
  <ellipse cx="200" cy="131" rx="108" ry="6" fill="#000" opacity=".4" filter="url(#fbBlur1)"/>
  <polygon points="124,78 276,78 276,121 124,121" fill="#05060a" opacity=".5"/>
  <polygon points="124,78 276,78 276,121 124,121" fill="url(#fbNet)"/>
  <polygon points="124,78 276,78 276,121 124,121" fill="url(#fbNet2)"/>
  <polygon points="110,70 124,78 124,121 110,128" fill="#000" opacity=".25"/>
  <polygon points="110,70 124,78 124,121 110,128" fill="url(#fbNet)"/>
  <polygon points="290,70 276,78 276,121 290,128" fill="#000" opacity=".25"/>
  <polygon points="290,70 276,78 276,121 290,128" fill="url(#fbNet)"/>
  <polygon points="110,70 290,70 276,78 124,78" fill="#fff" opacity=".1"/>
  <polygon points="110,70 290,70 276,78 124,78" fill="url(#fbNet)"/>
  <g stroke="#F4EFE6" stroke-opacity=".7" stroke-width="1.2" fill="none">
    <line x1="110" y1="70" x2="124" y2="78"/><line x1="290" y1="70" x2="276" y2="78"/>
    <line x1="124" y1="78" x2="124" y2="121"/><line x1="276" y1="78" x2="276" y2="121"/>
    <line x1="124" y1="121" x2="276" y2="121"/><line x1="124" y1="78" x2="276" y2="78"/>
  </g>
  <!-- קורות (גליל עם תאורה) -->
  <g stroke-linecap="square" fill="none">
    <line x1="110" y1="131" x2="110" y2="67" stroke="#000" stroke-opacity=".5" stroke-width="9" filter="url(#fbBlur1)"/>
    <line x1="290" y1="131" x2="290" y2="67" stroke="#000" stroke-opacity=".5" stroke-width="9" filter="url(#fbBlur1)"/>
    <rect x="106.5" y="67" width="7" height="64" fill="url(#fbPost)" stroke="#2a2a2a" stroke-width=".6"/>
    <rect x="286.5" y="67" width="7" height="64" fill="url(#fbPost)" stroke="#2a2a2a" stroke-width=".6"/>
    <rect x="106.5" y="66.5" width="187" height="7" fill="url(#fbBar)" stroke="#2a2a2a" stroke-width=".6"/>
  </g>
  <g fill="#e8302a"><rect x="106.5" y="86" width="7" height="3.2" opacity=".85"/><rect x="106.5" y="104" width="7" height="3.2" opacity=".85"/><rect x="286.5" y="86" width="7" height="3.2" opacity=".85"/><rect x="286.5" y="104" width="7" height="3.2" opacity=".85"/></g>`;
}

// שכבת קולנוע מעל הכול: אובך, הברקת עדשה, גרגר פילם, צבע וויניטה
export function footballOverlay() {
  return `
  <defs>
    <radialGradient id="fbVig" cx=".5" cy=".52" r=".78"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".62"/></radialGradient>
    <linearGradient id="fbGradeA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e3a66" stop-opacity=".32"/><stop offset=".55" stop-color="#1e3a66" stop-opacity="0"/><stop offset="1" stop-color="#ff7a3c" stop-opacity=".12"/></linearGradient>
    <linearGradient id="fbHaze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe3ff" stop-opacity="0"/><stop offset=".5" stop-color="#cfe3ff" stop-opacity=".11"/><stop offset="1" stop-color="#cfe3ff" stop-opacity="0"/></linearGradient>
    <filter id="fbGrain2" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="5" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  1.6 0 0 0 -.62"/></filter>
    <linearGradient id="fbBeam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  </defs>
  <polygon points="40,16 54,16 360,300 150,300" fill="url(#fbBeam)" style="mix-blend-mode:screen"/>
  <polygon points="346,16 360,16 250,300 40,300" fill="url(#fbBeam)" style="mix-blend-mode:screen"/>
  <rect y="108" width="400" height="30" fill="url(#fbHaze)"/>
  <rect width="400" height="300" fill="url(#fbGradeA)" style="mix-blend-mode:soft-light"/>
  <rect width="400" height="300" fill="url(#fbVig)"/>
  <rect width="400" height="300" filter="url(#fbGrain2)" opacity=".22" style="mix-blend-mode:overlay"/>`;
}

// ---------- דמויות ----------

export type StrikerPose = "idle" | "runA" | "runB" | "kick";

const jerseyHi = "#ff6a3d";

function boot(cx: number, cy: number, rot = 0) {
  return `<g transform="rotate(${rot} ${cx} ${cy})">
    <path d="M${cx - 10} ${cy + 1} Q${cx - 9} ${cy - 5} ${cx - 2} ${cy - 5.5} L${cx + 5} ${cy - 4} Q${cx + 11} ${cy - 1} ${cx + 10.5} ${cy + 3.5} L${cx - 10} ${cy + 4} Z" fill="url(#fbBoot)"/>
    <path d="M${cx - 10} ${cy + 3.4} H${cx + 10.5}" stroke="#f1ede2" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M${cx - 4} ${cy - 4} L${cx + 3} ${cy + 1}" stroke="#FF4A1C" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M${cx - 8} ${cy - 1} Q${cx - 3} ${cy - 5} ${cx + 3} ${cy - 3.6}" stroke="#fff" stroke-opacity=".35" stroke-width="1" fill="none"/>
  </g>`;
}

const sockBand = (pts: P[]) => {
  const a = pts[0];
  const b = pts[1];
  const t = (k: number): P => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  return limb([t(0.38), t(0.5)], [10.8, 10.4], "#111", "#000", "#555");
};

// בועט מאחור (viewBox 100x160, כפות רגליים ב-y≈154)
export function striker(pose: StrikerPose) {
  const stand = (hx: number, kx: number, ax: number): P[] => [[hx, 98], [kx, 122], [ax, 146]];
  let legL: P[];
  let legR: P[];
  let bootL: string;
  let bootR: string;
  if (pose === "idle") {
    legL = stand(41, 40, 39);
    legR = stand(59, 60, 61);
    bootL = boot(38, 150);
    bootR = boot(62, 150);
  } else if (pose === "runA") {
    legL = stand(41, 39, 37);
    legR = [[59, 98], [67, 118], [58, 136]];
    bootL = boot(36, 150);
    bootR = boot(57, 140, -22);
  } else if (pose === "runB") {
    legR = stand(59, 61, 63);
    legL = [[41, 98], [33, 118], [42, 136]];
    bootR = boot(64, 150);
    bootL = boot(43, 140, 22);
  } else {
    legL = stand(41, 38, 36);
    legR = [[59, 98], [77, 108], [91, 97]];
    bootL = boot(36, 150);
    bootR = boot(95, 93, -42);
  }
  const leg = (pts: P[]) => {
    const shin: P[] = [pts[1], pts[2]];
    return (
      limb([pts[0], pts[1]], [13, 11], skin, skinShade, "#fff") +
      limb(shin, [10.6, 7.6], "#FF4A1C", "#8a1d00", jerseyHi) +
      sockBand(shin)
    );
  };

  const arm = (side: "l" | "r") => {
    const sx = side === "l" ? 31 : 69;
    const m = side === "l" ? -1 : 1;
    let pts: P[];
    if (pose === "kick") pts = side === "l" ? [[sx, 44], [21, 50], [11, 58]] : [[sx, 44], [81, 41], [91, 35]];
    else if (pose === "idle") pts = [[sx, 44], [sx + m * 5, 60], [sx + m * 7, 74]];
    else pts = [[sx, 44], [sx + m * 6, 62], [sx - m * 2, 78]];
    const hand = pts[2];
    return limb(pts, [8.6, 6.6, 5.4], skin, skinShade, "#fff") + `<circle cx="${hand[0]}" cy="${hand[1]}" r="4.3" fill="${skin}"/><circle cx="${f(hand[0] - 1)}" cy="${f(hand[1] - 1)}" r="1.6" fill="#fff" opacity=".25"/>`;
  };

  return `
  <defs>
    <linearGradient id="fbBoot" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2b2b30"/><stop offset="1" stop-color="#050506"/></linearGradient>
    <linearGradient id="fbJersey" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff6a3d"/><stop offset=".45" stop-color="#FF4A1C"/><stop offset="1" stop-color="#b5300f"/></linearGradient>
    <linearGradient id="fbShorts" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a2b33"/><stop offset="1" stop-color="#08080a"/></linearGradient>
    <radialGradient id="fbGlowTop" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <filter id="fbShadowBlur" x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="2.4"/></filter>
  </defs>
  <ellipse cx="${pose === "kick" ? 55 : 50}" cy="155" rx="${pose === "kick" ? 44 : 31}" ry="5.4" fill="#000" opacity=".5" filter="url(#fbShadowBlur)"/>
  ${leg(legL)}${leg(legR)}${bootL}${bootR}
  <!-- מכנסיים -->
  <path d="M31 89 Q50 95 69 89 L71.5 114 Q61 119 52 113.5 L50 108 L48 113.5 Q39 119 28.5 114 Z" fill="url(#fbShorts)"/>
  <path d="M50 94 V108" stroke="#000" stroke-opacity=".55" stroke-width="1.4"/>
  <path d="M33 100 Q38 108 36 114 M67 100 Q62 108 64 114" stroke="#fff" stroke-opacity=".08" stroke-width="1.2" fill="none"/>
  <path d="M30.6 96 L29.6 113 M69.4 96 L70.4 113" stroke="#FF4A1C" stroke-width="2.2" stroke-linecap="round"/>
  ${arm("l")}${arm("r")}
  <!-- חולצה -->
  <path d="M29 41 Q50 31.5 71 41 L69.5 94 Q50 99.5 30.5 94 Z" fill="url(#fbJersey)"/>
  <path d="M29 41 L23.5 53 L32.5 57.5 L34 43 Z" fill="url(#fbJersey)"/><path d="M71 41 L76.5 53 L67.5 57.5 L66 43 Z" fill="#c93a12"/>
  <path d="M23.5 53 L32.5 57.5 M76.5 53 L67.5 57.5" stroke="#111" stroke-width="2" stroke-linecap="round"/>
  <path d="M34 60 Q40 72 36 92 M66 58 Q60 74 64 92" stroke="#000" stroke-opacity=".16" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <path d="M44 68 Q50 76 58 70" stroke="#000" stroke-opacity=".1" stroke-width="2" fill="none"/>
  <path d="M29 41 Q50 31.5 71 41 L71 44 Q50 36 29 44 Z" fill="#000" opacity=".16"/>
  <rect x="29" y="41" width="42" height="40" fill="url(#fbGlowTop)"/>
  <path d="M29.6 42 L30.8 92" stroke="#ffd0bd" stroke-opacity=".5" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M30 94 Q50 99.5 70 94" stroke="#111" stroke-width="2.4" fill="none"/>
  <path d="M41.5 35.6 Q50 41 58.5 35.6" stroke="#111" stroke-width="3.6" fill="none" stroke-linecap="round"/>
  <text x="50" y="52.4" text-anchor="middle" font-size="9" font-weight="800" fill="#000" opacity=".35" font-family="Heebo, Arial, sans-serif">פטל</text>
  <text x="50" y="52" text-anchor="middle" font-size="9" font-weight="800" fill="#F4EFE6" font-family="Heebo, Arial, sans-serif">פטל</text>
  <text x="50.8" y="83.6" text-anchor="middle" font-size="32" font-weight="900" fill="#000" opacity=".35" font-family="'Frank Ruhl Libre', Georgia, serif">9</text>
  <text x="50" y="82.6" text-anchor="middle" font-size="32" font-weight="900" fill="#F4EFE6" font-family="'Frank Ruhl Libre', Georgia, serif">9</text>
  <!-- צוואר וראש -->
  <path d="M44 31 H56 L55.5 38 Q50 41 44.5 38 Z" fill="${skinShade}"/>
  <ellipse cx="38.2" cy="22.5" rx="2.5" ry="4.4" fill="${skinShade}"/><ellipse cx="61.8" cy="22.5" rx="2.5" ry="4.4" fill="#b38868"/>
  <circle cx="50" cy="21" r="12.6" fill="#1a1411"/>
  <path d="M39.5 27 Q50 36.5 60.5 27 L60 31.4 Q50 38 40 31.4 Z" fill="${skin}"/>
  <path d="M39.4 25 Q50 33.5 60.6 25 L60.6 28 Q50 35.5 39.4 28 Z" fill="#1a1411"/>
  <path d="M42 11.5 Q50 8 58 11.5 M40 17 Q50 12.6 60 17 M41 22 Q50 18.6 59 22" stroke="#4a3a30" stroke-width="1.1" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M44 9 Q50 6.4 56 9" stroke="#8a7364" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".7"/>`;
}

// שוער מלפנים (viewBox 60x80, כפות ב-y≈78)
export function keeper() {
  const arm = (side: "l" | "r") => {
    const m = side === "l" ? -1 : 1;
    const pts: P[] = [[30 + m * 12.5, 29], [30 + m * 22, 20], [30 + m * 20.5, 9]];
    return limb(pts, [8, 6.4, 5.8], "#7fa990", "#2d4b3a", "#d4ecdc") + `<circle cx="${pts[2][0]}" cy="${pts[2][1] - 1}" r="5.8" fill="url(#fbGlove)" stroke="#111" stroke-width="1.2"/><path d="M${pts[2][0] - 3} ${pts[2][1] - 4} H${pts[2][0] + 3}" stroke="#f4efe6" stroke-width="1" stroke-linecap="round"/>`;
  };
  return `
  <defs>
    <radialGradient id="fbGlove" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#ff8a62"/><stop offset="1" stop-color="#d93a10"/></radialGradient>
    <linearGradient id="fbKeep" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b6dcc4"/><stop offset=".5" stop-color="#8fbca1"/><stop offset="1" stop-color="#5a8670"/></linearGradient>
  </defs>
  <ellipse cx="30" cy="78" rx="19" ry="3.2" fill="#000" opacity=".4" filter="url(#fbShadowBlur)"/>
  ${limb([[24, 50], [22, 63], [21, 74]], [8.6, 7, 6], skin, skinShade, "#fff")}
  ${limb([[36, 50], [38, 63], [39, 74]], [8.6, 7, 6], skin, skinShade, "#fff")}
  ${limb([[24, 60], [22.4, 68], [21.4, 74]], [8.6, 7.6, 7], "#17171c", "#000", "#555")}
  ${limb([[36, 60], [37.6, 68], [38.6, 74]], [8.6, 7.6, 7], "#17171c", "#000", "#555")}
  <path d="M13.5 76.2 Q13.5 72.4 20 72.4 H26 V78 H13.5 Z" fill="#0b0b0d"/><path d="M34 78 V72.4 H40 Q46.5 72.4 46.5 76.2 V78 Z" fill="#0b0b0d"/>
  <path d="M13.5 77.2 H26 M34 77.2 H46.5" stroke="#f1ede2" stroke-width="1.3" stroke-linecap="round"/>
  <path d="M18 46 H42 L43.6 59 Q30 63.4 16.4 59 Z" fill="#101014"/>
  ${arm("l")}${arm("r")}
  <path d="M17 25 Q30 19.5 43 25 L44.4 48 Q30 53 15.6 48 Z" fill="url(#fbKeep)"/>
  <path d="M16.4 37 Q30 42 43.6 37 L44 41.4 Q30 46.6 16 41.4 Z" fill="#17171c" opacity=".9"/>
  <path d="M25 24 Q30 29 35 24" stroke="#17171c" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M19 28 Q20 38 18 46" stroke="#fff" stroke-opacity=".4" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <rect x="26.5" y="21" width="7" height="5" rx="1.5" fill="${skinShade}"/>
  <circle cx="30" cy="14" r="8.8" fill="${skin}"/>
  <path d="M22.4 15 Q21.4 4.6 30 5 Q38.6 4.6 37.6 15 Q36 9.4 30 9.6 Q24 9.4 22.4 15 Z" fill="#17120f"/>
  <ellipse cx="21.6" cy="15.4" rx="1.4" ry="2.4" fill="${skinShade}"/><ellipse cx="38.4" cy="15.4" rx="1.4" ry="2.4" fill="${skinShade}"/>
  <path d="M24.8 12.2 L28.4 12.6 M35.2 12.2 L31.6 12.6" stroke="#2a1d14" stroke-width="1.1" stroke-linecap="round"/>
  <ellipse cx="26.8" cy="14.7" rx="1.5" ry="1.1" fill="#fff"/><ellipse cx="33.2" cy="14.7" rx="1.5" ry="1.1" fill="#fff"/>
  <circle cx="26.9" cy="14.8" r=".8" fill="#111"/><circle cx="33.1" cy="14.8" r=".8" fill="#111"/>
  <path d="M30 15.4 L29 18.2 Q30 18.9 31 18.2" stroke="${skinShade}" stroke-width=".8" fill="none"/>
  <path d="M27 20.6 Q30 22 33 20.6" stroke="#6b2d22" stroke-width="1" fill="none" stroke-linecap="round"/>`;
}

export function soccerBall() {
  return `
  <defs>
    <radialGradient id="sbG" cx=".34" cy=".28" r=".85"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#e6e0d2"/><stop offset="1" stop-color="#9c9686"/></radialGradient>
    <radialGradient id="sbShade" cx=".38" cy=".3" r=".8"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>
    <clipPath id="sbClip"><circle cx="20" cy="20" r="18.6"/></clipPath>
  </defs>
  <circle cx="20" cy="20" r="18.6" fill="url(#sbG)"/>
  <g clip-path="url(#sbClip)" fill="#14141a">
    <polygon points="20,12.8 26.9,17.8 24.3,26 15.7,26 13.1,17.8"/>
    <polygon points="20,1.2 24.6,4.2 22.6,9 17.4,9 15.4,4.2"/>
    <polygon points="38.6,13.6 39.6,19.4 35.2,22.4 31.2,18.6 33,14.6" />
    <polygon points="31.6,33.4 29.4,38.6 23.6,38 22.8,32.6 27.4,30"/>
    <polygon points="8.4,33.4 10.6,38.6 16.4,38 17.2,32.6 12.6,30"/>
    <polygon points="1.4,13.6 0.4,19.4 4.8,22.4 8.8,18.6 7,14.6"/>
  </g>
  <g stroke="#14141a" stroke-width="1.3" stroke-linecap="round" fill="none" clip-path="url(#sbClip)">
    <path d="M20 12.8 V9"/><path d="M26.9 17.8 L31.2 18.6"/><path d="M24.3 26 L27.4 30"/><path d="M15.7 26 L12.6 30"/><path d="M13.1 17.8 L8.8 18.6"/>
    <path d="M17.4 9 L7 14.6 M22.6 9 L33 14.6"/>
  </g>
  <circle cx="20" cy="20" r="18.6" fill="url(#sbShade)"/>
  <ellipse cx="14.4" cy="10.6" rx="5.2" ry="3" fill="#fff" opacity=".55" transform="rotate(-32 14.4 10.6)"/>
  <circle cx="20" cy="20" r="18.6" fill="none" stroke="#2a2a2a" stroke-opacity=".5" stroke-width=".8"/>`;
}
