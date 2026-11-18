// @ts-nocheck
// "טניס שולחן" בתלת-ממד: אדם עם מחבט ושולחן עץ רגיל. בהחלקה הוא זורק את השולחן כמעט אנכית, בורח,
// והשולחן נופל על הגב במקום שבו עמד, ונשבר. מידות במטרים, הרשת ב-z=0, המצלמה מאחורי קו הבסיס הקרוב.
import { THREE, bar, canvas, clamp, createStage, crowdTexture, easeIn, easeInOut, easeOut, gait, glowTexture, keyLight, lerp, makePlayer, resetPose, rng, tex } from "./common";

export const IMPACT_T = 1.56; // רגע הנחיתה אחרי תחילת ההגשה, תואם ל-TableTennis3D.tsx
const REL_T = 0.28; // רגע שחרור השולחן מהיד

function courtTexture(mobile: boolean) {
  const S = mobile ? 1024 : 2048;
  const c = canvas(S, S);
  const g = c.getContext("2d");
  const r = rng(12);
  // המשטח: x∈[-20,20], z∈[-30,30]
  const W = 40;
  const D = 60;
  const px = (x: number) => ((x + W / 2) / W) * S;
  const pz = (z: number) => ((z + D / 2) / D) * S;
  const bands = 22;
  for (let i = 0; i < bands; i++) {
    g.fillStyle = i % 2 ? "#5f9a5a" : "#6aa664";
    g.fillRect(0, (i / bands) * S, S, S / bands + 1);
  }
  for (let i = 0; i < (mobile ? 7000 : 24000); i++) {
    const x = r() * S;
    const y = r() * S;
    g.strokeStyle = r() > 0.5 ? "rgba(190,230,150,.18)" : "rgba(20,60,25,.22)";
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + (r() - 0.5) * 2, y - 2 - r() * 4);
    g.stroke();
  }
  // שחיקה בקו הבסיס
  for (const z of [11.9, -11.9]) {
    const gr = g.createRadialGradient(px(0), pz(z), 0, px(0), pz(z), S * 0.07);
    gr.addColorStop(0, "rgba(126,102,64,.45)");
    gr.addColorStop(1, "rgba(126,102,64,0)");
    g.fillStyle = gr;
    g.fillRect(px(0) - S * 0.2, pz(z) - S * 0.07, S * 0.4, S * 0.14);
  }
  g.strokeStyle = "#f4efe6";
  g.lineWidth = Math.max(2.5, S * 0.003);
  g.lineCap = "square";
  const L = (x1: number, z1: number, x2: number, z2: number) => {
    g.beginPath();
    g.moveTo(px(x1), pz(z1));
    g.lineTo(px(x2), pz(z2));
    g.stroke();
  };
  L(-5.485, -11.885, 5.485, -11.885);
  L(-5.485, 11.885, 5.485, 11.885);
  L(-5.485, -11.885, -5.485, 11.885);
  L(5.485, -11.885, 5.485, 11.885);
  L(-4.115, -11.885, -4.115, 11.885);
  L(4.115, -11.885, 4.115, 11.885);
  L(-4.115, -6.4, 4.115, -6.4);
  L(-4.115, 6.4, 4.115, 6.4);
  L(0, -6.4, 0, 6.4);
  L(0, 11.885, 0, 11.5);
  L(0, -11.885, 0, -11.5);
  const t = tex(c);
  t.anisotropy = 16;
  return t;
}

function woodTexture() {
  const c = canvas(256, 256);
  const g = c.getContext("2d");
  g.fillStyle = "#a9774f";
  g.fillRect(0, 0, 256, 256);
  const r = rng(3);
  for (let i = 0; i < 70; i++) {
    g.strokeStyle = `rgba(${r() > 0.5 ? "90,56,30" : "210,160,110"},${0.1 + r() * 0.16})`;
    g.lineWidth = 1 + r() * 2;
    g.beginPath();
    const y = r() * 256;
    g.moveTo(0, y);
    g.bezierCurveTo(80, y + (r() - 0.5) * 12, 170, y + (r() - 0.5) * 12, 256, y + (r() - 0.5) * 8);
    g.stroke();
  }
  for (let k = 0; k < 4; k++) {
    g.strokeStyle = "rgba(60,36,20,.3)";
    g.lineWidth = 1;
    g.beginPath();
    g.ellipse(40 + r() * 170, 30 + r() * 190, 9, 3.5, 0, 0, 7);
    g.stroke();
  }
  const t = tex(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

export function createTennis3D(host: HTMLElement, cb: { onFail: (e?: unknown) => void; onReady: (info: { ump: { x: number; y: number } }) => void }) {
  const sky = (() => {
    const c = canvas(8, 256);
    const g = c.getContext("2d");
    const gr = g.createLinearGradient(0, 0, 0, 256);
    gr.addColorStop(0, "#6fa6d6");
    gr.addColorStop(0.55, "#bcd7e8");
    gr.addColorStop(1, "#ece9df");
    g.fillStyle = gr;
    g.fillRect(0, 0, 8, 256);
    return tex(c);
  })();
  const stage = createStage(host, cb, { fov: 40, cam: [0.9, 2.5, 14.6], look: [0, 1.2, -2.5], bg: sky, fog: [0xc9d9e2, 0.0105], exposure: 1.0 });
  const { scene, camera, mobile } = stage;
  const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

  scene.add(new THREE.HemisphereLight(0xcfe3ff, 0x4a5a3a, 1.05));
  const sun = keyLight(stage, 0xfff2da, 3.2, [-9, 20, 12], [0, 0, 4], 13);

  // ----- מגרש -----
  const court = new THREE.Mesh(new THREE.PlaneGeometry(40, 60), new THREE.MeshStandardMaterial({ map: courtTexture(mobile), roughness: 0.98 }));
  court.rotation.x = -Math.PI / 2;
  court.receiveShadow = true;
  scene.add(court);

  // ----- סביבה: רשת הגנה, יציע, עצים -----
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(60, 3.2), new THREE.MeshStandardMaterial({ color: 0x24463a, roughness: 0.9 }));
  wall.position.set(0, 1.6, -17);
  scene.add(wall);
  const sideL = wall.clone();
  sideL.rotation.y = Math.PI / 2;
  sideL.position.set(-13, 1.6, 0);
  scene.add(sideL);
  const sideR = wall.clone();
  sideR.rotation.y = -Math.PI / 2;
  sideR.position.set(13, 1.6, 0);
  scene.add(sideR);
  const adTex = (() => {
    const c = canvas(1024, 64);
    const g = c.getContext("2d");
    for (let i = 0; i < 4; i++) {
      g.fillStyle = "#24463a";
      g.fillRect(i * 256, 0, 256, 64);
      g.fillStyle = "#F4EFE6";
      if (i % 3 === 0) {
        g.beginPath();
        g.arc(i * 256 + 40, 32, 12, 0, 7);
        g.fill();
        g.fillRect(i * 256 + 66, 24, 100, 8);
      } else if (i % 3 === 1) {
        g.fillRect(i * 256 + 24, 18, 120, 7);
        g.fillStyle = "#FF4A1C";
        g.fillRect(i * 256 + 24, 36, 80, 7);
      } else {
        g.beginPath();
        g.moveTo(i * 256 + 24, 50);
        g.lineTo(i * 256 + 50, 12);
        g.lineTo(i * 256 + 76, 50);
        g.fill();
      }
    }
    const t = tex(c);
    t.wrapS = THREE.RepeatWrapping;
    t.repeat.set(3, 1);
    return t;
  })();
  const ads = new THREE.Mesh(new THREE.PlaneGeometry(60, 1.0), new THREE.MeshBasicMaterial({ map: adTex }));
  ads.position.set(0, 1.5, -16.95);
  scene.add(ads);

  const standMat = new THREE.MeshBasicMaterial({ map: crowdTexture(5, ["#e6e0d2", "#c9c2b3", "#FF4A1C", "#8e9a93", "#2a2d35", "#a8421f", "#f4efe6", "#f4efe6"]), color: 0xd9dbe0, fog: true });
  standMat.map.wrapS = THREE.RepeatWrapping;
  standMat.map.repeat.set(3, 1);
  const stand = new THREE.Mesh(new THREE.PlaneGeometry(70, 12), standMat);
  stand.position.set(0, 7.2, -23);
  stand.rotation.x = -0.45;
  scene.add(stand);
  const hedge = new THREE.Mesh(new THREE.PlaneGeometry(70, 3), new THREE.MeshStandardMaterial({ color: 0x1f3a2d, roughness: 1 }));
  hedge.position.set(0, 3.4, -18.4);
  scene.add(hedge);
  const treeMats = [0x3b6a4c, 0x477a57, 0x335f43].map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 1 }));
  const rt = rng(21);
  for (let i = 0; i < 16; i++) {
    const t = new THREE.Mesh(new THREE.SphereGeometry(3 + rt() * 2.4, 14, 10), treeMats[i % 3]);
    t.position.set(-34 + i * 4.6 + rt() * 2, 5 + rt() * 3, -30 - rt() * 6);
    t.scale.y = 1.15;
    scene.add(t);
  }
  const sunSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false, color: 0xfff1d0 }));
  sunSprite.position.set(-30, 38, -60);
  sunSprite.scale.set(60, 60, 1);
  scene.add(sunSprite);

  // ----- רשת -----
  const netMat = new THREE.LineBasicMaterial({ color: 0x15171c, transparent: true, opacity: 0.55 });
  {
    const pos: number[] = [];
    for (let x = -6.4; x <= 6.401; x += 0.08) pos.push(x, 0, 0, x, 1.0, 0);
    for (let y = 0; y <= 1.001; y += 0.08) pos.push(-6.4, y, 0, 6.4, y, 0);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    scene.add(new THREE.LineSegments(g, netMat));
  }
  const tape = new THREE.Mesh(new THREE.BoxGeometry(12.8, 0.07, 0.03), new THREE.MeshStandardMaterial({ color: 0xf4efe6, roughness: 0.6 }));
  tape.position.set(0, 1.0, 0);
  tape.castShadow = true;
  scene.add(tape);
  for (const x of [-6.45, 6.45]) {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.08, 12), new THREE.MeshStandardMaterial({ color: 0x1a1b20, roughness: 0.4, metalness: 0.4 }));
    p.position.set(x, 0.54, 0);
    p.castShadow = true;
    scene.add(p);
  }

  // ----- כיסא שופט, שופט, שופטי קו -----
  const chair = new THREE.Group();
  const gm = new THREE.MeshStandardMaterial({ color: 0x26463a, roughness: 0.7 });
  for (const [dx, dz] of [[-0.35, -0.35], [0.35, -0.35], [-0.35, 0.35], [0.35, 0.35]]) chair.add(bar(V(dx, 0, dz), V(dx * 0.7, 1.9, dz * 0.7), 0.035, gm));
  for (const y of [0.6, 1.2]) chair.add(bar(V(-0.3, y, 0.3), V(0.3, y, 0.3), 0.025, gm));
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, 0.8), gm);
  seat.position.y = 1.9;
  seat.castShadow = true;
  chair.add(seat);
  const backR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.7, 0.8), gm);
  backR.position.set(0.44, 2.3, 0);
  chair.add(backR);
  chair.position.set(7.6, 0, 0);
  scene.add(chair);
  const ump = makePlayer({ jersey: "#f4efe6", shorts: "#2a2d35", sock: "#f4efe6", hair: "#d8d2c6", skin: "#E6C3A3", face: false });
  ump.root.position.set(7.55, 1.95, 0);
  ump.root.rotation.y = Math.PI / 2;
  ump.root.scale.setScalar(0.95);
  scene.add(ump.root);
  const judges = [[-5.9, -12.8], [5.9, -12.8], [-6.2, 12.7], [6.2, 12.9]].map(([x, z]) => {
    const j = makePlayer({ jersey: "#1f2228", shorts: "#1f2228", sock: "#1f2228", hair: "#2a2118", skin: "#d9b79a" });
    j.root.position.set(x, 0, z);
    j.root.rotation.y = z < 0 ? 0 : Math.PI;
    scene.add(j.root);
    return j;
  });

  // ----- שחקן -----
  const player = makePlayer({ jersey: "#F4EFE6", shorts: "#F4EFE6", sock: "#F4EFE6", hair: "#1a1411", skin: "#E6C3A3" });
  const P0 = V(-3.0, 0, 10.6);
  player.root.position.copy(P0);
  scene.add(player.root);
  // מחבט בידית שמאל
  const racket = new THREE.Group();
  {
    const hand = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.3, 8), new THREE.MeshStandardMaterial({ color: 0x111114 }));
    hand.position.y = -0.1;
    racket.add(hand);
    const head = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.014, 8, 28), new THREE.MeshStandardMaterial({ color: 0xff4a1c, roughness: 0.4 }));
    head.scale.set(0.85, 1.15, 1);
    head.position.y = -0.46;
    racket.add(head);
    const strings = new THREE.Mesh(new THREE.CircleGeometry(0.14, 20), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.22, side: THREE.DoubleSide }));
    strings.scale.set(0.85, 1.15, 1);
    strings.position.y = -0.46;
    racket.add(strings);
    racket.rotation.x = Math.PI;
    player.arms[0].el.add(racket);
    racket.position.set(0, -0.36, 0);
    racket.rotation.set(0.25, 0, 0);
  }

  // ----- שולחן -----
  const wood = new THREE.MeshStandardMaterial({ map: woodTexture(), roughness: 0.7 });
  const woodDark = new THREE.MeshStandardMaterial({ color: 0x6e4b33, roughness: 0.8 });
  const shadowed = (m) => {
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  };
  const box = (w, h, d, mat, x, y, z) => {
    const m = shadowed(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat));
    m.position.set(x, y, z);
    return m;
  };
  const TW = 1.5;
  const TD = 0.85;
  const LEG = 0.72;
  const legPos = [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz]) => [sx * (TW / 2 - 0.08), sz * (TD / 2 - 0.08)]);
  const intact = new THREE.Group();
  intact.add(box(TW, 0.05, TD, wood, 0, 0, 0));
  intact.add(box(TW - 0.2, 0.08, 0.04, woodDark, 0, -0.065, TD / 2 - 0.08));
  intact.add(box(TW - 0.2, 0.08, 0.04, woodDark, 0, -0.065, -TD / 2 + 0.08));
  legPos.forEach(([x, z]) => intact.add(box(0.07, LEG, 0.07, woodDark, x, -LEG / 2 - 0.03, z)));
  // שולחן שבור: שתי חצאי לוח מוזזים, רגל חסרה, סדק
  const brokenG = new THREE.Group();
  {
    const left = new THREE.Group();
    left.add(box(0.8, 0.05, TD, wood, -0.35, 0, 0));
    left.add(box(0.04, 0.05, TD * 0.6, woodDark, 0.05, 0.0, 0.1));
    left.add(box(0.7, 0.08, 0.04, woodDark, -0.35, -0.065, TD / 2 - 0.08));
    left.add(box(0.07, LEG, 0.07, woodDark, legPos[0][0], -LEG / 2 - 0.03, legPos[0][1]));
    left.add(box(0.07, LEG, 0.07, woodDark, legPos[2][0], -LEG / 2 - 0.03, legPos[2][1]));
    const right = new THREE.Group();
    right.add(box(0.68, 0.05, TD, wood, 0.41, 0, 0));
    right.add(box(0.6, 0.08, 0.04, woodDark, 0.45, -0.065, -TD / 2 + 0.08));
    right.add(box(0.07, LEG, 0.07, woodDark, legPos[1][0], -LEG / 2 - 0.03, legPos[1][1]));
    right.position.set(0.05, -0.03, 0);
    right.rotation.z = -0.16;
    left.rotation.z = 0.05;
    brokenG.add(left, right);
  }
  brokenG.visible = false;
  const hand = new THREE.Group();
  hand.add(intact, brokenG);
  scene.add(hand);
  // רגל שנתלשה + רסיסים
  const flyLeg = box(0.07, LEG, 0.07, woodDark, 0, 0, 0);
  flyLeg.visible = false;
  scene.add(flyLeg);
  const splinters = Array.from({ length: 14 }, (_, i) => {
    const m = box(0.16 + (i % 3) * 0.05, 0.03, 0.04, i % 2 ? wood : woodDark, 0, 0, 0);
    m.visible = false;
    scene.add(m);
    return m;
  });
  const rs = rng(9);
  const spl = splinters.map(() => ({ vx: (rs() - 0.5) * 3.6, vy: 1.6 + rs() * 2.6, vz: (rs() - 0.5) * 2.4, rx: (rs() - 0.5) * 14, rz: (rs() - 0.5) * 14 }));
  const dust = Array.from({ length: 8 }, () => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: 0xd9d2bd, transparent: true, depthWrite: false, opacity: 0 }));
    scene.add(s);
    return s;
  });

  // ----- מצב -----
  let serving = false;
  let t0 = 0;
  const landed = V(P0.x + 0.05, 0.07, P0.z - 0.05);
  const REL_P = V(P0.x + 0.5, 2.05, P0.z - 0.1);
  const T = IMPACT_T - REL_T;
  const g = 9.8;
  const vy = (landed.y - REL_P.y + 0.5 * g * T * T) / T;
  const vx = (landed.x - REL_P.x) / T;
  const vz = (landed.z - REL_P.z) / T;
  const camBase = stage.CAM.clone();
  const lookBase = stage.LOOK.clone();
  let lastFlash = 0;

  const umpScreen = stage.project(7.55, 3.2, 0);
  cb.onReady({ ump: umpScreen });

  stage.start((now) => {
    const kt = serving ? now - t0 : -1;
    resetPose(player);
    resetPose(ump);
    for (const j of judges) resetPose(j);

    // שופט הכיסא: יושב; אחרי הנחיתה מרים יד ומכריז
    ump.legs[0].hip.rotation.x = 1.5;
    ump.legs[1].hip.rotation.x = 1.5;
    ump.legs[0].knee.rotation.x = -1.5;
    ump.legs[1].knee.rotation.x = -1.5;
    ump.pelvis.position.y = 0;
    ump.arms[0].sh.rotation.x = 0.6;
    ump.arms[1].sh.rotation.x = 0.6;
    ump.arms[0].el.rotation.x = 1.0;
    ump.arms[1].el.rotation.x = 1.0;
    if (kt > IMPACT_T + 0.5) {
      const u = easeOut(clamp((kt - IMPACT_T - 0.5) / 0.25));
      ump.arms[1].sh.rotation.x = lerp(0.6, 2.9, u);
      ump.arms[1].sh.rotation.z = lerp(0, -0.3, u);
      ump.arms[1].el.rotation.x = lerp(1.0, 0.1, u);
    }
    // שופטי קו: עומדים ומסתכלים
    judges.forEach((j, i) => {
      j.head.rotation.y = Math.sin(now * 0.8 + i) * 0.25;
      j.torso.rotation.x = 0.04;
    });

    const cam = camBase.clone();
    const look = lookBase.clone();

    // ----- שחקן + שולחן -----
    if (kt < 0) {
      const b = Math.sin(now * 2);
      player.root.position.copy(P0);
      player.root.position.y = 0;
      player.torso.rotation.x = -0.03 + b * 0.012;
      player.legs[0].hip.rotation.x = 0.06;
      player.legs[1].hip.rotation.x = 0.06;
      player.arms[0].sh.rotation.x = 0.1;
      player.arms[0].el.rotation.x = 1.0;
      player.arms[0].sh.rotation.z = 0.1;
      // יד ימין נושאת את השולחן בצד הגוף
      player.arms[1].sh.rotation.x = -0.1;
      player.arms[1].sh.rotation.z = -0.55;
      player.arms[1].el.rotation.x = 0.35;
      hand.position.set(P0.x + 0.78, 0.78 + b * 0.005, P0.z - 0.08);
      hand.rotation.set(0, 0.4, 0.28);
      cam.x += Math.sin(now * 0.4) * 0.05;
    } else {
      const wind = easeOut(clamp(kt / 0.14));
      const up = easeOut(clamp((kt - 0.14) / 0.14));
      // זריקה
      const a = player.arms[1];
      a.sh.rotation.x = kt < 0.14 ? lerp(-0.1, -0.7, wind) : lerp(-0.7, 3.0, up);
      a.sh.rotation.z = lerp(-0.55, -0.2, up);
      a.el.rotation.x = lerp(0.35, 0.1, up);
      player.torso.rotation.x = kt < 0.14 ? 0.08 * wind : lerp(0.08, -0.22, up);
      player.torso.rotation.y = lerp(0, 0.25, up);
      if (kt < REL_T) {
        const k = kt / REL_T;
        hand.position.set(lerp(P0.x + 0.78, REL_P.x, easeOut(k)), lerp(0.78, REL_P.y, easeOut(k)), P0.z - 0.08);
        hand.rotation.set(0, lerp(0.4, 0, k), lerp(0.28, 0.4, k));
      } else if (kt < IMPACT_T) {
        const tf = kt - REL_T;
        hand.position.set(REL_P.x + vx * tf, REL_P.y + vy * tf - 0.5 * g * tf * tf, REL_P.z + vz * tf);
        hand.rotation.set(0, 0, lerp(0.4, Math.PI * 3, tf / T));
      } else {
        // נחת על הגב: קופץ קלות ונח כשהרגליים באוויר
        const a2 = kt - IMPACT_T;
        const hop = Math.abs(Math.sin(clamp(a2 / 0.5) * Math.PI * 1.2)) * 0.17 * (1 - clamp(a2 / 0.5));
        hand.position.set(landed.x, landed.y + hop, landed.z);
        hand.rotation.set(0, 0, Math.PI * 3 - 0.12 * easeOut(clamp(a2 / 0.3)));
        if (!brokenG.visible) {
          brokenG.visible = true;
          intact.visible = false;
          flyLeg.visible = true;
          splinters.forEach((m) => (m.visible = true));
        }
      }
      // השחקן נמלט שמאלה אחרי השחרור
      const rk = clamp((kt - 0.34) / 1.7);
      if (kt < 0.34) {
        player.root.position.copy(P0);
        player.legs[0].hip.rotation.x = 0.1;
        player.legs[1].hip.rotation.x = 0.1;
        player.arms[0].sh.rotation.x = 0.3;
        player.arms[0].el.rotation.x = 1.0;
      } else {
        const x = P0.x - 12 * Math.pow(rk, 1.7);
        player.root.position.set(x, 0, P0.z + 0.2 * Math.sin(rk * 3));
        player.root.rotation.y = Math.PI / 2 * easeOut(clamp((kt - 0.34) / 0.25));
        const amp = 0.9;
        const p = (kt - 0.34) * 2.4;
        const g0 = gait(p, amp);
        const g1 = gait(p + 0.5, amp);
        player.legs[0].hip.rotation.x = g0.hip;
        player.legs[0].knee.rotation.x = g0.knee;
        player.legs[0].ankle.rotation.x = g0.ankle;
        player.legs[1].hip.rotation.x = g1.hip;
        player.legs[1].knee.rotation.x = g1.knee;
        player.legs[1].ankle.rotation.x = g1.ankle;
        const sw = Math.cos(Math.PI * 2 * p) * 0.7;
        player.arms[0].sh.rotation.x = sw;
        player.arms[1].sh.rotation.x = kt < 0.5 ? a.sh.rotation.x : -sw;
        player.arms[0].el.rotation.x = 1.15;
        player.torso.rotation.x = -0.2;
        player.root.position.y = 0.05 * (0.5 - 0.5 * Math.cos(4 * Math.PI * p));
      }

      // ----- אפקטי נחיתה -----
      if (kt >= IMPACT_T) {
        const a2 = kt - IMPACT_T;
        flyLeg.position.set(landed.x + 0.6 + 1.9 * a2, 0.35 + 3.2 * a2 - 0.5 * g * a2 * a2, landed.z + 0.1 + 0.4 * a2);
        flyLeg.rotation.set(a2 * 6, 0, a2 * 9);
        if (flyLeg.position.y < 0.05) flyLeg.position.y = 0.05;
        splinters.forEach((m, i) => {
          const s = spl[i];
          m.position.set(landed.x + s.vx * a2, Math.max(0.03, 0.2 + s.vy * a2 - 0.5 * g * a2 * a2), landed.z + s.vz * a2);
          m.rotation.set(s.rx * a2 * (a2 < 0.8 ? 1 : 0.8), 0, s.rz * a2 * (a2 < 0.8 ? 1 : 0.8));
        });
        dust.forEach((d, i) => {
          const k = clamp(a2 / 1.0);
          d.position.set(landed.x + (i - 3.5) * 0.28 * (0.4 + k), 0.2 + k * 0.5, landed.z + Math.sin(i * 2) * 0.4);
          const s = 0.5 + k * 1.8;
          d.scale.set(s, s, 1);
          d.material.opacity = (1 - k) * 0.5;
        });
        // רעידת מצלמה
        if (a2 < 0.6) {
          const k = 1 - a2 / 0.6;
          cam.x += Math.sin(a2 * 70) * 0.09 * k;
          cam.y += Math.cos(a2 * 55) * 0.07 * k;
        }
      }
    }
    camera.position.copy(cam);
    camera.lookAt(look);
  });

  return {
    serve() {
      if (serving) return;
      serving = true;
      t0 = performance.now() / 1000;
    },
    dispose: stage.dispose,
  };
}
