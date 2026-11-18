import { adBoards, crowdRows, f, fxDefs, limb, skin, skinShade } from "./shared";
import type { P } from "./shared";

// במה 400x300, מבט מהצד. השחקן משמאל, הסל מימין.
// הגיאומטריה של החישוק (x=290..356, y=112..176) חייבת להתאים ל-RIM ב-Basketball.tsx.

export function basketCrowd() {
  return `<g filter="url(#bkBlur2)">${crowdRows({ y0: 40, y1: 120, rows: 6, seed: 27, flashes: 12 })}</g>` +
    `<g filter="url(#bkBlur1)">${crowdRows({ y0: 124, y1: 200, rows: 5, seed: 28, flashes: 20 })}</g>`;
}

export function basketScene() {
  // פרקט: לוחות מתכנסים + סיבי עץ
  let planks = "";
  for (let i = -6; i < 16; i++) {
    const xb = i * 40;
    const xt = 200 + (xb - 200) * 0.62;
    planks += `<line x1="${f(xt)}" y1="232" x2="${xb}" y2="300" stroke="#000" stroke-opacity=".16" stroke-width="1.2"/>`;
    if (i % 2) planks += `<polygon points="${f(xt)},232 ${f(200 + (xb + 40 - 200) * 0.62)},232 ${xb + 40},300 ${xb},300" fill="#000" opacity=".045"/>`;
  }
  let rows = "";
  for (let y = 238; y < 300; y += 9 + (y - 238) / 10) rows += `<line x1="0" y1="${f(y)}" x2="400" y2="${f(y)}" stroke="#5a3a1c" stroke-opacity=".12" stroke-width=".8"/>`;
  return `
  <defs>
    <linearGradient id="bkFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d4a877"/><stop offset=".5" stop-color="#b98859"/><stop offset="1" stop-color="#8f6339"/></linearGradient>
    <radialGradient id="bkPool" cx=".62" cy=".1" r=".8"><stop offset="0" stop-color="#fff2d6" stop-opacity=".5"/><stop offset=".6" stop-color="#fff2d6" stop-opacity=".08"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></radialGradient>
    <linearGradient id="bkRefl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".3"/><stop offset=".4" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <linearGradient id="bkGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4fafb"/><stop offset=".5" stop-color="#c9dade"/><stop offset="1" stop-color="#8ea6ad"/></linearGradient>
    <linearGradient id="bkPole" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a4e5a"/><stop offset=".35" stop-color="#2d3039"/><stop offset="1" stop-color="#0f1115"/></linearGradient>
    <linearGradient id="bkPad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff7a4d"/><stop offset=".6" stop-color="#FF4A1C"/><stop offset="1" stop-color="#a82d0b"/></linearGradient>
    <linearGradient id="bkLed" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FF4A1C"/><stop offset="1" stop-color="#ff2a5c"/></linearGradient>
    ${fxDefs("bk")}
  </defs>
  <rect x="0" y="206" width="400" height="28" fill="#07080b"/>
  ${adBoards(210, 18, 9)}
  <rect x="0" y="210" width="400" height="18" fill="url(#bkLed)" opacity=".14"/>
  <rect x="0" y="228" width="400" height="5" fill="#000" opacity=".6"/>
  <rect x="0" y="232" width="400" height="68" fill="url(#bkFloor)"/>
  ${planks}${rows}
  <rect x="0" y="232" width="400" height="68" filter="url(#bkTurf)" opacity=".1"/>
  <rect x="0" y="232" width="400" height="68" fill="url(#bkPool)"/>
  <rect x="0" y="232" width="400" height="68" fill="url(#bkRefl)"/>
  <!-- צבע, קו עונשין וקשת -->
  <polygon points="372,240 244,240 222,300 400,300 400,240" fill="#FF4A1C" opacity=".6"/>
  <polygon points="372,240 244,240 222,300 400,300 400,240" fill="url(#bkRefl)"/>
  <g stroke="#F4EFE6" stroke-opacity=".95" fill="none" stroke-width="3">
    <line x1="244" y1="240" x2="222" y2="300"/>
    <path d="M110 240 Q150 246 168 300" stroke-dasharray="6 5"/>
    <path d="M30 240 Q44 262 40 300" stroke-opacity=".7"/>
  </g>
  <line x1="0" y1="232" x2="400" y2="232" stroke="#111" stroke-width="3"/>
  <!-- השתקפות הסל על הפרקט -->
  <ellipse cx="320" cy="270" rx="46" ry="10" fill="#fff" opacity=".1" filter="url(#bkBlur2)"/>
  <!-- עמוד, בסיס מרופד, זרוע -->
  <ellipse cx="358" cy="243" rx="30" ry="5" fill="#000" opacity=".45" filter="url(#bkBlur1)"/>
  <rect x="351" y="130" width="9" height="108" fill="url(#bkPole)"/>
  <rect x="352.5" y="130" width="1.6" height="108" fill="#fff" opacity=".28"/>
  <rect x="340" y="206" width="30" height="34" rx="3" fill="url(#bkPad)" stroke="#111" stroke-width="2.5"/>
  <path d="M342 210 H368 M342 224 H368" stroke="#000" stroke-opacity=".2" stroke-width="1.2"/>
  <rect x="344" y="212" width="22" height="4" fill="#111" opacity=".25"/>
  <path d="M356 128 L346 112" stroke="#2a2d35" stroke-width="6" stroke-linecap="round"/>
  <path d="M356 128 L346 112" stroke="#6a6f7c" stroke-opacity=".5" stroke-width="1.4" stroke-linecap="round"/>
  <!-- לוח זכוכית -->
  <rect x="345" y="34" width="16" height="102" rx="2" fill="#000" opacity=".35" filter="url(#bkBlur1)"/>
  <rect x="347" y="36" width="12" height="98" rx="1.5" fill="url(#bkGlass)" stroke="#111" stroke-width="2.5"/>
  <rect x="349.2" y="40" width="2.6" height="90" fill="#fff" opacity=".7"/>
  <polygon points="347,36 359,36 359,64 347,92" fill="#fff" opacity=".18"/>
  <rect x="347" y="94" width="12" height="32" fill="none" stroke="#FF4A1C" stroke-width="2.2"/>
  <rect x="345" y="32" width="16" height="7" rx="1.5" fill="#111"/>
  <circle cx="349" cy="35.5" r="1.3" fill="#FF4A1C"/><circle cx="353" cy="35.5" r="1.3" fill="#FF4A1C"/><circle cx="357" cy="35.5" r="1.3" fill="#FF4A1C"/>`;
}

export function basketSky() {
  return `
  <defs>
    <linearGradient id="bkSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#030407"/><stop offset="1" stop-color="#1a1c23"/></linearGradient>
    <radialGradient id="bkGlow"><stop offset="0" stop-color="#fff" stop-opacity=".62"/><stop offset=".3" stop-color="#cfe0ff" stop-opacity=".2"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <filter id="bkBlur1" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="1.1"/></filter>
    <filter id="bkBlur2" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="2.3"/></filter>
  </defs>
  <rect width="400" height="232" fill="url(#bkSky)"/>`;
}

export function basketTop() {
  const rig = (cx: number) =>
    `<circle cx="${cx}" cy="10" r="110" fill="url(#bkGlow)"/><rect x="${cx - 22}" y="3" width="44" height="10" rx="2" fill="#15161b" stroke="#2a2d36" stroke-width=".7"/>` +
    Array.from({ length: 6 }, (_, k) => `<circle cx="${cx - 15 + (k % 3) * 15}" cy="${6.5 + Math.floor(k / 3) * 4.5}" r="1.9" fill="#fff"/>`).join("") +
    `<rect x="${cx - 60}" y="8.6" width="120" height="1.4" fill="#fff" opacity=".5"/>`;
  const banner = (x: number, c: string) =>
    `<polygon points="${x},0 ${x + 26},0 ${x + 26},30 ${x + 13},38 ${x},30" fill="${c}"/><polygon points="${x + 4},0 ${x + 22},0 ${x + 22},26 ${x + 13},32 ${x + 4},26" fill="#000" opacity=".16"/><polygon points="${x},0 ${x + 8},0 ${x + 8},33 ${x},30" fill="#fff" opacity=".1"/><circle cx="${x + 13}" cy="14" r="5" fill="#F4EFE6" opacity=".85"/>`;
  // וידאו-קיובי מרכזי
  const cube = `<rect x="158" y="14" width="84" height="26" rx="3" fill="#0b0c10" stroke="#2a2d36" stroke-width="1"/><rect x="161" y="17" width="78" height="20" rx="2" fill="#10131a"/><text x="200" y="31.4" text-anchor="middle" font-size="11" font-weight="900" fill="#FF4A1C" font-family="Heebo, Arial, sans-serif">PETEL</text><line x1="170" y1="0" x2="170" y2="14" stroke="#333"/><line x1="230" y1="0" x2="230" y2="14" stroke="#333"/>`;
  return `${rig(60)}${rig(340)}${banner(112, "#FF4A1C")}${banner(274, "#2a2d36")}${cube}${rig(200)}`;
}

export function basketOverlay() {
  return `
  <defs>
    <radialGradient id="bkVig" cx=".55" cy=".5" r=".78"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></radialGradient>
    <linearGradient id="bkGrade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e3a66" stop-opacity=".3"/><stop offset=".6" stop-color="#1e3a66" stop-opacity="0"/><stop offset="1" stop-color="#ff8a3c" stop-opacity=".16"/></linearGradient>
    <linearGradient id="bkHaze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6efff" stop-opacity="0"/><stop offset=".5" stop-color="#e6efff" stop-opacity=".1"/><stop offset="1" stop-color="#e6efff" stop-opacity="0"/></linearGradient>
    <linearGradient id="bkBeam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <filter id="bkGrain2" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="9" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  1.6 0 0 0 -.62"/></filter>
  </defs>
  <polygon points="52,12 68,12 250,300 90,300" fill="url(#bkBeam)" style="mix-blend-mode:screen"/>
  <polygon points="332,12 348,12 400,300 190,300" fill="url(#bkBeam)" style="mix-blend-mode:screen"/>
  <rect y="190" width="400" height="40" fill="url(#bkHaze)"/>
  <rect width="400" height="300" fill="url(#bkGrade)" style="mix-blend-mode:soft-light"/>
  <rect width="400" height="300" fill="url(#bkVig)"/>
  <rect width="400" height="300" filter="url(#bkGrain2)" opacity=".2" style="mix-blend-mode:overlay"/>`;
}

// חישוק + רשת (viewBox 66x64). הצמדה ללוח בצד ימין.
export function hoop() {
  const netV = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    .map((i) => {
      const t = i / 8;
      return `<path d="M${f(8 + 50 * t)} 11 Q${f(14 + 36 * t)} 36 ${f(20 + 26 * t)} 58" />`;
    })
    .join("");
  const netX = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    .map((i) => {
      const t = i / 8;
      return `<path d="M${f(8 + 50 * t)} 11 Q${f(14 + 36 * (1 - t))} 36 ${f(20 + 26 * (1 - t))} 58" />`;
    })
    .join("");
  return `
  <defs>
    <linearGradient id="bkRim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9a7c"/><stop offset=".35" stop-color="#FF4A1C"/><stop offset="1" stop-color="#7a1f06"/></linearGradient>
  </defs>
  <g fill="none" stroke="#000" stroke-opacity=".28" stroke-width="2.4" stroke-linecap="round" transform="translate(1.4 1.6)">${netV}</g>
  <g fill="none" stroke="#F4EFE6" stroke-opacity=".92" stroke-width="1.05" stroke-linecap="round">${netV}</g>
  <g fill="none" stroke="#F4EFE6" stroke-opacity=".5" stroke-width=".8" stroke-linecap="round">${netX}
    <path d="M9 22 Q33 28 57 22"/><path d="M12 34 Q33 41 54 34"/><path d="M16 46 Q33 52 50 46"/>
  </g>
  <path d="M20 58 Q33 62 46 58" stroke="#F4EFE6" stroke-width="1.9" fill="none" stroke-linecap="round"/>
  <rect x="58" y="2.4" width="8" height="12.6" rx="1.4" fill="#2a2d35" stroke="#0f1115" stroke-width=".8"/>
  <rect x="59.4" y="3.6" width="1.4" height="10" fill="#fff" opacity=".25"/>
  <line x1="5" y1="9.4" x2="62" y2="9.4" stroke="#000" stroke-opacity=".35" stroke-width="7.4" stroke-linecap="round" filter="url(#bkBlur1)"/>
  <line x1="5" y1="8" x2="62" y2="8" stroke="url(#bkRim)" stroke-width="6.6" stroke-linecap="round"/>
  <line x1="8" y1="6" x2="57" y2="6" stroke="#ffd2c0" stroke-opacity=".9" stroke-width="1.2" stroke-linecap="round"/>
  <circle cx="5" cy="8" r="3.4" fill="#FF4A1C" stroke="#7a1f06" stroke-width="1.2"/>`;
}

export function basketBall() {
  return `
  <defs>
    <radialGradient id="bbG" cx=".34" cy=".28" r=".9"><stop offset="0" stop-color="#ffa07c"/><stop offset=".45" stop-color="#f2501e"/><stop offset="1" stop-color="#8c2208"/></radialGradient>
    <radialGradient id="bbSh" cx=".38" cy=".3" r=".8"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
    <clipPath id="bbClip"><circle cx="20" cy="20" r="18"/></clipPath>
  </defs>
  <circle cx="20" cy="20" r="18" fill="url(#bbG)"/>
  <g clip-path="url(#bbClip)" fill="#ffffff" opacity=".05"><circle cx="9" cy="9" r=".8"/><circle cx="15" cy="14" r=".8"/><circle cx="24" cy="8" r=".8"/><circle cx="30" cy="16" r=".8"/><circle cx="26" cy="27" r=".8"/><circle cx="12" cy="28" r=".8"/><circle cx="19" cy="33" r=".8"/></g>
  <g stroke="#1a0c06" stroke-width="1.5" fill="none" stroke-linecap="round" clip-path="url(#bbClip)">
    <path d="M20 1 V39"/><path d="M1 20 H39"/><path d="M6.5 5.5 Q21 20 6.5 34.5"/><path d="M33.5 5.5 Q19 20 33.5 34.5"/>
  </g>
  <circle cx="20" cy="20" r="18" fill="url(#bbSh)"/>
  <ellipse cx="13.6" cy="10.4" rx="5.4" ry="3" fill="#fff" opacity=".5" transform="rotate(-32 13.6 10.4)"/>
  <circle cx="20" cy="20" r="18" fill="none" stroke="#1a0c06" stroke-width="1.6"/>`;
}

// שחקן מלפנים (viewBox 100x160). הידיים מחזיקות את הכדור ב-(82,58).
export function hooper(throwing: boolean) {
  const armPts = (side: "l" | "r"): P[] => {
    if (throwing) return side === "l" ? [[33, 43], [38, 26], [44, 9]] : [[67, 43], [76, 24], [84, 5]];
    return side === "l" ? [[33, 45], [55, 63], [79, 60]] : [[67, 45], [76, 67], [85, 60]];
  };
  const arm = (side: "l" | "r") => {
    const pts = armPts(side);
    const h = pts[2];
    const band = throwing
      ? `<circle cx="${h[0]}" cy="${h[1] + 8}" r="4.6" fill="#F4EFE6"/>`
      : side === "r" ? `<circle cx="${f(pts[1][0] + 3)}" cy="${f(pts[1][1] - 1)}" r="4.4" fill="#F4EFE6"/>` : "";
    return limb(pts, [9, 7.4, 6.2], skin, skinShade, "#fff") + band + `<circle cx="${h[0]}" cy="${h[1]}" r="4.8" fill="${skin}"/><circle cx="${f(h[0] - 1.2)}" cy="${f(h[1] - 1.2)}" r="1.6" fill="#fff" opacity=".3"/>`;
  };
  const leg = (hx: number, kx: number, ax: number) =>
    limb([[hx, 112], [kx, 130], [ax, 146]], [11.4, 9.4, 7.6], skin, skinShade, "#fff") +
    limb([[ax - 0.4, 134], [ax, 147]], [9.4, 8.4], "#F4EFE6", "#8a8578", "#fff") +
    `<rect x="${ax - 4.8}" y="136" width="9.6" height="2.4" fill="#FF4A1C" opacity=".95"/>`;
  const shoe = (cx: number) => `
    <path d="M${cx - 8} 153 Q${cx - 8} 144 ${cx - 1} 144 H${cx + 4} Q${cx + 10} 146 ${cx + 10} 153 Z" fill="url(#bkShoe)" stroke="#111" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M${cx - 8} 150.4 H${cx + 10}" stroke="#FF4A1C" stroke-width="2.4"/>
    <path d="M${cx - 4} 147 L${cx + 4} 147.4" stroke="#bbb" stroke-width="1"/>
    <path d="M${cx - 8} 153.6 H${cx + 10}" stroke="#111" stroke-width="2.4" stroke-linecap="round"/>`;
  return `
  <defs>
    <linearGradient id="bkShoe" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#b9b3a4"/></linearGradient>
    <linearGradient id="bkJer" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2d2f38"/><stop offset=".5" stop-color="#14151a"/><stop offset="1" stop-color="#050506"/></linearGradient>
    <filter id="bkShadowBlur" x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="2.4"/></filter>
  </defs>
  <ellipse cx="50" cy="156" rx="36" ry="5.4" fill="#000" opacity=".5" filter="url(#bkShadowBlur)"/>
  ${leg(42, 41, 40)}${leg(58, 59, 60)}${shoe(40)}${shoe(60)}
  <path d="M31 90 H69 L72 122 H52 L50 106 L48 122 H28 Z" fill="url(#bkJer)"/>
  <path d="M33 98 Q36 108 33 120 M67 98 Q64 108 67 120" stroke="#fff" stroke-opacity=".08" stroke-width="1.4" fill="none"/>
  <path d="M30.5 98 L29.5 120 M69.5 98 L70.5 120" stroke="#FF4A1C" stroke-width="2.4"/>
  <path d="M28 120 H48 M52 122 H72" stroke="#000" stroke-opacity=".5" stroke-width="1.4"/>
  ${arm("l")}
  <path d="M33 38 Q40 46 50 44 Q60 46 67 38 L70 64 L68 94 H32 L30 64 Z" fill="url(#bkJer)"/>
  <path d="M33 38 L30 64 L32 94" stroke="#fff" stroke-opacity=".18" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <path d="M36 58 Q40 74 36 92 M64 58 Q60 74 64 92" stroke="#fff" stroke-opacity=".07" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <path d="M40 41 Q50 52 60 41" stroke="#F4EFE6" stroke-width="2.2" fill="none"/>
  <path d="M31 70 L30 94 M69 70 L70 94" stroke="#FF4A1C" stroke-width="2.4"/>
  <text x="50.7" y="78.8" text-anchor="middle" font-size="27" font-weight="900" fill="#000" opacity=".5" font-family="'Frank Ruhl Libre', Georgia, serif">נ</text>
  <text x="50" y="78" text-anchor="middle" font-size="27" font-weight="900" fill="#F4EFE6" font-family="'Frank Ruhl Libre', Georgia, serif">נ</text>
  ${arm("r")}
  <rect x="44.6" y="30" width="10.8" height="9" rx="3" fill="${skinShade}"/>
  <ellipse cx="37.4" cy="22" rx="2.6" ry="4.2" fill="${skinShade}"/><ellipse cx="62.6" cy="22" rx="2.6" ry="4.2" fill="#b38868"/>
  <circle cx="50" cy="21" r="12.8" fill="${skin}"/>
  <path d="M60 12 Q66 22 58 33 Q64 24 60 12 Z" fill="#000" opacity=".12"/>
  <path d="M37.5 19 Q37 6 50 6 Q63 6 62.5 19 Q58 12 50 12.5 Q42 12 37.5 19 Z" fill="#17120f"/>
  <path d="M42 8.6 Q50 6 58 8.6" stroke="#6a5a4e" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".7"/>
  <path d="M37.6 16.6 H62.4" stroke="#FF4A1C" stroke-width="4.2" stroke-linecap="round"/>
  <path d="M41.4 19.2 L47 19.6 M58.6 19.2 L53 19.6" stroke="#2a1d14" stroke-width="1.4" stroke-linecap="round"/>
  <ellipse cx="44.6" cy="22.4" rx="2.1" ry="1.5" fill="#fff"/><ellipse cx="55.4" cy="22.4" rx="2.1" ry="1.5" fill="#fff"/>
  <circle cx="44.8" cy="22.5" r="1.1" fill="#111"/><circle cx="55.2" cy="22.5" r="1.1" fill="#111"/>
  <path d="M50 23.4 L48.8 27 Q50 27.8 51.2 27" stroke="${skinShade}" stroke-width=".9" fill="none"/>
  <path d="M46 30 Q50 32.6 54 30" stroke="#6b2d22" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
}
