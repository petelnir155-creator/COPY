import { adBoards, crowdRows, f, skin, skinShade } from "./shared";

// במה 400x300. מבט מאחורי הבועט אל השער.
// שער: קורות ב-x=110..290, קורה עליונה y=70, קו שער y=128.

export function footballScene() {
  // פסי כיסוח בפרספקטיבה, מתכנסים לנקודת מגוז (200,20)
  const V = { x: 200, y: 20 };
  const at = (xb: number, y: number) => V.x + (xb - V.x) * ((y - V.y) / (300 - V.y));
  let stripes = "";
  for (let i = -10; i < 14; i++) {
    const xa = i * 50;
    const xb = xa + 50;
    stripes += `<polygon points="${f(at(xa, 124))},124 ${f(at(xb, 124))},124 ${xb},300 ${xa},300" fill="${i % 2 ? "#2d5e46" : "#356c51"}"/>`;
  }

  const glow = (cx: number) =>
    `<circle cx="${cx}" cy="12" r="110" fill="url(#fbGlow)"/>` +
    `<rect x="${cx - 24}" y="4" width="48" height="12" rx="2" fill="#15161b"/>` +
    Array.from({ length: 8 }, (_, k) => `<circle cx="${cx - 18 + (k % 4) * 12}" cy="${8 + Math.floor(k / 4) * 5}" r="2" fill="#fff"/>`).join("");

  return `
  <defs>
    <linearGradient id="fbSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#06070a"/><stop offset="1" stop-color="#1a1c23"/></linearGradient>
    <radialGradient id="fbGlow"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".35" stop-color="#cfe0ff" stop-opacity=".16"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <linearGradient id="fbShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".5"/><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient>
    <pattern id="fbNet" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0H7M0 0V7" stroke="#fff" stroke-opacity=".5" stroke-width=".7" fill="none"/></pattern>
  </defs>
  <rect width="400" height="124" fill="url(#fbSky)"/>
  ${crowdRows({ y0: 26, y1: 100, rows: 7, seed: 11, flashes: 26 })}
  <rect x="0" y="0" width="400" height="16" fill="#050608"/>
  ${glow(46)}${glow(354)}
  ${adBoards(108, 16, 3)}
  <rect x="0" y="124" width="400" height="176" fill="#2d5e46"/>
  ${stripes}
  <rect x="0" y="124" width="400" height="176" fill="url(#fbShade)"/>
  <g stroke="#F4EFE6" stroke-opacity=".92" fill="none">
    <line x1="0" y1="128" x2="400" y2="128" stroke-width="2.6"/>
    <line x1="0" y1="160" x2="400" y2="160" stroke-width="3.2"/>
    <line x1="0" y1="293" x2="400" y2="293" stroke-width="4.5"/>
  </g>
  <ellipse cx="200" cy="237" rx="5" ry="2.4" fill="#F4EFE6"/>
  <!-- צל השער ורשת -->
  <ellipse cx="200" cy="130" rx="102" ry="5" fill="#000" opacity=".28"/>
  <polygon points="124,78 276,78 276,121 124,121" fill="#000" opacity=".28"/>
  <polygon points="124,78 276,78 276,121 124,121" fill="url(#fbNet)"/>
  <polygon points="110,70 124,78 124,121 110,128" fill="#000" opacity=".18"/>
  <polygon points="110,70 124,78 124,121 110,128" fill="url(#fbNet)"/>
  <polygon points="290,70 276,78 276,121 290,128" fill="#000" opacity=".18"/>
  <polygon points="290,70 276,78 276,121 290,128" fill="url(#fbNet)"/>
  <polygon points="110,70 290,70 276,78 124,78" fill="#fff" opacity=".12"/>
  <polygon points="110,70 290,70 276,78 124,78" fill="url(#fbNet)"/>
  <g stroke="#F4EFE6" stroke-opacity=".55" stroke-width="1.2" fill="none">
    <line x1="110" y1="70" x2="124" y2="78"/><line x1="290" y1="70" x2="276" y2="78"/>
    <line x1="124" y1="78" x2="124" y2="121"/><line x1="276" y1="78" x2="276" y2="121"/>
    <line x1="124" y1="121" x2="276" y2="121"/>
  </g>
  <!-- קורות -->
  <g stroke-linecap="square" fill="none">
    <line x1="110" y1="130" x2="110" y2="68" stroke="#111" stroke-width="7.5"/>
    <line x1="290" y1="130" x2="290" y2="68" stroke="#111" stroke-width="7.5"/>
    <line x1="107" y1="70" x2="293" y2="70" stroke="#111" stroke-width="7.5"/>
    <line x1="110" y1="130" x2="110" y2="68" stroke="#F4EFE6" stroke-width="5"/>
    <line x1="290" y1="130" x2="290" y2="68" stroke="#F4EFE6" stroke-width="5"/>
    <line x1="107" y1="70" x2="293" y2="70" stroke="#F4EFE6" stroke-width="5"/>
    <line x1="111.5" y1="130" x2="111.5" y2="68" stroke="#bdb6a6" stroke-width="1.4"/>
    <line x1="291.5" y1="130" x2="291.5" y2="68" stroke="#bdb6a6" stroke-width="1.4"/>
    <line x1="107" y1="71.8" x2="293" y2="71.8" stroke="#bdb6a6" stroke-width="1.4"/>
  </g>`;
}

// שכבת אווירה מעל הכול: קרני זרקורים וויניטה
export function footballOverlay() {
  const beam = (x0: number) =>
    `<polygon points="${x0 - 8},14 ${x0 + 8},14 ${x0 < 200 ? 330 : 70},300 ${x0 < 200 ? 120 : -120},300" fill="#fff" opacity=".035"/>`;
  return `
  <defs><radialGradient id="fbVig" cx=".5" cy=".55" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient></defs>
  ${beam(46)}${beam(354)}
  <rect width="400" height="300" fill="url(#fbVig)"/>`;
}

// בועט מאחור (viewBox 100x160, כפות רגליים ב-y≈154)
export type StrikerPose = "idle" | "runA" | "runB" | "kick";

export function striker(pose: StrikerPose) {
  const sock = (x1: number, y1: number, x2: number, y2: number) =>
    `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="#FF4A1C" stroke-width="10.5" stroke-linecap="round"/>` +
    `<path d="M${f(x1 + (x2 - x1) * 0.42)} ${f(y1 + (y2 - y1) * 0.42)} L${f(x1 + (x2 - x1) * 0.52)} ${f(y1 + (y2 - y1) * 0.52)}" stroke="#111" stroke-width="10.7"/>`;
  const thigh = (x1: number, y1: number, x2: number, y2: number) =>
    `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${skin}" stroke-width="11" stroke-linecap="round"/>`;
  const boot = (cx: number, cy: number, rot = 0) =>
    `<g transform="rotate(${rot} ${cx} ${cy})"><ellipse cx="${cx}" cy="${cy}" rx="10" ry="5" fill="#111"/><rect x="${cx - 9}" y="${cy + 3}" width="18" height="2" rx="1" fill="#F4EFE6"/></g>`;

  let legs = "";
  if (pose === "idle") {
    legs =
      thigh(40, 100, 39, 124) + sock(39, 122, 38, 146) + boot(38, 150) +
      thigh(60, 100, 61, 124) + sock(61, 122, 62, 146) + boot(62, 150);
  } else if (pose === "runA") {
    legs =
      thigh(40, 100, 38, 124) + sock(38, 122, 36, 146) + boot(36, 150) +
      thigh(60, 100, 66, 118) + sock(66, 118, 58, 136) + boot(57, 140, -20);
  } else if (pose === "runB") {
    legs =
      thigh(60, 100, 62, 124) + sock(62, 122, 64, 146) + boot(64, 150) +
      thigh(40, 100, 34, 118) + sock(34, 118, 42, 136) + boot(43, 140, 20);
  } else {
    legs =
      thigh(40, 100, 38, 124) + sock(38, 122, 36, 146) + boot(36, 150) +
      thigh(60, 100, 78, 108) + sock(78, 108, 92, 96) + boot(95, 93, -40);
  }

  const armL = pose === "kick" ? "M31 42 L14 56" : pose === "idle" ? "M31 42 L23 70" : "M31 42 L24 64 L30 80";
  const armR = pose === "kick" ? "M69 42 L90 36" : pose === "idle" ? "M69 42 L77 70" : "M69 42 L78 62 L72 80";
  const handL = pose === "kick" ? [13, 57] : pose === "idle" ? [22, 72] : [31, 81];
  const handR = pose === "kick" ? [91, 36] : pose === "idle" ? [78, 72] : [71, 81];

  return `
  <ellipse cx="50" cy="155" rx="${pose === "kick" ? 42 : 30}" ry="5" fill="#000" opacity=".3"/>
  <g stroke-linecap="round" stroke-linejoin="round" fill="none">${legs}</g>
  <path d="M31 90 Q50 96 69 90 L70 114 Q60 118 51 112 L49 112 Q40 118 30 114 Z" fill="#111"/>
  <path d="M50 94 V112" stroke="#2e2e33" stroke-width="1.5"/>
  <g stroke="${skin}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="${armL}"/><path d="${armR}"/></g>
  <circle cx="${handL[0]}" cy="${handL[1]}" r="4.6" fill="${skin}"/><circle cx="${handR[0]}" cy="${handR[1]}" r="4.6" fill="${skin}"/>
  <path d="M29 40 Q50 31 71 40 L69 94 Q50 99 31 94 Z" fill="#FF4A1C"/>
  <path d="M29 40 Q50 31 71 40 L72 50 L66 52 L66 40 Q50 34 34 40 L34 52 L28 50 Z" fill="#cf3a14"/>
  <path d="M29 40 L24 52 L33 56 L34 42 Z" fill="#FF4A1C"/><path d="M71 40 L76 52 L67 56 L66 42 Z" fill="#FF4A1C"/>
  <path d="M33 94 Q50 99 67 94" stroke="#111" stroke-width="3" fill="none"/>
  <path d="M42 36 Q50 41 58 36" stroke="#111" stroke-width="4" fill="none" stroke-linecap="round"/>
  <text x="50" y="52" text-anchor="middle" font-size="9" font-weight="800" fill="#F4EFE6" font-family="Heebo, Arial, sans-serif">פטל</text>
  <text x="50" y="82" text-anchor="middle" font-size="31" font-weight="900" fill="#F4EFE6" font-family="'Frank Ruhl Libre', Georgia, serif">9</text>
  <ellipse cx="38.5" cy="22" rx="2.6" ry="4.5" fill="${skinShade}"/><ellipse cx="61.5" cy="22" rx="2.6" ry="4.5" fill="${skinShade}"/>
  <circle cx="50" cy="21" r="12.5" fill="#17120f"/>
  <path d="M39 27 Q50 36 61 27 L60.5 31 Q50 38 39.5 31 Z" fill="${skin}"/>
  <path d="M44 8.5 Q50 6 56 8.5" stroke="#3a2f28" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
}

// שוער מלפנים (viewBox 60x80, כפות ב-y≈78)
export function keeper() {
  return `
  <ellipse cx="30" cy="78" rx="19" ry="3" fill="#000" opacity=".3"/>
  <g stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="M24 50 L21 70" stroke="${skin}" stroke-width="7"/><path d="M36 50 L39 70" stroke="${skin}" stroke-width="7"/>
    <path d="M22.5 60 L21 73" stroke="#111" stroke-width="7.5"/><path d="M37.5 60 L39 73" stroke="#111" stroke-width="7.5"/>
    <path d="M17 29 L7 20 L9 9" stroke="#9EC5AE" stroke-width="8"/><path d="M43 29 L53 20 L51 9" stroke="#9EC5AE" stroke-width="8"/>
  </g>
  <ellipse cx="20" cy="76.5" rx="6.5" ry="3" fill="#111"/><ellipse cx="40" cy="76.5" rx="6.5" ry="3" fill="#111"/>
  <path d="M18 46 H42 L43 58 Q30 62 17 58 Z" fill="#111"/>
  <path d="M17 24 Q30 19 43 24 L44 47 Q30 52 16 47 Z" fill="#9EC5AE"/>
  <path d="M17 36 Q30 41 43 36 L43.5 40 Q30 45 16.5 40 Z" fill="#111" opacity=".85"/>
  <circle cx="9" cy="7" r="5.4" fill="#FF4A1C" stroke="#111" stroke-width="1.4"/><circle cx="51" cy="7" r="5.4" fill="#FF4A1C" stroke="#111" stroke-width="1.4"/>
  <path d="M6 5 H12 M48 5 H54" stroke="#F4EFE6" stroke-width="1.2" stroke-linecap="round"/>
  <circle cx="30" cy="14" r="8.5" fill="${skin}"/>
  <path d="M21.6 14 Q21 4.5 30 5 Q39 4.5 38.4 14 Q36 9 30 9.4 Q24 9 21.6 14 Z" fill="#17120f"/>
  <circle cx="26.8" cy="15" r="1" fill="#111"/><circle cx="33.2" cy="15" r="1" fill="#111"/>
  <path d="M27.5 19 Q30 20.4 32.5 19" stroke="#111" stroke-width=".9" fill="none" stroke-linecap="round"/>`;
}

export function soccerBall() {
  return `
  <defs><radialGradient id="sbG" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#d8d1c2"/></radialGradient></defs>
  <circle cx="20" cy="20" r="18" fill="url(#sbG)" stroke="#111" stroke-width="2"/>
  <polygon points="20,12.5 27,17.6 24.3,25.8 15.7,25.8 13,17.6" fill="#111"/>
  <g stroke="#111" stroke-width="1.6" stroke-linecap="round" fill="none">
    <path d="M20 12.5 V4.5"/><path d="M27 17.6 L34.5 15"/><path d="M24.3 25.8 L29 33"/><path d="M15.7 25.8 L11 33"/><path d="M13 17.6 L5.5 15"/>
  </g>
  <g fill="#111"><polygon points="20,2 24,4.5 20,6.5 16,4.5" opacity=".9"/><polygon points="35,14 37.6,18 34,19.6 32.5,15.6"/><polygon points="5,14 7.5,15.6 6,19.6 2.4,18"/></g>`;
}
