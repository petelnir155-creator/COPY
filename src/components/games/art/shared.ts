// עזרים משותפים לגרפיקה של המשחקונים. הכול מחרוזות SVG (נכנסות עם dangerouslySetInnerHTML),
// כך אפשר גם לרנדר אותן מחוץ לדפדפן ולבדוק איך הן נראות.

export const rng = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
};

export const f = (n: number) => Math.round(n * 10) / 10;

// קהל עם פרספקטיבה: שורות שמתרחבות כלפי מטה. בלי צהוב.
export function crowdRows(opts: {
  y0: number;
  y1: number;
  rows: number;
  seed: number;
  palette?: string[];
  flashes?: number;
}) {
  const r = rng(opts.seed);
  const pal = opts.palette ?? ["#3b3d46", "#4b4e59", "#5b5f6b", "#7a4a40", "#a8421f", "#8e9a93", "#c9c2b3"];
  let out = "";
  for (let row = 0; row < opts.rows; row++) {
    const t = row / (opts.rows - 1 || 1);
    const y = opts.y0 + (opts.y1 - opts.y0) * t;
    const size = 2.1 + t * 1.9;
    const step = 6.2 + t * 4.2;
    out += `<rect x="0" y="${f(y + size + 1)}" width="400" height="${f(2 + t * 2)}" fill="#0b0c0f" opacity=".55"/>`;
    for (let x = -step / 2 + (row % 2) * (step / 2); x < 410; x += step) {
      const c = pal[Math.floor(r() * pal.length)];
      const jy = (r() - 0.5) * 1.6;
      // גוף + ראש
      out += `<rect x="${f(x - size * 0.9)}" y="${f(y + jy + size * 0.7)}" width="${f(size * 1.8)}" height="${f(size * 1.5)}" rx="${f(size * 0.5)}" fill="${c}" opacity=".9"/>`;
      out += `<circle cx="${f(x)}" cy="${f(y + jy)}" r="${f(size * 0.72)}" fill="${pal[Math.floor(r() * 3)]}" opacity=".95"/>`;
    }
  }
  const fl = opts.flashes ?? 0;
  for (let i = 0; i < fl; i++) {
    const x = r() * 400;
    const y = opts.y0 + r() * (opts.y1 - opts.y0);
    const dur = f(1.4 + r() * 2.6);
    const begin = f(r() * 3);
    out += `<g opacity="0"><circle cx="${f(x)}" cy="${f(y)}" r="1.6" fill="#fff"/><circle cx="${f(x)}" cy="${f(y)}" r="4.5" fill="#fff" opacity=".25"/><animate attributeName="opacity" values="0;0;1;0;0" keyTimes="0;.6;.64;.7;1" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/></g>`;
  }
  return out;
}

// שלטי פרסום (בלי טקסט): פסים וצורות גנריות
export function adBoards(y: number, h: number, seed: number) {
  const r = rng(seed);
  const cols = ["#111111", "#FF4A1C", "#E9E2D3", "#2a2d35", "#111111", "#c9c2b3"];
  let out = "";
  const w = 44;
  for (let x = 0, i = 0; x < 400; x += w, i++) {
    const c = cols[i % cols.length];
    const light = c === "#E9E2D3" || c === "#c9c2b3" || c === "#FF4A1C";
    const ink = light ? "#111" : "#F4EFE6";
    out += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
    out += `<rect x="${x}" y="${y}" width="${w}" height="1.5" fill="#000" opacity=".25"/>`;
    const kind = Math.floor(r() * 3);
    if (kind === 0) out += `<circle cx="${x + 12}" cy="${y + h / 2}" r="${h * 0.28}" fill="${ink}" opacity=".85"/><rect x="${x + 22}" y="${y + h / 2 - 2}" width="18" height="4" fill="${ink}" opacity=".85"/>`;
    if (kind === 1) out += `<rect x="${x + 6}" y="${y + 4}" width="32" height="3" fill="${ink}" opacity=".85"/><rect x="${x + 6}" y="${y + h - 7}" width="20" height="3" fill="${ink}" opacity=".6"/>`;
    if (kind === 2) out += `<polygon points="${x + 8},${y + h - 4} ${x + 20},${y + 4} ${x + 32},${y + h - 4}" fill="${ink}" opacity=".8"/>`;
  }
  return out;
}

export const skin = "#E6C3A3";
export const skinShade = "#C9A084";

// ---------- כלים לציור "נפחי" ----------
export type P = [number, number];

// צינור מתחדד לאורך פוליליין (לגפיים): מחזיר path עם עיגולים במפרקים, כך שהצורה נראית מלאה ורכה
export function tube(pts: P[], ws: number[], fill: string, extra = ""): string {
  const n = pts.length;
  const L: P[] = [];
  const R: P[] = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0];
    let dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;
    const w = ws[i] / 2;
    L.push([pts[i][0] - dy * w, pts[i][1] + dx * w]);
    R.push([pts[i][0] + dy * w, pts[i][1] - dx * w]);
  }
  const poly = [...L, ...R.reverse()].map((p) => `${f(p[0])},${f(p[1])}`).join(" ");
  const caps = pts.map((p, i) => `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${f(ws[i] / 2)}"/>`).join("");
  return `<g fill="${fill}" ${extra}><polygon points="${poly}"/>${caps}</g>`;
}

// גפה עם תאורה: צבע בסיס, פס צל בצד ימין ופס אור בצד שמאל (מקור האור משמאל-למעלה)
export function limb(pts: P[], ws: number[], base: string, dark = "#000", light = "#fff", dx = 0.22): string {
  const off = (k: number): P[] => pts.map((p) => [p[0] + ws[0] * k, p[1]]);
  return (
    tube(pts, ws, base) +
    tube(off(dx), ws.map((w) => w * 0.5), dark, 'opacity=".26"') +
    tube(off(-dx), ws.map((w) => w * 0.2), light, 'opacity=".28"')
  );
}

// הגדרות משותפות: גרגר פילם, טשטוש לעומק שדה, טקסטורת דשא
export function fxDefs(p: string) {
  return `
  <filter id="${p}Blur1" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="1.1"/></filter>
  <filter id="${p}Blur2" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="2.4"/></filter>
  <filter id="${p}Soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3.5"/></filter>
  <filter id="${p}Grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="7" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  1.6 0 0 0 -.55"/></filter>
  <filter id="${p}Turf" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".03 .9" numOctaves="3" seed="4" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 .08  0 0 0 0 0  1.8 0 0 0 -.62"/></filter>`;
}
