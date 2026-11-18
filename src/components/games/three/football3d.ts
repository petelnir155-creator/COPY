// @ts-nocheck
// כדורגל בתלת-ממד (three.js). הכול נבנה בקוד: בלי קבצי מודלים ובלי תמונות.
// הקובץ הזה נטען רק בעמוד המשחקים (ראו FootballGame.tsx), ואם משהו נכשל המשחק חוזר לגרסת ה-SVG.
// מידות במטרים: קו השער z=0, נקודת הפנדל z=11, המצלמה מאחור ב-z≈16.8. ציר x: ימין חיובי.
import * as THREE from "three";

export type Phase = "pick" | "run" | "kick" | "done";
export type CornerId = "tl" | "tr" | "bl" | "br";

const GOAL_W = 7.32;
const GOAL_H = 2.44;
const SPOT_Z = 11;
const RUN_T = 0.95; // משך ההרצה (שניות), תואם ל-Football3D.tsx
const KL = 0.26; // רגע המגע בכדור (מתחילת הבעיטה)
const KP = 0.82; // רגע ההתפנצ'רות
const TARGETS: Record<CornerId, { x: number; y: number }> = {
  tl: { x: -2.8, y: 2.08 },
  tr: { x: 2.8, y: 2.08 },
  bl: { x: -2.8, y: 0.95 },
  br: { x: 2.8, y: 0.95 },
};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 2);
const easeIn = (t: number) => t * t;

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

function tex(c: HTMLCanvasElement, srgb = true) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

// ---------- טקסטורות ----------

function pitchTexture(mobile: boolean) {
  const S = mobile ? 1024 : 2048;
  const c = canvas(S, S);
  const g = c.getContext("2d");
  const W = 70; // רוחב במטרים (x: -35..35)
  const Z0 = -8;
  const D = 48; // עומק (z: -8..40)
  const px = (x: number) => ((x + W / 2) / W) * S;
  const pz = (z: number) => ((z - Z0) / D) * S;
  const r = rng(4);
  // פסי כיסוח: רצועות של ~5.5 מטר לאורך z
  const bands = 9;
  for (let i = 0; i < bands; i++) {
    g.fillStyle = i % 2 ? "#2f7a4e" : "#276d44";
    g.fillRect(0, (i / bands) * S, S, S / bands + 1);
  }
  // דשא: קווצות קצרות ובהירות/כהות
  for (let i = 0; i < (mobile ? 9000 : 32000); i++) {
    const x = r() * S;
    const y = r() * S;
    const l = 2 + r() * 5;
    g.strokeStyle = r() > 0.5 ? "rgba(120,190,120,.20)" : "rgba(10,40,20,.25)";
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + (r() - 0.5) * 2, y - l);
    g.stroke();
  }
  // כתמי שחיקה מול השער ובנקודת הפנדל
  const worn = (x: number, z: number, rad: number, a: number) => {
    const gr = g.createRadialGradient(px(x), pz(z), 0, px(x), pz(z), rad);
    gr.addColorStop(0, `rgba(104,84,52,${a})`);
    gr.addColorStop(1, "rgba(104,84,52,0)");
    g.fillStyle = gr;
    g.fillRect(px(x) - rad, pz(z) - rad, rad * 2, rad * 2);
  };
  worn(0, 1.2, S * 0.08, 0.4);
  worn(0, SPOT_Z, S * 0.018, 0.55);
  // קווים
  g.strokeStyle = "#f2efe4";
  g.fillStyle = "#f2efe4";
  g.lineWidth = Math.max(2, S * 0.0026);
  g.lineCap = "square";
  const line = (x1: number, z1: number, x2: number, z2: number) => {
    g.beginPath();
    g.moveTo(px(x1), pz(z1));
    g.lineTo(px(x2), pz(z2));
    g.stroke();
  };
  line(-W / 2 + 2, 0, W / 2 - 2, 0);
  line(-9.16, 0, -9.16, 5.5);
  line(9.16, 0, 9.16, 5.5);
  line(-9.16, 5.5, 9.16, 5.5);
  line(-20.16, 0, -20.16, 16.5);
  line(20.16, 0, 20.16, 16.5);
  line(-20.16, 16.5, 20.16, 16.5);
  // קשת הרחבה: חלק ממעגל ברדיוס 9.15 סביב הנקודה, מחוץ לרחבה
  const a0 = Math.acos((16.5 - SPOT_Z) / 9.15);
  g.beginPath();
  g.ellipse(px(0), pz(SPOT_Z), (9.15 / W) * S, (9.15 / D) * S, 0, Math.PI / 2 - a0, Math.PI / 2 + a0);
  g.stroke();
  g.beginPath();
  g.ellipse(px(0), pz(SPOT_Z), (0.17 / W) * S, (0.17 / D) * S, 0, 0, Math.PI * 2);
  g.fill();
  const t = tex(c);
  t.anisotropy = 16;
  return t;
}

function crowdTexture(seed: number, w = 1024, h = 512) {
  const c = canvas(w, h);
  const g = c.getContext("2d");
  const r = rng(seed);
  g.fillStyle = "#0a0c11";
  g.fillRect(0, 0, w, h);
  const palette = ["#F4EFE6", "#FF4A1C", "#8e9a93", "#2a2d35", "#c9c2b3", "#a8421f", "#e6e0d2", "#1e2128"];
  const skins = ["#d9b79a", "#b98a6a", "#8a5c42", "#e8c9ae"];
  for (let y = 10; y < h; y += 15) {
    for (let x = ((y / 15) % 2) * 6; x < w; x += 12) {
      const px = x + r() * 4;
      const body = palette[Math.floor(r() * palette.length)];
      g.fillStyle = body;
      g.globalAlpha = 0.55 + r() * 0.4;
      g.beginPath();
      g.ellipse(px, y + 6, 5.2, 6, 0, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = skins[Math.floor(r() * skins.length)];
      g.beginPath();
      g.arc(px, y - 1.5, 3.2, 0, Math.PI * 2);
      g.fill();
    }
    g.globalAlpha = 1;
    g.fillStyle = "rgba(0,0,0,.55)";
    g.fillRect(0, y + 10, w, 2.5);
  }
  g.globalAlpha = 1;
  const t = tex(c);
  t.wrapS = THREE.RepeatWrapping;
  return t;
}

function boardsTexture() {
  const c = canvas(2048, 64);
  const g = c.getContext("2d");
  const cells = [
    { bg: "#FF4A1C", fg: "#F4EFE6" },
    { bg: "#0b0c10", fg: "#FF4A1C" },
    { bg: "#F4EFE6", fg: "#111111" },
    { bg: "#1d2027", fg: "#F4EFE6" },
  ];
  for (let i = 0; i < 8; i++) {
    const cell = cells[i % cells.length];
    const x = i * 256;
    g.fillStyle = cell.bg;
    g.fillRect(x, 0, 256, 64);
    g.fillStyle = cell.fg;
    g.beginPath();
    g.arc(x + 40, 32, 14, 0, Math.PI * 2);
    g.fill();
    g.fillRect(x + 70, 20, 120, 8);
    g.fillRect(x + 70, 36, 76, 8);
    g.fillStyle = "rgba(0,0,0,.35)";
    g.fillRect(x + 253, 0, 3, 64);
  }
  const t = tex(c);
  t.wrapS = THREE.RepeatWrapping;
  t.repeat.set(3, 1);
  return t;
}

function glowTexture() {
  const c = canvas(128, 128);
  const g = c.getContext("2d");
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, "rgba(255,255,255,1)");
  gr.addColorStop(0.2, "rgba(220,232,255,.55)");
  gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, 128, 128);
  return tex(c);
}

function ballTexture() {
  const c = canvas(512, 256);
  const g = c.getContext("2d");
  g.fillStyle = "#f6f2e8";
  g.fillRect(0, 0, 512, 256);
  g.fillStyle = "#16161b";
  const spots = [
    [64, 70], [192, 70], [320, 70], [448, 70],
    [0, 128], [128, 150], [256, 128], [384, 150], [512, 128],
    [64, 200], [192, 210], [320, 200], [448, 210],
  ];
  for (const [x, y] of spots) {
    g.beginPath();
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2 - Math.PI / 2;
      const px = x + Math.cos(a) * 26;
      const py = y + Math.sin(a) * 26;
      if (k === 0) g.moveTo(px, py);
      else g.lineTo(px, py);
    }
    g.closePath();
    g.fill();
  }
  return tex(c);
}

function numberTexture() {
  const c = canvas(256, 300);
  const draw = () => {
    const g = c.getContext("2d");
    g.clearRect(0, 0, 256, 300);
    g.textAlign = "center";
    g.fillStyle = "rgba(0,0,0,.35)";
    g.font = "800 46px Heebo, Arial, sans-serif";
    g.fillText("פטל", 130, 58);
    g.font = "900 190px 'Frank Ruhl Libre', Georgia, serif";
    g.fillText("9", 132, 252);
    g.fillStyle = "#F4EFE6";
    g.font = "800 46px Heebo, Arial, sans-serif";
    g.fillText("פטל", 128, 54);
    g.font = "900 190px 'Frank Ruhl Libre', Georgia, serif";
    g.fillText("9", 128, 248);
  };
  draw();
  const t = tex(c);
  try {
    document.fonts?.load("900 100px 'Frank Ruhl Libre'").then(() => {
      draw();
      t.needsUpdate = true;
    });
  } catch {}
  return t;
}

// ---------- דמויות ----------

type Rig = ReturnType<typeof makePlayer>;

function makePlayer(o: { jersey: string; shorts: string; sock: string; hair: string; skin: string; glove?: string; number?: boolean; face?: boolean }) {
  const M = (color: string, rough = 0.75) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0 });
  const skin = M(o.skin, 0.6);
  const jersey = M(o.jersey, 0.72);
  const shorts = M(o.shorts, 0.8);
  const sock = M(o.sock, 0.8);
  const shoe = M("#0c0c0f", 0.5);
  const hair = M(o.hair, 0.9);
  const glove = M(o.glove || o.skin, 0.55);
  const mesh = (geo: any, mat: any, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  };

  const root = new THREE.Group();
  const pelvis = new THREE.Group();
  pelvis.position.y = 0.95;
  root.add(pelvis);

  const short = mesh(new THREE.CylinderGeometry(0.19, 0.215, 0.28, 18), shorts, 0, -0.03, 0);
  short.scale.z = 0.78;
  pelvis.add(short);

  const legs = [-1, 1].map((side) => {
    const hip = new THREE.Group();
    hip.position.set(side * 0.105, -0.02, 0);
    pelvis.add(hip);
    hip.add(mesh(new THREE.CapsuleGeometry(0.078, 0.31, 6, 14), skin, 0, -0.22, 0));
    const knee = new THREE.Group();
    knee.position.y = -0.45;
    hip.add(knee);
    knee.add(mesh(new THREE.CapsuleGeometry(0.06, 0.33, 6, 14), sock, 0, -0.22, 0));
    const band = mesh(new THREE.CylinderGeometry(0.064, 0.064, 0.04, 14), M("#111114", 0.8), 0, -0.2, 0);
    knee.add(band);
    const ankle = new THREE.Group();
    ankle.position.y = -0.44;
    knee.add(ankle);
    const foot = mesh(new THREE.CapsuleGeometry(0.05, 0.17, 6, 12), shoe, 0, -0.015, -0.06);
    foot.rotation.x = Math.PI / 2;
    ankle.add(foot);
    return { hip, knee, ankle };
  });

  const torso = new THREE.Group();
  torso.position.y = 0.08;
  pelvis.add(torso);
  const body = mesh(new THREE.CapsuleGeometry(0.17, 0.36, 8, 18), jersey, 0, 0.3, 0);
  body.scale.set(1.12, 1, 0.72);
  torso.add(body);
  if (o.number) {
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(0.36, 0.42),
      new THREE.MeshStandardMaterial({ map: numberTexture(), transparent: true, roughness: 0.9, polygonOffset: true, polygonOffsetFactor: -2 })
    );
    plane.position.set(0, 0.34, 0.125);
    torso.add(plane);
  }

  const arms = [-1, 1].map((side) => {
    const sh = new THREE.Group();
    sh.position.set(side * 0.225, 0.5, 0);
    torso.add(sh);
    sh.add(mesh(new THREE.CapsuleGeometry(0.05, 0.2, 6, 12), skin, 0, -0.17, 0));
    sh.add(mesh(new THREE.CapsuleGeometry(0.06, 0.1, 6, 12), jersey, 0, -0.11, 0));
    const el = new THREE.Group();
    el.position.y = -0.34;
    sh.add(el);
    el.add(mesh(new THREE.CapsuleGeometry(0.044, 0.2, 6, 12), o.glove ? jersey : skin, 0, -0.16, 0));
    el.add(mesh(new THREE.SphereGeometry(o.glove ? 0.075 : 0.055, 14, 12), glove, 0, -0.36, 0));
    return { sh, el };
  });

  const head = new THREE.Group();
  head.position.y = 0.76;
  torso.add(head);
  torso.add(mesh(new THREE.CylinderGeometry(0.052, 0.06, 0.12, 12), skin, 0, 0.64, 0));
  const face = mesh(new THREE.SphereGeometry(0.108, 20, 16), skin, 0, 0, -0.025);
  face.scale.y = 1.1;
  head.add(face);
  const hairM = mesh(new THREE.SphereGeometry(0.121, 22, 16), hair, 0, 0.012, 0.022);
  hairM.scale.set(1, 1.07, 1.02);
  head.add(hairM);
  head.add(mesh(new THREE.SphereGeometry(0.026, 8, 8), skin, -0.112, -0.005, -0.005));
  head.add(mesh(new THREE.SphereGeometry(0.026, 8, 8), skin, 0.112, -0.005, -0.005));
  if (o.face) {
    const white = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.3 });
    const dark = new THREE.MeshStandardMaterial({ color: "#14100e", roughness: 0.6 });
    for (const s of [-1, 1]) {
      head.add(mesh(new THREE.SphereGeometry(0.024, 10, 8), white, s * 0.04, 0.02, -0.118));
      head.add(mesh(new THREE.SphereGeometry(0.012, 8, 8), dark, s * 0.04, 0.02, -0.14));
      const brow = mesh(new THREE.BoxGeometry(0.05, 0.01, 0.01), dark, s * 0.04, 0.058, -0.125);
      brow.rotation.z = s * 0.18;
      head.add(brow);
    }
    head.add(mesh(new THREE.BoxGeometry(0.05, 0.01, 0.01), M("#6b2d22", 0.6), 0, -0.052, -0.12));
    head.add(mesh(new THREE.SphereGeometry(0.014, 8, 8), skin, 0, -0.005, -0.128));
  }
  return { root, pelvis, torso, head, legs, arms };
}

function resetPose(p: Rig) {
  p.root.position.y = 0;
  p.torso.rotation.set(0, 0, 0);
  p.head.rotation.set(0, 0, 0);
  p.pelvis.rotation.set(0, 0, 0);
  for (const l of p.legs) {
    l.hip.rotation.set(0, 0, 0);
    l.knee.rotation.set(0, 0, 0);
    l.ankle.rotation.set(0, 0, 0);
  }
  for (const a of p.arms) {
    a.sh.rotation.set(0, 0, 0);
    a.el.rotation.set(0, 0, 0);
  }
}

// ---------- בניית הסצנה ----------

function bar(a: any, b: any, r: number, mat: any) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 12), mat);
  m.position.copy(a).addScaledVector(dir, 0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  m.castShadow = true;
  return m;
}

function netLines(p00: any, p10: any, p01: any, p11: any, nu: number, nv: number, mat: any) {
  const pos: number[] = [];
  const at = (u: number, v: number) => {
    const a = new THREE.Vector3().lerpVectors(p00, p10, u);
    const b = new THREE.Vector3().lerpVectors(p01, p11, u);
    return a.lerp(b, v);
  };
  for (let i = 0; i <= nu; i++) {
    const a = at(i / nu, 0);
    const b = at(i / nu, 1);
    pos.push(a.x, a.y, a.z, b.x, b.y, b.z);
  }
  for (let j = 0; j <= nv; j++) {
    const a = at(0, j / nv);
    const b = at(1, j / nv);
    pos.push(a.x, a.y, a.z, b.x, b.y, b.z);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  return new THREE.LineSegments(g, mat);
}

export function createFootball3D(
  host: HTMLElement,
  cb: { onFail: (e?: unknown) => void; onReady: (corners: { id: CornerId; x: number; y: number }[]) => void }
) {
  const mobile = window.innerWidth < 700;
  const renderer = new THREE.WebGLRenderer({ antialias: !mobile, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const el = renderer.domElement;
  el.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
  host.appendChild(el);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#04060a");
  scene.fog = new THREE.FogExp2(0x070a12, 0.016);

  const camera = new THREE.PerspectiveCamera(38, 4 / 3, 0.1, 200);
  const CAM = new THREE.Vector3(0, 2.05, 18);
  const LOOK = new THREE.Vector3(0, 1.2, 2);
  camera.position.copy(CAM);
  camera.lookAt(LOOK);

  // ----- אורות -----
  scene.add(new THREE.HemisphereLight(0xbcd2ff, 0x1c3326, 0.95));
  const key = new THREE.DirectionalLight(0xfff1dc, 2.6);
  key.position.set(9, 24, 24);
  key.target.position.set(0, 0, 7);
  key.castShadow = true;
  key.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048);
  const sc = key.shadow.camera;
  sc.left = -14;
  sc.right = 14;
  sc.top = 14;
  sc.bottom = -14;
  sc.near = 1;
  sc.far = 70;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.03;
  scene.add(key, key.target);
  const rim = new THREE.DirectionalLight(0xff8a50, 1.1);
  rim.position.set(-6, 7, -14);
  rim.target.position.set(0, 1, 11);
  scene.add(rim, rim.target);
  const fillBlue = new THREE.DirectionalLight(0x6f94ff, 0.55);
  fillBlue.position.set(-18, 10, 10);
  scene.add(fillBlue);

  // ----- מגרש -----
  const pitchTex = pitchTexture(mobile);
  const pitch = new THREE.Mesh(
    new THREE.PlaneGeometry(70, 48),
    new THREE.MeshStandardMaterial({ map: pitchTex, roughness: 0.95, metalness: 0 })
  );
  pitch.rotation.x = -Math.PI / 2;
  pitch.position.set(0, 0, 16);
  pitch.receiveShadow = true;
  scene.add(pitch);

  // ----- יציע, שלטים, תאורה -----
  const standMat = new THREE.MeshBasicMaterial({ map: crowdTexture(11), color: 0xb4b6c0, fog: true });
  standMat.map.repeat.set(3, 1.4);
  const stand = new THREE.Mesh(new THREE.PlaneGeometry(90, 28), standMat);
  stand.position.set(0, 8.2, -20);
  stand.rotation.x = -0.62;
  scene.add(stand);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(90, 3.2), new THREE.MeshBasicMaterial({ color: 0x0b0d12 }));
  wall.position.set(0, 1.6, -8.5);
  scene.add(wall);
  const roof = new THREE.Mesh(new THREE.PlaneGeometry(90, 12), new THREE.MeshBasicMaterial({ color: 0x030407 }));
  roof.position.set(0, 21, -22);
  roof.rotation.x = Math.PI / 2 - 0.2;
  scene.add(roof);

  const boardTex = boardsTexture();
  const boards = new THREE.Mesh(new THREE.PlaneGeometry(80, 0.95), new THREE.MeshBasicMaterial({ map: boardTex, toneMapped: false }));
  boards.position.set(0, 0.48, -6.4);
  scene.add(boards);
  const boardsGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 1.6),
    new THREE.MeshBasicMaterial({ color: 0xff4a1c, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  boardsGlow.position.set(0, 0.9, -6.2);
  scene.add(boardsGlow);

  const glow = glowTexture();
  const flood = (x: number, y: number, z: number, s: number) => {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false }));
    sp.position.set(x, y, z);
    sp.scale.set(s, s, 1);
    scene.add(sp);
    const panel = new THREE.Mesh(new THREE.BoxGeometry(5, 1.4, 0.3), new THREE.MeshBasicMaterial({ color: 0xf4f7ff, toneMapped: false }));
    panel.position.set(x, y, z - 0.2);
    scene.add(panel);
  };
  flood(-22, 15.4, -23, 40);
  flood(22, 15.4, -23, 40);
  flood(0, 17, -25, 26);

  // הבזקי מצלמות בקהל
  const FL = 70;
  const flPos = new Float32Array(FL * 3);
  const flCol = new Float32Array(FL * 3);
  const rr = rng(33);
  for (let i = 0; i < FL; i++) {
    flPos[i * 3] = (rr() - 0.5) * 60;
    flPos[i * 3 + 1] = 3 + rr() * 10;
    flPos[i * 3 + 2] = -20 - ((flPos[i * 3 + 1] - 8.2) / 0.814) * 0.581 + 0.4;
  }
  const flGeo = new THREE.BufferGeometry();
  flGeo.setAttribute("position", new THREE.BufferAttribute(flPos, 3));
  flGeo.setAttribute("color", new THREE.BufferAttribute(flCol, 3));
  const flashes = new THREE.Points(
    flGeo,
    new THREE.PointsMaterial({ size: 1.3, map: glow, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })
  );
  scene.add(flashes);

  // ----- שער -----
  const metal = new THREE.MeshStandardMaterial({ color: 0xf4f1ea, roughness: 0.32, metalness: 0.15 });
  const back = new THREE.MeshStandardMaterial({ color: 0x9aa0aa, roughness: 0.5, metalness: 0.3 });
  const goal = new THREE.Group();
  const hw = GOAL_W / 2;
  const post = (x: number) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, GOAL_H, 14), metal);
    m.position.set(x, GOAL_H / 2, 0);
    m.castShadow = true;
    goal.add(m);
    for (const y of [0.5, 1.2, 1.9]) {
      const band = new THREE.Mesh(new THREE.CylinderGeometry(0.063, 0.063, 0.22, 14), new THREE.MeshStandardMaterial({ color: 0xd8302a, roughness: 0.5 }));
      band.position.set(x, y, 0);
      goal.add(band);
    }
  };
  post(-hw);
  post(hw);
  const cross = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, GOAL_W + 0.12, 14), metal);
  cross.rotation.z = Math.PI / 2;
  cross.position.set(0, GOAL_H, 0);
  cross.castShadow = true;
  goal.add(cross);
  const D = 2.1;
  const BH = 2.0;
  for (const s of [-1, 1]) {
    goal.add(bar(new THREE.Vector3(s * hw, GOAL_H, 0), new THREE.Vector3(s * hw, BH, -D), 0.03, back));
    goal.add(bar(new THREE.Vector3(s * hw, BH, -D), new THREE.Vector3(s * hw, 0, -D), 0.03, back));
  }
  goal.add(bar(new THREE.Vector3(-hw, BH, -D), new THREE.Vector3(hw, BH, -D), 0.03, back));
  const netMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
  const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
  goal.add(netLines(V(-hw, 0, -D), V(hw, 0, -D), V(-hw, BH, -D), V(hw, BH, -D), 62, 17, netMat));
  goal.add(netLines(V(-hw, GOAL_H, 0), V(hw, GOAL_H, 0), V(-hw, BH, -D), V(hw, BH, -D), 62, 18, netMat));
  for (const s of [-1, 1]) goal.add(netLines(V(s * hw, 0, 0), V(s * hw, 0, -D), V(s * hw, GOAL_H, 0), V(s * hw, BH, -D), 18, 20, netMat));
  // חלל כהה מאחורי הרשת: נותן לה ניגודיות
  const void_ = new THREE.Mesh(new THREE.PlaneGeometry(GOAL_W, BH), new THREE.MeshBasicMaterial({ color: 0x05070a, transparent: true, opacity: 0.45 }));
  void_.position.set(0, BH / 2, -D + 0.02);
  goal.add(void_);
  scene.add(goal);

  // ----- דמויות וכדור -----
  const striker = makePlayer({ jersey: "#FF4A1C", shorts: "#111114", sock: "#FF4A1C", hair: "#1a1411", skin: "#E6C3A3", number: true });
  scene.add(striker.root);
  const keeper = makePlayer({ jersey: "#8fbca1", shorts: "#17171c", sock: "#17171c", hair: "#17120f", skin: "#E6C3A3", glove: "#ff6a3d", face: true });
  const keeperHolder = new THREE.Group();
  keeper.root.rotation.y = Math.PI;
  keeperHolder.add(keeper.root);
  keeperHolder.position.set(0, 0, 0.35);
  scene.add(keeperHolder);

  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(0.11, 28, 20),
    new THREE.MeshStandardMaterial({ map: ballTexture(), roughness: 0.45, metalness: 0 })
  );
  ball.castShadow = true;
  ball.position.set(0, 0.11, SPOT_Z);
  scene.add(ball);

  // חלקיקים: אוויר ואבק (ספרייטים בודדים)
  const puffs = Array.from({ length: 14 }, () => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, transparent: true, opacity: 0, depthWrite: false }));
    s.scale.set(0.01, 0.01, 1);
    scene.add(s);
    return s;
  });

  // ----- מצב -----
  let phase: Phase = "pick";
  let t0 = performance.now() / 1000;
  let target = TARGETS.tl;
  let targetId: CornerId = "tl";
  let punctured = false;
  const A = V(-1.8, 0, 13.0);
  const B = V(-0.12, 0, 11.55);
  let sway0 = 0;

  const project = (x: number, y: number, z: number) => {
    const v = new THREE.Vector3(x, y, z).project(camera);
    return { x: ((v.x + 1) / 2) * 100, y: ((1 - v.y) / 2) * 100 };
  };

  const punctureAt = (id: CornerId) => {
    const t = TARGETS[id];
    return { x: t.x * 0.55, y: 0.11 + t.y * 0.55 + 0.35, z: SPOT_Z - SPOT_Z * 0.55 };
  };

  function resize() {
    const w = host.clientWidth || 640;
    const h = host.clientHeight || 480;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  camera.updateMatrixWorld(true);
  const corners = (Object.keys(TARGETS) as CornerId[]).map((id) => ({ id, ...project(TARGETS[id].x, TARGETS[id].y, 0) }));
  const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
  ro?.observe(host);
  cb.onReady(corners);

  let raf = 0;
  let alive = true;
  let lastFlash = 0;

  const onLost = (e: Event) => {
    e.preventDefault();
    cb.onFail(e);
  };
  el.addEventListener("webglcontextlost", onLost);

  function frame() {
    if (!alive) return;
    try {
      const now = performance.now() / 1000;
      const t = now - t0;
      update(now, t);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    } catch (e) {
      alive = false;
      cb.onFail(e);
    }
  }

  function update(now: number, t: number) {
    // הבזקים
    if (now - lastFlash > 0.09) {
      lastFlash = now;
      for (let i = 0; i < FL; i++) {
        const on = rr() > 0.965 ? 1 : 0;
        flCol[i * 3] = on;
        flCol[i * 3 + 1] = on;
        flCol[i * 3 + 2] = on;
      }
      flGeo.attributes.color.needsUpdate = true;
    }

    resetPose(striker);
    resetPose(keeper);
    const camPos = CAM.clone();
    const look = LOOK.clone();

    // ---- שוער ----
    const swayX = Math.sin(now * ((Math.PI * 2) / 2.4)) * 0.85;
    keeperHolder.position.x = swayX;
    keeperHolder.position.y = 0;
    keeperHolder.rotation.z = 0;
    const kb = Math.sin(now * 5) * 0.03;
    keeper.root.position.y = -Math.abs(kb) - 0.05;
    keeper.pelvis.rotation.x = 0;
    for (const l of keeper.legs) {
      l.hip.rotation.x = 0.35;
      l.knee.rotation.x = -0.5;
    }
    keeper.legs[0].hip.rotation.z = -0.22;
    keeper.legs[1].hip.rotation.z = 0.22;
    keeper.arms[0].sh.rotation.z = -2.45 + Math.sin(now * 6) * 0.06;
    keeper.arms[1].sh.rotation.z = 2.45 - Math.sin(now * 6) * 0.06;
    keeper.arms[0].el.rotation.z = -0.15;
    keeper.arms[1].el.rotation.z = 0.15;

    // ---- בועט ----
    const sp = striker.root;
    let ballPos = null as any;

    // מחזור הליכה: p במחזורים. מחזיר זוויות ירך/ברך/קרסול לרגל אחת
    const gait = (p: number, amp: number) => {
      const w = Math.PI * 2 * p;
      const c = Math.cos(w);
      const sw = Math.max(0, Math.sin(w - Math.PI));
      const hip = (0.52 * c + 0.1) * amp;
      const knee = -(0.28 * Math.max(0, Math.sin(w)) + 1.6 * Math.pow(sw, 1.15)) * amp - 0.08;
      const ankle = sw > 0 ? -(hip + knee) * 0.5 - 0.35 * sw : -(hip + knee) * 0.85;
      return { hip, knee, ankle };
    };

    if (phase === "pick") {
      sp.position.copy(A);
      sp.rotation.y = 0;
      striker.torso.rotation.x = Math.sin(now * 2) * 0.012;
      striker.arms[0].sh.rotation.x = 0.1;
      striker.arms[1].sh.rotation.x = -0.1;
      striker.arms[0].sh.rotation.z = -0.1;
      striker.arms[1].sh.rotation.z = 0.1;
      striker.arms[0].el.rotation.x = 0.35;
      striker.arms[1].el.rotation.x = 0.35;
      camPos.x += Math.sin(now * 0.4) * 0.05;
    } else if (phase === "run") {
      const u = clamp(t / RUN_T);
      const e = easeInOut(u);
      sp.position.set(lerp(A.x, B.x, e), 0, lerp(A.z, B.z, e));
      const yaw = Math.atan2(-(B.x - A.x), -(B.z - A.z));
      sp.rotation.y = yaw * (1 - easeIn(clamp((u - 0.5) / 0.5)));
      const amp = clamp(Math.sin(Math.PI * u) * 1.25 + 0.3, 0, 1);
      const p = t * 1.75;
      const g0 = gait(p, amp);
      const g1 = gait(p + 0.5, amp);
      const L = striker.legs[0];
      const R = striker.legs[1];
      L.hip.rotation.x = g0.hip;
      L.knee.rotation.x = g0.knee;
      L.ankle.rotation.x = g0.ankle;
      R.hip.rotation.x = g1.hip;
      R.knee.rotation.x = g1.knee;
      R.ankle.rotation.x = g1.ankle;
      const swing = Math.cos(Math.PI * 2 * p) * 0.6 * amp;
      striker.arms[0].sh.rotation.x = swing;
      striker.arms[1].sh.rotation.x = -swing;
      striker.arms[0].sh.rotation.z = 0.08;
      striker.arms[1].sh.rotation.z = -0.08;
      striker.arms[0].el.rotation.x = 1.15 + swing * 0.3;
      striker.arms[1].el.rotation.x = 1.15 - swing * 0.3;
      striker.torso.rotation.x = -0.2 * amp;
      striker.torso.rotation.y = Math.sin(Math.PI * 2 * p) * 0.16 * amp;
      striker.pelvis.rotation.y = -Math.sin(Math.PI * 2 * p) * 0.1 * amp;
      striker.head.rotation.y = -striker.torso.rotation.y * 0.6;
      sp.position.y = 0.045 * amp * (0.5 - 0.5 * Math.cos(4 * Math.PI * p));
      camPos.z = lerp(CAM.z, CAM.z - 0.6, e);
    } else {
      // ---- בעיטה ----
      const kt = t;
      sp.position.copy(B);
      sp.rotation.y = 0;
      const R = striker.legs[1];
      const L = striker.legs[0];
      let hip = 0;
      let knee = 0;
      let lean = -0.1;
      let twist = 0;
      let hop = 0;
      if (kt < 0.2) {
        // כניסה לנעילה: הרגל נשלפת לאחור, הגוף מתאסף
        const s = easeOut(kt / 0.2);
        hip = -0.75 * s;
        knee = -1.55 * s;
        lean = lerp(-0.1, 0.04, s);
        twist = -0.28 * s;
      } else if (kt < KL + 0.02) {
        // החבטה: הירך מזנקת קדימה, הברך נפתחת רגע לפני המגע
        const s = easeIn((kt - 0.2) / (KL + 0.02 - 0.2));
        hip = lerp(-0.75, 1.35, s);
        knee = lerp(-1.55, -0.1, Math.min(1, s * 1.15));
        lean = lerp(0.04, -0.22, s);
        twist = lerp(-0.28, 0.3, s);
      } else if (kt < 0.62) {
        // המשך תנועה גבוה, הגוף מתרומם על רגל התמיכה
        const s = easeOut((kt - KL - 0.02) / (0.62 - KL - 0.02));
        hip = lerp(1.35, 1.75, s);
        knee = lerp(-0.1, -0.35, s);
        lean = lerp(-0.22, -0.12, s);
        twist = lerp(0.3, 0.2, s);
        hop = Math.sin(Math.PI * s) * 0.1;
      } else {
        const s = easeInOut(clamp((kt - 0.62) / 0.5));
        hip = lerp(1.75, 0.12, s);
        knee = lerp(-0.35, -0.14, s);
        lean = lerp(-0.12, -0.02, s);
        twist = lerp(0.2, 0, s);
      }
      sp.position.y = hop;
      R.hip.rotation.x = hip;
      R.knee.rotation.x = knee;
      R.ankle.rotation.x = -(hip + knee) * 0.3 + (kt > KL ? -0.3 : 0.2);
      L.hip.rotation.x = 0.12;
      L.knee.rotation.x = -0.2;
      L.ankle.rotation.x = hop > 0 ? -0.5 : 0;
      striker.torso.rotation.x = lean;
      striker.pelvis.rotation.y = twist * 0.6;
      striker.torso.rotation.y = twist * 0.5;
      striker.head.rotation.y = -twist * 0.4;
      // ידיים: מאזנות, שמאל קדימה-החוצה וימין אחורה
      const ks = clamp(kt / 0.3);
      striker.arms[0].sh.rotation.x = lerp(0.1, 0.55, ks);
      striker.arms[1].sh.rotation.x = lerp(-0.1, -0.5, ks);
      striker.arms[0].sh.rotation.z = lerp(0, -1.0, ks);
      striker.arms[1].sh.rotation.z = lerp(0, 0.85, ks);
      striker.arms[0].el.rotation.x = 0.4;
      striker.arms[1].el.rotation.x = 0.3;

      // פאדיחה: שתי הידיים על הראש, ראש מורכן, כתפיים רועדות
      const fp = easeInOut(clamp((kt - 1.0) / 0.45));
      if (fp > 0) {
        for (let i = 0; i < 2; i++) {
          const a = striker.arms[i];
          a.sh.rotation.x = lerp(a.sh.rotation.x, 2.4, fp);
          a.sh.rotation.z = lerp(a.sh.rotation.z, i === 0 ? 0.3 : -0.3, fp);
          a.el.rotation.x = lerp(a.el.rotation.x, 2.3, fp);
        }
        striker.head.rotation.x = 0.35 * fp;
        striker.torso.rotation.x = lerp(striker.torso.rotation.x, 0.22, fp) + Math.sin(kt * 22) * 0.018 * fp;
        R.hip.rotation.x = lerp(R.hip.rotation.x, 0.1, fp);
        R.knee.rotation.x = lerp(R.knee.rotation.x, -0.25, fp);
        L.knee.rotation.x = lerp(L.knee.rotation.x, -0.25, fp);
        L.hip.rotation.x = lerp(L.hip.rotation.x, 0.12, fp);
      }

      // ---- כדור ----
      const P = punctureAt(targetId);
      const dir = target.x < 0 ? -1 : 1;
      const rest = V(P.x + dir * 0.45, 0.07, P.z - 0.55);
      if (kt < KL) {
        ballPos = V(0, 0.11, SPOT_Z);
      } else if (kt < KP) {
        const s = (kt - KL) / (KP - KL);
        const e = 1 - Math.pow(1 - s, 1.6);
        ballPos = V(lerp(0, P.x, e), lerp(0.11, P.y, e) + Math.sin(Math.PI * e) * 0.35, lerp(SPOT_Z, P.z, e));
        ball.rotation.x -= 0.5;
        ball.rotation.z += 0.12;
      } else {
        const a = kt - KP;
        const fall = clamp(a / 0.42);
        let y = lerp(P.y, 0.07, easeIn(fall));
        if (a > 0.42) {
          const b = clamp((a - 0.42) / 0.3);
          y = 0.07 + Math.sin(b * Math.PI) * 0.16 * (1 - b);
        }
        const drift = easeOut(clamp(a / 0.9));
        ballPos = V(P.x + dir * 0.45 * drift, y, P.z - 0.55 * drift);
        ball.rotation.x -= 0.15 * (1 - drift);
        // נפח שנשפך: שטוח ורחב, עם רטט קטן
        const sq = easeOut(clamp(a / 0.3));
        const wob = Math.sin(a * 30) * 0.04 * (1 - clamp(a / 0.8));
        ball.scale.set(lerp(1, 1.3, sq) + wob, lerp(1, 0.36, sq) - wob, lerp(1, 1.3, sq) + wob);
        if (!punctured) {
          punctured = true;
          puffs.forEach((q, i) => {
            q.userData = { t: now, i, x: P.x, y: P.y, z: P.z };
          });
        }
      }

      // ---- שוער צולל לצד הלא נכון, כמו בגרסה המקורית ----
      if (kt > 0.3) {
        const u = easeOut(clamp((kt - 0.3) / 0.5));
        const d = target.x < 0 ? 1 : -1;
        keeperHolder.position.x = lerp(swayX, d * 3.2, u);
        keeperHolder.position.y = Math.sin(Math.PI * u) * 0.7 + u * 0.3;
        keeperHolder.rotation.z = -d * 1.4 * u;
      }

      // ---- מצלמה: רעידה בהתפנצ'רות, ואז קלוז-אפ על הכדור המרוסק ----
      camPos.z = CAM.z - 0.6;
      const st = kt - KP;
      if (st > 0 && st < 1.3) {
        const k = 1 - st / 1.3;
        camPos.x += Math.sin(st * 70) * 0.05 * k;
        camPos.y += Math.cos(st * 55) * 0.035 * k;
      }
      const cu = easeInOut(clamp((kt - 1.45) / 0.8));
      if (cu > 0) {
        const endPos = V(rest.x * 0.6, 0.6, rest.z + 2.7);
        const endLook = V(rest.x, 0.16, rest.z);
        camPos.lerp(endPos, cu);
        look.lerp(endLook, cu);
      }
    }
    if (ballPos) ball.position.copy(ballPos);
    else {
      ball.position.set(0, 0.11, SPOT_Z);
      ball.scale.set(1, 1, 1);
      ball.rotation.set(0, 0, 0);
    }

    // אוויר ואבק
    for (const p of puffs) {
      const d = p.userData;
      if (!d || d.t === undefined) continue;
      const a = now - d.t - d.i * 0.05;
      if (a < 0 || a > 1.1) {
        p.material.opacity = 0;
        continue;
      }
      const k = a / 1.1;
      p.position.set(d.x + 0.12 + d.i * 0.06 * k * 4, d.y + k * (0.5 + d.i * 0.07), d.z - k * 0.35);
      const s = d.i === 0 ? 0.5 + k * 1.5 : 0.18 + k * 0.8;
      p.scale.set(s, s, 1);
      p.material.opacity = d.i === 0 ? (1 - k) * 0.7 : (1 - k) * 0.6;
      p.material.color.set(d.i % 3 === 0 ? 0xffffff : 0xd9e6d2);
    }

    camera.position.copy(camPos);
    camera.lookAt(look);
  }

  frame();

  return {
    corners,
    setPhase(p: Phase, id?: CornerId) {
      phase = p;
      t0 = performance.now() / 1000;
      if (id) {
        targetId = id;
        target = TARGETS[id];
      }
      if (p === "run" || p === "pick") {
        punctured = false;
        ball.scale.set(1, 1, 1);
        puffs.forEach((q) => (q.userData = {}));
      }
    },
    screenOfPuncture(id: CornerId) {
      const P = punctureAt(id);
      return project(P.x, P.y, P.z);
    },
    dispose() {
      alive = false;
      cancelAnimationFrame(raf);
      ro?.disconnect();
      el.removeEventListener("webglcontextlost", onLost);
      scene.traverse((o: any) => {
        o.geometry?.dispose?.();
        const m = o.material;
        if (m) (Array.isArray(m) ? m : [m]).forEach((x: any) => { x.map?.dispose?.(); x.dispose?.(); });
      });
      renderer.dispose();
      if (el.parentNode === host) host.removeChild(el);
    },
  };
}
