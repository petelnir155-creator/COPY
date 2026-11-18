// @ts-nocheck
// זריקת עונשין בתלת-ממד. הכדור גדול מהחישוק בכוונה, ולכן הוא נתקע עליו.
// מידות במטרים: החישוק במרכז (0, 3.05, -0.24), הקו ב-z=4.57, השחקן ב-z=4.9 מביט ל-z שלילי.
import { THREE, bar, canvas, clamp, createStage, crowdTexture, easeIn, easeInOut, easeOut, glowTexture, keyLight, lerp, makePlayer, resetPose, rng, tex } from "./common";

export const TOTAL = 3.2; // תואם ל-Basketball3D.tsx

const RIM_Y = 3.05;
const RIM_Z = -0.24;
const RIM_R = 0.215;
const BALL_R = 0.245;
const REL = 0.34; // שחרור
const HIT = 1.18; // הגעה לחישוק

function floorTexture(mobile: boolean) {
  const S = mobile ? 1024 : 2048;
  const c = canvas(S, S);
  const g = c.getContext("2d");
  const r = rng(8);
  // מגרש 15x14 מטרים: x∈[-7.5,7.5], z∈[-2,12]
  const W = 15;
  const Z0 = -2;
  const D = 14;
  const px = (x: number) => ((x + W / 2) / W) * S;
  const pz = (z: number) => ((z - Z0) / D) * S;
  const bw = S / 30;
  for (let i = 0; i < 30; i++) {
    const v = 150 + r() * 24;
    g.fillStyle = `rgb(${v + 38},${v - 4},${v - 52})`;
    g.fillRect(i * bw, 0, bw, S);
    g.fillStyle = "rgba(0,0,0,.18)";
    g.fillRect(i * bw, 0, 1.5, S);
    for (let k = 0; k < 18; k++) {
      g.fillStyle = `rgba(${r() > 0.5 ? "255,220,180" : "70,30,10"},${0.04 + r() * 0.05})`;
      g.fillRect(i * bw, r() * S, bw, 2 + r() * 8);
    }
  }
  // צבע
  g.fillStyle = "rgba(255,74,28,.78)";
  g.fillRect(px(-2.45), pz(-0.6), px(2.45) - px(-2.45), pz(5.8) - pz(-0.6));
  g.strokeStyle = "#f4efe6";
  g.lineWidth = S * 0.0045;
  g.strokeRect(px(-2.45), pz(-0.6), px(2.45) - px(-2.45), pz(5.8) - pz(-0.6));
  g.beginPath();
  g.moveTo(px(-2.45), pz(4.57));
  g.lineTo(px(2.45), pz(4.57));
  g.stroke();
  g.beginPath();
  g.ellipse(px(0), pz(4.57), (1.8 / W) * S, (1.8 / D) * S, 0, 0, Math.PI * 2);
  g.stroke();
  // קשת שלוש
  g.beginPath();
  g.ellipse(px(0), pz(-0.24), (6.75 / W) * S, (6.75 / D) * S, 0, 0.18, Math.PI - 0.18);
  g.stroke();
  const t = tex(c);
  t.anisotropy = 16;
  return t;
}

function ballTex() {
  const c = canvas(512, 256);
  const g = c.getContext("2d");
  g.fillStyle = "#f2501e";
  g.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 3000; i++) {
    g.fillStyle = `rgba(0,0,0,${Math.random() * 0.08})`;
    g.fillRect(Math.random() * 512, Math.random() * 256, 2, 2);
  }
  g.strokeStyle = "#1a0c06";
  g.lineWidth = 7;
  g.beginPath();
  g.moveTo(0, 128);
  g.lineTo(512, 128);
  g.moveTo(256, 0);
  g.lineTo(256, 256);
  g.moveTo(0, 0);
  g.stroke();
  g.lineWidth = 6;
  for (const x of [64, 192, 320, 448]) {
    g.beginPath();
    g.ellipse(x, 128, 70, 140, 0, -1.2, 1.2);
    g.stroke();
  }
  return tex(c);
}

function nunTexture() {
  const c = canvas(256, 300);
  const draw = () => {
    const g = c.getContext("2d");
    g.clearRect(0, 0, 256, 300);
    g.textAlign = "center";
    g.fillStyle = "rgba(0,0,0,.5)";
    g.font = "900 210px 'Frank Ruhl Libre', Georgia, serif";
    g.fillText("נ", 132, 236);
    g.fillStyle = "#F4EFE6";
    g.fillText("נ", 128, 232);
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

export function createBasketball3D(host: HTMLElement, cb: { onFail: (e?: unknown) => void; onReady: () => void }) {
  const stage = createStage(host, cb, { fov: 38, cam: [4.4, 2.1, 8.8], look: [-0.4, 2.3, 2.0], bg: "#05060a", fog: [0x080a10, 0.018], exposure: 1.1 });
  const { scene, camera, mobile } = stage;
  const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

  // ----- אורות -----
  scene.add(new THREE.HemisphereLight(0xc7d6ff, 0x2a1c12, 0.8));
  keyLight(stage, 0xfff0d8, 2.8, [5, 14, 9], [0, 0, 3], 11);
  const rimLight = new THREE.DirectionalLight(0xff8a50, 1.0);
  rimLight.position.set(-4, 5, -8);
  rimLight.target.position.set(0, 1.5, 4);
  scene.add(rimLight, rimLight.target);

  // ----- פרקט -----
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(15, 14),
    new THREE.MeshStandardMaterial({ map: floorTexture(mobile), roughness: 0.32, metalness: 0.05 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, 5);
  floor.receiveShadow = true;
  scene.add(floor);
  const outer = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ color: 0x15161b, roughness: 0.9 }));
  outer.rotation.x = -Math.PI / 2;
  outer.position.set(0, -0.01, 0);
  scene.add(outer);

  // ----- יציעים: אחורי וצד שמאל -----
  const orange = ["#F4EFE6", "#FF4A1C", "#2a2d35", "#c9c2b3", "#a8421f", "#1e2128", "#F4EFE6", "#8e9a93"];
  const crowdGroup = new THREE.Group();
  const mkStand = (w: number, h: number, seed: number) => {
    const m = new THREE.MeshBasicMaterial({ map: crowdTexture(seed, orange), color: 0xa8aab4 });
    m.map.wrapS = m.map.wrapT = THREE.RepeatWrapping;
    m.map.repeat.set(w / 18, h / 8);
    return new THREE.Mesh(new THREE.PlaneGeometry(w, h), m);
  };
  const back = mkStand(60, 22, 21);
  back.position.set(0, 9.5, -14);
  back.rotation.x = -0.5;
  crowdGroup.add(back);
  const side = mkStand(44, 22, 23);
  side.position.set(-13, 9.5, 5);
  side.rotation.set(0, Math.PI / 2, 0);
  side.rotateX(-0.5);
  crowdGroup.add(side);
  scene.add(crowdGroup);
  const wallB = new THREE.Mesh(new THREE.PlaneGeometry(60, 3.4), new THREE.MeshBasicMaterial({ color: 0x0b0c10 }));
  wallB.position.set(0, 1.7, -7.4);
  scene.add(wallB);
  const wallS = new THREE.Mesh(new THREE.PlaneGeometry(44, 3.4), new THREE.MeshBasicMaterial({ color: 0x0b0c10 }));
  wallS.position.set(-8.4, 1.7, 5);
  wallS.rotation.y = Math.PI / 2;
  scene.add(wallS);
  // שלטי LED
  const ledTex = (() => {
    const c = canvas(1024, 64);
    const g = c.getContext("2d");
    const cells = [["#FF4A1C", "#F4EFE6"], ["#0b0c10", "#FF4A1C"], ["#F4EFE6", "#111111"], ["#1d2027", "#F4EFE6"]];
    for (let i = 0; i < 4; i++) {
      g.fillStyle = cells[i][0];
      g.fillRect(i * 256, 0, 256, 64);
      g.fillStyle = cells[i][1];
      g.beginPath();
      g.arc(i * 256 + 40, 32, 14, 0, 7);
      g.fill();
      g.fillRect(i * 256 + 70, 20, 120, 8);
      g.fillRect(i * 256 + 70, 36, 76, 8);
    }
    const t = tex(c);
    t.wrapS = THREE.RepeatWrapping;
    t.repeat.set(5, 1);
    return t;
  })();
  const ledB = new THREE.Mesh(new THREE.PlaneGeometry(60, 0.9), new THREE.MeshBasicMaterial({ map: ledTex, toneMapped: false }));
  ledB.position.set(0, 0.5, -7.3);
  scene.add(ledB);
  const ledS = new THREE.Mesh(new THREE.PlaneGeometry(44, 0.9), new THREE.MeshBasicMaterial({ map: ledTex, toneMapped: false }));
  ledS.position.set(-8.3, 0.5, 5);
  ledS.rotation.y = Math.PI / 2;
  scene.add(ledS);

  // זרקורים עליונים
  const glow = glowTexture();
  for (const [x, z] of [[-6, -6], [6, -6], [0, 2], [-6, 8], [6, 8]]) {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false }));
    sp.position.set(x, 11, z);
    sp.scale.set(13, 13, 1);
    scene.add(sp);
  }
  // וידאו-קיוב
  const cubeTex = (() => {
    const c = canvas(512, 128);
    const g = c.getContext("2d");
    g.fillStyle = "#0b0c10";
    g.fillRect(0, 0, 512, 128);
    g.fillStyle = "#FF4A1C";
    g.font = "900 78px Heebo, Arial, sans-serif";
    g.textAlign = "center";
    g.fillText("PETEL", 256, 94);
    return tex(c);
  })();
  const cube = new THREE.Mesh(new THREE.BoxGeometry(5, 1.4, 5), new THREE.MeshBasicMaterial({ map: cubeTex, toneMapped: false }));
  cube.position.set(0, 9.4, 2);
  scene.add(cube);

  // הבזקי מצלמות
  const FL = 60;
  const flPos = new Float32Array(FL * 3);
  const flCol = new Float32Array(FL * 3);
  const rr = rng(5);
  for (let i = 0; i < FL; i++) {
    flPos[i * 3] = (rr() - 0.5) * 40;
    flPos[i * 3 + 1] = 3 + rr() * 9;
    flPos[i * 3 + 2] = -13.3 + ((flPos[i * 3 + 1] - 9.5) / 0.877) * 0.48;
  }
  const flGeo = new THREE.BufferGeometry();
  flGeo.setAttribute("position", new THREE.BufferAttribute(flPos, 3));
  flGeo.setAttribute("color", new THREE.BufferAttribute(flCol, 3));
  scene.add(new THREE.Points(flGeo, new THREE.PointsMaterial({ size: 0.9, map: glow, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })));

  // ----- סל -----
  const steel = new THREE.MeshStandardMaterial({ color: 0x2d3039, roughness: 0.45, metalness: 0.4 });
  const pole = new THREE.Mesh(new THREE.BoxGeometry(0.22, 3.6, 0.22), steel);
  pole.position.set(0, 1.8, -1.55);
  pole.castShadow = true;
  scene.add(pole);
  scene.add(bar(V(0, 3.2, -1.5), V(0, 3.2, -0.62), 0.07, steel));
  const pad = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.4, 0.7), new THREE.MeshStandardMaterial({ color: 0xff4a1c, roughness: 0.7 }));
  pad.position.set(0, 0.7, -1.55);
  pad.castShadow = true;
  scene.add(pad);
  // לוח זכוכית עם מסגרת וריבוע
  const board = new THREE.Mesh(
    new THREE.BoxGeometry(1.83, 1.07, 0.05),
    new THREE.MeshStandardMaterial({ color: 0xcfe0e6, roughness: 0.08, metalness: 0.1, transparent: true, opacity: 0.55 })
  );
  board.position.set(0, 3.5, -0.62);
  board.castShadow = true;
  scene.add(board);
  const white = new THREE.MeshBasicMaterial({ color: 0xf4efe6 });
  const frame = (w: number, h: number, x: number, y: number) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.06), white);
    m.position.set(x, y, -0.585);
    scene.add(m);
  };
  frame(1.9, 0.05, 0, 4.045);
  frame(1.9, 0.05, 0, 2.955);
  frame(0.05, 1.1, -0.92, 3.5);
  frame(0.05, 1.1, 0.92, 3.5);
  const sq = new THREE.MeshBasicMaterial({ color: 0xff4a1c });
  for (const [w, h, x, y] of [[0.6, 0.035, 0, 3.45], [0.6, 0.035, 0, 3.07], [0.035, 0.4, -0.3, 3.26], [0.035, 0.4, 0.3, 3.26]]) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.06), sq);
    m.position.set(x, y, -0.58);
    scene.add(m);
  }
  // חישוק + רשת: קבוצה שנעה סביב ציר שמחובר ללוח
  const rimG = new THREE.Group();
  rimG.position.set(0, RIM_Y, -0.6);
  scene.add(rimG);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(RIM_R, 0.014, 10, 36), new THREE.MeshStandardMaterial({ color: 0xff4a1c, roughness: 0.35, metalness: 0.3 }));
  rim.rotation.x = Math.PI / 2;
  rim.position.set(0, 0, RIM_Z + 0.6);
  rim.castShadow = true;
  rimG.add(rim);
  rimG.add(bar(V(0, 0, 0.0), V(0, 0, 0.6 + RIM_Z - RIM_R), 0.02, new THREE.MeshStandardMaterial({ color: 0xff4a1c })));
  const netG = new THREE.Group();
  netG.position.set(0, 0, RIM_Z + 0.6);
  rimG.add(netG);
  {
    const pos: number[] = [];
    const N = 14;
    const rings = [0, 0.14, 0.28, 0.42];
    const radius = (y: number) => lerp(RIM_R, 0.12, y / 0.42);
    for (let i = 0; i < N; i++) {
      const a0 = (i / N) * Math.PI * 2;
      const a1 = ((i + 1) / N) * Math.PI * 2;
      for (let k = 0; k < 3; k++) {
        const y0 = rings[k];
        const y1 = rings[k + 1];
        // אלכסונים שמצטלבים
        pos.push(Math.cos(a0) * radius(y0), -y0, Math.sin(a0) * radius(y0), Math.cos(a1) * radius(y1), -y1, Math.sin(a1) * radius(y1));
        pos.push(Math.cos(a1) * radius(y0), -y0, Math.sin(a1) * radius(y0), Math.cos(a0) * radius(y1), -y1, Math.sin(a0) * radius(y1));
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    netG.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 })));
  }
  // זוהר אדום על החישוק: "הנה הבעיה"
  const warn = new THREE.Mesh(
    new THREE.TorusGeometry(RIM_R + 0.01, 0.03, 8, 40),
    new THREE.MeshBasicMaterial({ color: 0xff2a1c, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })
  );
  warn.rotation.x = Math.PI / 2;
  warn.position.set(0, 0, RIM_Z + 0.6);
  rimG.add(warn);

  // ----- שחקן וכדור -----
  const player = makePlayer({ jersey: "#16171c", shorts: "#16171c", sock: "#F4EFE6", hair: "#17120f", skin: "#E6C3A3", number: true, numberTex: nunTexture() });
  const P0 = V(0, 0, 4.9);
  player.root.position.copy(P0);
  scene.add(player.root);
  const ball = new THREE.Mesh(new THREE.SphereGeometry(BALL_R, 32, 24), new THREE.MeshStandardMaterial({ map: ballTex(), roughness: 0.6 }));
  ball.castShadow = true;
  scene.add(ball);
  const trail = Array.from({ length: 3 }, (_, i) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: 0xff6a3d, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0 }));
    scene.add(s);
    return s;
  });

  // ----- מצב -----
  let thrown = false;
  let t0 = 0;
  const lerpV = (a: any, b: any, t: number) => V(lerp(a.x, b.x, t), lerp(a.y, b.y, t), lerp(a.z, b.z, t));
  const REL_P = V(0.05, 2.35, 4.45);
  const STUCK = V(0, RIM_Y + Math.sqrt(BALL_R * BALL_R - RIM_R * RIM_R) + 0.005, RIM_Z);
  let lastFlash = 0;
  const base = stage.CAM.clone();
  const lookBase = stage.LOOK.clone();

  stage.start((now) => {
    if (now - lastFlash > 0.1) {
      lastFlash = now;
      for (let i = 0; i < FL; i++) {
        const on = rr() > 0.96 ? 1 : 0;
        flCol[i * 3] = flCol[i * 3 + 1] = flCol[i * 3 + 2] = on;
      }
      flGeo.attributes.color.needsUpdate = true;
    }
    const kt = thrown ? now - t0 : -1;
    resetPose(player);
    const cam = base.clone();
    const look = lookBase.clone();
    let sag = 0;

    // הקהל קופץ כשהכדור נתקע
    let hopY = 0;
    if (kt > HIT) {
      const a = kt - HIT;
      hopY = Math.max(0, Math.sin(a * 11)) * 0.3 * (1 - clamp(a / 1.2));
    }
    crowdGroup.position.y = hopY;

    // ----- שחקן -----
    const L = player.legs;
    if (kt < 0) {
      // ממתין: מקפיץ כדור קלות ונושם
      const b = Math.sin(now * 2.2);
      player.torso.rotation.x = -0.05 + b * 0.012;
      L[0].hip.rotation.x = 0.12;
      L[1].hip.rotation.x = 0.12;
      L[0].knee.rotation.x = -0.2;
      L[1].knee.rotation.x = -0.2;
      for (let i = 0; i < 2; i++) {
        player.arms[i].sh.rotation.x = 0.95;
        player.arms[i].sh.rotation.z = (i === 0 ? 1 : -1) * 0.35;
        player.arms[i].el.rotation.x = 1.4;
      }
      ball.position.set(0, 1.28 + Math.sin(now * 2.2) * 0.01, 4.5);
      ball.rotation.x += 0.0;
    } else {
      // כיפוף, זינוק, זריקה עם שחרור ב-REL
      const dip = kt < 0.24 ? easeInOut(kt / 0.24) : 0;
      const rise = clamp((kt - 0.2) / 0.16);
      const kneeB = kt < 0.24 ? dip : lerp(1, 0, easeOut(clamp((kt - 0.24) / 0.2)));
      const jump = Math.sin(Math.PI * clamp((kt - 0.24) / 0.42)) * 0.16;
      for (const l of L) {
        l.hip.rotation.x = 0.12 + 0.6 * kneeB;
        l.knee.rotation.x = -0.2 - 1.15 * kneeB;
        l.ankle.rotation.x = jump > 0.02 ? -0.7 : 0.1 * kneeB;
      }
      player.root.position.set(P0.x, jump - 0.28 * dip * (kt < 0.24 ? 1 : 0), P0.z);
      player.torso.rotation.x = lerp(-0.05, -0.28, dip) + (kt > 0.24 ? 0.2 * easeOut(clamp((kt - 0.24) / 0.2)) : 0);
      for (let i = 0; i < 2; i++) {
        const a = player.arms[i];
        const up = easeOut(rise);
        a.sh.rotation.x = lerp(0.95, 3.0, up);
        a.sh.rotation.z = lerp(i === 0 ? 0.35 : -0.35, i === 0 ? 0.08 : -0.08, up);
        a.el.rotation.x = lerp(1.4, 0.15, up);
      }
      // תנועת סיום: שורש כף היד נופל
      if (kt > REL) for (const a of player.arms) a.el.rotation.x = 0.15 + easeOut(clamp((kt - REL) / 0.15)) * 0.7;
      if (kt < REL) {
        const up = easeOut(rise);
        ball.position.set(lerp(0, 0.05, up), lerp(1.2 - 0.12 * dip, 2.3, up), lerp(4.5, 4.45, up));
        ball.rotation.x -= 0.02;
      } else {
        const s = clamp((kt - REL) / (HIT - REL));
        const e = lerp(s, easeIn(s), 0.35);
        const p = lerpV(REL_P, STUCK, e);
        p.y += Math.sin(Math.PI * Math.min(1, s)) * 1.7 * (1 - 0.0);
        if (s < 1) {
          ball.position.copy(p);
          ball.rotation.x -= 0.28;
          ball.rotation.z += 0.05;
        } else {
          // תקוע: רועד ונח על החישוק
          const a = kt - HIT;
          const wob = Math.sin(a * 28) * 0.012 * (1 - clamp(a / 0.8));
          ball.position.set(STUCK.x + wob, STUCK.y - 0.01 * easeOut(clamp(a / 0.2)), STUCK.z);
          ball.rotation.z = wob * 9;
        }
        trail.forEach((sp, i) => {
          sp.position.copy(lerpV(REL_P, STUCK, Math.max(0, e - (i + 1) * 0.05)));
          sp.position.y += Math.sin(Math.PI * Math.max(0, s - (i + 1) * 0.05)) * 1.7;
          sp.scale.set(0.5 - i * 0.1, 0.5 - i * 0.1, 1);
          sp.material.opacity = s < 1 ? 0.3 - i * 0.08 : 0;
        });
      }
      if (kt >= HIT) {
        const a = kt - HIT;
        // החישוק שוקע ונוטה, רועד
        sag = 0.14 * easeOut(clamp(a / 0.12)) + Math.sin(a * 22) * 0.012 * (1 - clamp(a / 1.0));
        trail.forEach((sp) => (sp.material.opacity = 0));
      }
    }
    rimG.rotation.x = sag;
    netG.scale.y = kt >= HIT ? 0.82 : 1;
    // הבלחת אזהרה על החישוק
    warn.material.opacity = kt >= HIT + 0.2 ? 0.55 + Math.sin((kt - HIT) * 12) * 0.35 : 0;
    const grow = kt >= HIT ? 1 + 0.06 * Math.sin((kt - HIT) * 12) : 1;
    warn.scale.set(grow, grow, grow);

    // ----- מצלמה: זום ריפליי לתוך החישוק -----
    if (kt > 0) {
      const z = easeInOut(clamp((kt - 1.3) / 0.9));
      if (z > 0) {
        cam.lerp(V(1.5, 3.05, 1.6), z);
        look.lerp(V(0, RIM_Y + 0.05, RIM_Z), z);
      }
      if (kt > HIT && kt < HIT + 0.5) {
        const k = 1 - (kt - HIT) / 0.5;
        cam.x += Math.sin(kt * 80) * 0.03 * k;
        cam.y += Math.cos(kt * 63) * 0.02 * k;
      }
    } else {
      cam.x += Math.sin(now * 0.4) * 0.05;
    }
    camera.position.copy(cam);
    camera.lookAt(look);
  });
  cb.onReady();

  return {
    throwBall() {
      if (thrown) return;
      thrown = true;
      t0 = performance.now() / 1000;
    },
    dispose: stage.dispose,
  };
}
