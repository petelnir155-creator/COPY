import { adBoards, crowdRows, f, skin, skinShade } from "./shared";

// במה 400x300, מבט מהצד. השחקן משמאל, הסל מימין.
// הגיאומטריה של החישוק (x=290..356, y=112..176) חייבת להתאים ל-RIM ב-Basketball.tsx.

export function basketCrowd() {
  return crowdRows({ y0: 40, y1: 196, rows: 10, seed: 27, flashes: 22 });
}

export function basketScene() {
  // פרקט: לוחות מתכנסים
  let planks = "";
  for (let i = -6; i < 16; i++) {
    const xb = i * 40;
    const xt = 200 + (xb - 200) * 0.62;
    planks += `<line x1="${f(xt)}" y1="232" x2="${xb}" y2="300" stroke="#000" stroke-opacity=".13" stroke-width="1.2"/>`;
  }
  return `
  <defs>
    <linearGradient id="bkFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c79b6d"/><stop offset="1" stop-color="#a97b52"/></linearGradient>
    <linearGradient id="bkRefl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <linearGradient id="bkGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e9f1f3"/><stop offset="1" stop-color="#b9c9ce"/></linearGradient>
  </defs>
  ${adBoards(212, 20, 9)}
  <rect x="0" y="232" width="400" height="68" fill="url(#bkFloor)"/>
  ${planks}
  <rect x="0" y="232" width="400" height="68" fill="url(#bkRefl)"/>
  <!-- צבע, קו עונשין וקשת -->
  <polygon points="372,240 244,240 222,300 400,300 400,240" fill="#FF4A1C" opacity=".55"/>
  <g stroke="#F4EFE6" stroke-opacity=".9" fill="none" stroke-width="3">
    <line x1="244" y1="240" x2="222" y2="300"/>
    <path d="M110 240 Q150 246 168 300" stroke-dasharray="6 5"/>
    <path d="M30 240 Q44 262 40 300" stroke-opacity=".7"/>
  </g>
  <line x1="0" y1="232" x2="400" y2="232" stroke="#111" stroke-width="3"/>
  <!-- עמוד, בסיס מרופד, זרוע -->
  <rect x="351" y="130" width="9" height="108" fill="#2a2d35"/>
  <rect x="352.5" y="130" width="2" height="108" fill="#fff" opacity=".18"/>
  <rect x="340" y="206" width="30" height="34" rx="3" fill="#FF4A1C" stroke="#111" stroke-width="2.5"/>
  <rect x="344" y="212" width="22" height="4" fill="#111" opacity=".25"/>
  <ellipse cx="356" cy="241" rx="24" ry="4.5" fill="#000" opacity=".3"/>
  <path d="M356 128 L346 112" stroke="#2a2d35" stroke-width="6" stroke-linecap="round"/>
  <!-- לוח -->
  <rect x="347" y="36" width="12" height="98" rx="1.5" fill="url(#bkGlass)" stroke="#111" stroke-width="2.5"/>
  <rect x="349.5" y="40" width="3" height="90" fill="#fff" opacity=".6"/>
  <rect x="347" y="94" width="12" height="32" fill="none" stroke="#FF4A1C" stroke-width="2.2"/>
  <rect x="345" y="32" width="16" height="7" rx="1.5" fill="#111"/>
  <circle cx="349" cy="35.5" r="1.3" fill="#FF4A1C"/><circle cx="353" cy="35.5" r="1.3" fill="#FF4A1C"/><circle cx="357" cy="35.5" r="1.3" fill="#FF4A1C"/>`;
}

export function basketSky() {
  return `
  <defs>
    <linearGradient id="bkSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#06070a"/><stop offset="1" stop-color="#1a1c23"/></linearGradient>
    <radialGradient id="bkGlow"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".4" stop-color="#cfe0ff" stop-opacity=".13"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="400" height="232" fill="url(#bkSky)"/>`;
}

export function basketTop() {
  const rig = (cx: number) =>
    `<circle cx="${cx}" cy="10" r="95" fill="url(#bkGlow)"/><rect x="${cx - 22}" y="3" width="44" height="10" rx="2" fill="#15161b"/>` +
    Array.from({ length: 6 }, (_, k) => `<circle cx="${cx - 15 + (k % 3) * 15}" cy="${6.5 + Math.floor(k / 3) * 4.5}" r="1.9" fill="#fff"/>`).join("");
  const banner = (x: number, c: string) =>
    `<polygon points="${x},0 ${x + 26},0 ${x + 26},30 ${x + 13},38 ${x},30" fill="${c}"/><polygon points="${x + 4},0 ${x + 22},0 ${x + 22},26 ${x + 13},32 ${x + 4},26" fill="#000" opacity=".16"/><circle cx="${x + 13}" cy="14" r="5" fill="#F4EFE6" opacity=".85"/>`;
  return `${rig(60)}${rig(200)}${rig(340)}${banner(120, "#FF4A1C")}${banner(274, "#2a2d35")}`;
}

export function basketOverlay() {
  return `
  <defs><radialGradient id="bkVig" cx=".5" cy=".5" r=".78"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient></defs>
  <rect width="400" height="300" fill="url(#bkVig)"/>`;
}

// חישוק + רשת (viewBox 66x64). הצמדה ללוח בצד ימין.
export function hoop() {
  const netV = [0, 1, 2, 3, 4, 5, 6]
    .map((i) => {
      const t = i / 6;
      return `<path d="M${f(8 + 50 * t)} 12 Q${f(14 + 36 * t)} 36 ${f(20 + 26 * t)} 58" />`;
    })
    .join("");
  return `
  <g fill="none" stroke="#F4EFE6" stroke-opacity=".9" stroke-width="1.2" stroke-linecap="round">${netV}
    <path d="M9 22 Q33 28 57 22"/><path d="M12 34 Q33 41 54 34"/><path d="M16 46 Q33 52 50 46"/>
    <path d="M20 58 Q33 62 46 58" stroke-width="1.8"/>
  </g>
  <rect x="60" y="3" width="6" height="12" rx="1" fill="#2a2d35"/>
  <line x1="5" y1="8" x2="62" y2="8" stroke="#8a2408" stroke-width="7" stroke-linecap="round"/>
  <line x1="5" y1="7" x2="62" y2="7" stroke="#FF4A1C" stroke-width="5" stroke-linecap="round"/>
  <line x1="8" y1="5.8" x2="56" y2="5.8" stroke="#ff9a7c" stroke-width="1.2" stroke-linecap="round"/>
  <circle cx="5" cy="8" r="3.4" fill="#FF4A1C" stroke="#8a2408" stroke-width="1.2"/>`;
}

export function basketBall() {
  return `
  <defs><radialGradient id="bbG" cx=".36" cy=".3" r=".85"><stop offset="0" stop-color="#ff8f69"/><stop offset=".55" stop-color="#FF4A1C"/><stop offset="1" stop-color="#b83210"/></radialGradient></defs>
  <circle cx="20" cy="20" r="18" fill="url(#bbG)" stroke="#111" stroke-width="2"/>
  <g stroke="#111" stroke-width="1.5" fill="none" stroke-linecap="round">
    <path d="M20 2 V38"/><path d="M2 20 H38"/><path d="M6.5 6.5 Q20 20 6.5 33.5"/><path d="M33.5 6.5 Q20 20 33.5 33.5"/>
  </g>
  <ellipse cx="14" cy="11" rx="5" ry="3" fill="#fff" opacity=".28" transform="rotate(-30 14 11)"/>`;
}

// שחקן מלפנים (viewBox 100x160). הידיים מחזיקות את הכדור ב-(82,58).
export function hooper(throwing: boolean) {
  const arms = throwing
    ? `<path d="M33 42 L44 8"/><path d="M67 42 L84 4"/>`
    : `<path d="M33 44 L56 64 L78 60"/><path d="M67 44 L76 66 L84 60"/>`;
  const hands = throwing
    ? `<circle cx="44" cy="7" r="4.6" fill="${skin}"/><circle cx="84" cy="3" r="4.6" fill="${skin}"/>`
    : `<circle cx="79" cy="60" r="4.6" fill="${skin}"/><circle cx="85" cy="60" r="4.6" fill="${skin}"/>`;
  const bands = throwing
    ? `<path d="M41 16 L43 11" stroke="#F4EFE6" stroke-width="5"/><path d="M80 12 L82 7" stroke="#F4EFE6" stroke-width="5"/>`
    : `<path d="M70 62 L74 63" stroke="#F4EFE6" stroke-width="5"/>`;
  return `
  <ellipse cx="50" cy="156" rx="34" ry="5" fill="#000" opacity=".3"/>
  <g stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="M42 112 L41 130" stroke="${skin}" stroke-width="10"/><path d="M58 112 L59 130" stroke="${skin}" stroke-width="10"/>
    <path d="M41 128 L40 148" stroke="#F4EFE6" stroke-width="10.5"/><path d="M59 128 L60 148" stroke="#F4EFE6" stroke-width="10.5"/>
    <path d="M41 133 L40.6 138" stroke="#FF4A1C" stroke-width="10.8"/><path d="M59 133 L59.4 138" stroke="#FF4A1C" stroke-width="10.8"/>
  </g>
  <path d="M36 144 Q36 152 42 152 H49 V144 Z" fill="#F4EFE6" stroke="#111" stroke-width="2.4" stroke-linejoin="round"/>
  <path d="M64 144 Q64 152 58 152 H51 V144 Z" fill="#F4EFE6" stroke="#111" stroke-width="2.4" stroke-linejoin="round"/>
  <path d="M36 149 H49 M51 149 H64" stroke="#FF4A1C" stroke-width="2.4"/>
  <path d="M31 90 H69 L72 122 H52 L50 106 L48 122 H28 Z" fill="#111"/>
  <path d="M30.5 98 L29.5 120 M69.5 98 L70.5 120" stroke="#FF4A1C" stroke-width="2.4"/>
  <g stroke="${skin}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none">${arms}</g>
  ${hands}${bands}
  <path d="M33 38 Q40 46 50 44 Q60 46 67 38 L70 64 L68 94 H32 L30 64 Z" fill="#111"/>
  <path d="M40 41 Q50 52 60 41" stroke="#F4EFE6" stroke-width="2.2" fill="none"/>
  <path d="M31 70 L30 94 M69 70 L70 94" stroke="#FF4A1C" stroke-width="2.4"/>
  <text x="50" y="78" text-anchor="middle" font-size="27" font-weight="900" fill="#F4EFE6" font-family="'Frank Ruhl Libre', Georgia, serif">נ</text>
  <ellipse cx="37.4" cy="22" rx="2.6" ry="4.2" fill="${skinShade}"/><ellipse cx="62.6" cy="22" rx="2.6" ry="4.2" fill="${skinShade}"/>
  <circle cx="50" cy="21" r="12.8" fill="${skin}"/>
  <path d="M37.5 19 Q37 6 50 6 Q63 6 62.5 19 Q58 12 50 12.5 Q42 12 37.5 19 Z" fill="#17120f"/>
  <path d="M37.6 16.6 H62.4" stroke="#FF4A1C" stroke-width="4.2" stroke-linecap="round"/>
  <circle cx="45" cy="22" r="1.2" fill="#111"/><circle cx="55" cy="22" r="1.2" fill="#111"/>
  <path d="M46 28 Q50 31 54 28" stroke="#111" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
}
