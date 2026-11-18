// @ts-nocheck
// כלים משותפים לכל משחקי התלת-ממד: מתמטיקה, טקסטורות מצוירות בקוד, דמות אדם מפרקית, רשתות.
import * as THREE from "three";

export { THREE };

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 2);
export const easeIn = (t: number) => t * t;

export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

export function tex(c: HTMLCanvasElement, srgb = true) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

// ---------- טקסטורות ----------

export function crowdTexture(seed: number, palette?: string[], w = 1024, h = 512) {
  const c = canvas(w, h);
  const g = c.getContext("2d");
  const r = rng(seed);
  g.fillStyle = "#0a0c11";
  g.fillRect(0, 0, w, h);
  palette = palette || ["#F4EFE6", "#FF4A1C", "#8e9a93", "#2a2d35", "#c9c2b3", "#a8421f", "#e6e0d2", "#1e2128"];
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

export function glowTexture() {
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

// ---------- דמויות ----------

export type Rig = ReturnType<typeof makePlayer>;

export function makePlayer(o: { numberTex?: any; jersey: string; shorts: string; sock: string; hair: string; skin: string; glove?: string; number?: boolean; face?: boolean }) {
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
  if (o.number && o.numberTex) {
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(0.36, 0.42),
      new THREE.MeshStandardMaterial({ map: o.numberTex, transparent: true, roughness: 0.9, polygonOffset: true, polygonOffsetFactor: -2 })
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

export function resetPose(p: Rig) {
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

export function bar(a: any, b: any, r: number, mat: any) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 12), mat);
  m.position.copy(a).addScaledVector(dir, 0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  m.castShadow = true;
  return m;
}

export function netLines(p00: any, p10: any, p01: any, p11: any, nu: number, nv: number, mat: any) {
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


// מחזור הליכה/ריצה: p במחזורים. מחזיר זוויות ירך/ברך/קרסול לרגל אחת
export function gait(p: number, amp: number) {
  const w = Math.PI * 2 * p;
  const c = Math.cos(w);
  const sw = Math.max(0, Math.sin(w - Math.PI));
  const hip = (0.52 * c + 0.1) * amp;
  const knee = -(0.28 * Math.max(0, Math.sin(w)) + 1.6 * Math.pow(sw, 1.15)) * amp - 0.08;
  const ankle = sw > 0 ? -(hip + knee) * 0.5 - 0.35 * sw : -(hip + knee) * 0.85;
  return { hip, knee, ankle };
}

// במה גנרית: רנדרר, סצנה, מצלמה 4:3, שינוי גודל, לולאת רינדור עם הגנה משגיאות וסגירה נקייה
export function createStage(
  host: HTMLElement,
  cb: { onFail: (e?: unknown) => void },
  o: { fov: number; cam: number[]; look: number[]; bg: string | number; fog?: [number, number]; exposure?: number; shadowBox?: number }
) {
  const mobile = window.innerWidth < 700;
  const renderer = new THREE.WebGLRenderer({ antialias: !mobile, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = o.exposure ?? 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const el = renderer.domElement;
  el.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
  host.appendChild(el);
  const scene = new THREE.Scene();
  scene.background = typeof o.bg === "string" || typeof o.bg === "number" ? new THREE.Color(o.bg) : o.bg;
  if (o.fog) scene.fog = new THREE.FogExp2(o.fog[0], o.fog[1]);
  const camera = new THREE.PerspectiveCamera(o.fov, 4 / 3, 0.1, 300);
  const CAM = new THREE.Vector3(...o.cam);
  const LOOK = new THREE.Vector3(...o.look);
  camera.position.copy(CAM);
  camera.lookAt(LOOK);
  function resize() {
    const w = host.clientWidth || 640;
    const h = host.clientHeight || 480;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  camera.updateMatrixWorld(true);
  const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
  ro?.observe(host);
  let alive = true;
  let raf = 0;
  const onLost = (e: Event) => {
    e.preventDefault();
    cb.onFail(e);
  };
  el.addEventListener("webglcontextlost", onLost);
  return {
    THREE,
    renderer,
    scene,
    camera,
    mobile,
    CAM,
    LOOK,
    // ממיר נקודה בעולם לאחוזי מסך
    project(x: number, y: number, z: number) {
      camera.updateMatrixWorld(true);
      const v = new THREE.Vector3(x, y, z).project(camera);
      return { x: ((v.x + 1) / 2) * 100, y: ((1 - v.y) / 2) * 100 };
    },
    start(update: (now: number) => void) {
      const frame = () => {
        if (!alive) return;
        try {
          update(performance.now() / 1000);
          renderer.render(scene, camera);
          raf = requestAnimationFrame(frame);
        } catch (e) {
          alive = false;
          cb.onFail(e);
        }
      };
      frame();
    },
    dispose() {
      alive = false;
      cancelAnimationFrame(raf);
      ro?.disconnect();
      el.removeEventListener("webglcontextlost", onLost);
      scene.traverse((m: any) => {
        m.geometry?.dispose?.();
        const mat = m.material;
        if (mat) (Array.isArray(mat) ? mat : [mat]).forEach((x: any) => { x.map?.dispose?.(); x.dispose?.(); });
      });
      renderer.dispose();
      if (el.parentNode === host) host.removeChild(el);
    },
  };
}

// תאורת "מפתח" עם צללים (מוחזרת כדי לכוון אותה בכל משחק)
export function keyLight(stage: any, color: number, intensity: number, pos: number[], target: number[], box = 12) {
  const l = new THREE.DirectionalLight(color, intensity);
  l.position.set(...pos);
  l.target.position.set(...target);
  l.castShadow = true;
  const sz = stage.mobile ? 1024 : 2048;
  l.shadow.mapSize.set(sz, sz);
  const c = l.shadow.camera;
  c.left = -box;
  c.right = box;
  c.top = box;
  c.bottom = -box;
  c.near = 1;
  c.far = 80;
  l.shadow.bias = -0.0004;
  l.shadow.normalBias = 0.03;
  stage.scene.add(l, l.target);
  return l;
}
