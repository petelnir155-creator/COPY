import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GameOverModal from "./GameOverModal";
import type { GameProps } from "./GameOverModal";

// הבמה היא 4:3, וה-SVG בגודל 400x300 ממופה עליה 1:1, כך שאחוזים ויחידות SVG מתאימים.

type Phase = "pick" | "run" | "kick" | "done";
type Corner = { id: string; x: number; y: number; label: string };

const corners: Corner[] = [
  { id: "tl", x: 22, y: 21, label: "פינה שמאלית עליונה" },
  { id: "tr", x: 78, y: 21, label: "פינה ימנית עליונה" },
  { id: "bl", x: 22, y: 36, label: "פינה שמאלית תחתונה" },
  { id: "br", x: 78, y: 36, label: "פינה ימנית תחתונה" },
];

const START = { x: 50, y: 78 }; // נקודת הפנדל
const GROUND_Y = 70; // איפה הכדור נוחת (מרוסק)

function SoccerBall() {
  return (
    <svg viewBox="0 0 40 40" className="block h-full w-full" aria-hidden>
      <circle cx="20" cy="20" r="18" fill="#F4EFE6" stroke="#111" strokeWidth="2.5" />
      <polygon points="20,12 27.6,17.5 24.7,26.5 15.3,26.5 12.4,17.5" fill="#111" />
      <g stroke="#111" strokeWidth="2" strokeLinecap="round">
        <line x1="20" y1="12" x2="20" y2="3" />
        <line x1="27.6" y1="17.5" x2="36" y2="14.5" />
        <line x1="24.7" y1="26.5" x2="30" y2="34" />
        <line x1="15.3" y1="26.5" x2="10" y2="34" />
        <line x1="12.4" y1="17.5" x2="4" y2="14.5" />
      </g>
    </svg>
  );
}

function Striker({ kick }: { kick: boolean }) {
  return (
    <svg viewBox="0 0 100 160" className="block w-full overflow-visible" aria-hidden>
      <g stroke="#111" strokeWidth="7" strokeLinecap="round" fill="none">
        {kick ? (
          <>
            <path d="M33 42 L14 58" />
            <path d="M67 42 L86 36" />
          </>
        ) : (
          <>
            <path d="M33 42 L24 80" />
            <path d="M67 42 L76 80" />
          </>
        )}
      </g>
      <g stroke="#111" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M42 112 L40 148" />
        {kick ? <path d="M58 112 L78 128 L96 116" /> : <path d="M58 112 L60 148" />}
      </g>
      <ellipse cx="38" cy="152" rx="10" ry="5" fill="#111" />
      {kick ? (
        <ellipse cx="97" cy="116" rx="6" ry="9" fill="#111" />
      ) : (
        <ellipse cx="62" cy="152" rx="10" ry="5" fill="#111" />
      )}
      <rect x="34" y="92" width="32" height="24" rx="3" fill="#111" />
      <path
        d="M32 38 Q50 32 68 38 L66 94 L34 94 Z"
        fill="#FF4A1C"
        stroke="#111"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <text
        x="50"
        y="76"
        textAnchor="middle"
        fontSize="26"
        fontWeight="900"
        fontFamily="'Frank Ruhl Libre', serif"
        fill="#111"
      >
        נ
      </text>
      <circle cx="50" cy="20" r="13" fill="#F4EFE6" stroke="#111" strokeWidth="3.5" />
      <path d="M38 16 Q50 3 62 16" stroke="#111" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Keeper() {
  return (
    <svg viewBox="0 0 60 80" className="block w-full overflow-visible" aria-hidden>
      <g stroke="#111" strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M20 26 L6 10" />
        <path d="M40 26 L54 10" />
        <path d="M26 52 L24 76" />
        <path d="M34 52 L36 76" />
      </g>
      <rect x="20" y="22" width="20" height="32" rx="3" fill="#111" />
      <circle cx="30" cy="13" r="9" fill="#F4EFE6" stroke="#111" strokeWidth="3" />
    </svg>
  );
}

export default function Football({ onMore, onHire }: GameProps) {
  const [phase, setPhase] = useState<Phase>("pick");
  const [target, setTarget] = useState<Corner | null>(null);

  useEffect(() => {
    if (phase === "run") {
      const t = window.setTimeout(() => setPhase("kick"), 750);
      return () => window.clearTimeout(t);
    }
    if (phase === "kick") {
      const t = window.setTimeout(() => setPhase("done"), 2400);
      return () => window.clearTimeout(t);
    }
  }, [phase]);

  const pick = (c: Corner) => {
    if (phase !== "pick") return;
    setTarget(c);
    setPhase("run");
  };

  const kicking = phase === "kick" || phase === "done";
  const midX = target ? START.x + (target.x - START.x) * 0.55 : START.x;
  const midY = target ? START.y + (target.y - START.y) * 0.55 : START.y;

  return (
    <div>
      <div className="relative mx-auto aspect-[4/3] w-full max-w-xl select-none overflow-hidden border-2 border-ink bg-paper-2">
        {/* מגרש ושער */}
        <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" aria-hidden>
          <rect x="0" y="135" width="400" height="165" fill="#F4EFE6" />
          <line x1="0" y1="135" x2="400" y2="135" stroke="#111" strokeWidth="3" />
          <rect x="60" y="135" width="280" height="115" fill="none" stroke="#111" strokeOpacity="0.4" strokeWidth="2" />
          <circle cx="200" cy="234" r="3.5" fill="#111" />
          <g stroke="#111" strokeOpacity="0.18" strokeWidth="1">
            {Array.from({ length: 13 }, (_, i) => (
              <line key={`v${i}`} x1={50 + i * 25} y1="40" x2={50 + i * 25} y2="135" />
            ))}
            {Array.from({ length: 6 }, (_, i) => (
              <line key={`h${i}`} x1="50" y1={40 + i * 19} x2="350" y2={40 + i * 19} />
            ))}
          </g>
          <g stroke="#111" strokeWidth="6" strokeLinecap="square">
            <line x1="50" y1="135" x2="50" y2="40" />
            <line x1="350" y1="135" x2="350" y2="40" />
            <line x1="47" y1="40" x2="353" y2="40" />
          </g>
        </svg>

        {/* שוער: מתנדנד, ואחרי הבעיטה צולל לצד השני */}
        <div className="absolute left-[44%] top-[22%] w-[12%]">
          <motion.div
            animate={
              kicking && target
                ? { x: target.x < 50 ? 90 : -90, rotate: target.x < 50 ? 70 : -70 }
                : { x: [-8, 8, -8], rotate: 0 }
            }
            transition={
              kicking && target
                ? { duration: 0.5, delay: 0.25 }
                : { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <Keeper />
          </motion.div>
        </div>

        {/* נקודות הפינה */}
        {phase === "pick" &&
          corners.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-label={`בעיטה ל${c.label}`}
              onClick={() => pick(c)}
              className="absolute z-10 h-12 w-12 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full border-2 border-accent bg-accent/15 transition active:scale-90"
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
            />
          ))}

        {/* השחקן */}
        <motion.div
          className="absolute bottom-[3%] w-[22%]"
          initial={false}
          animate={{ left: phase === "pick" ? "22%" : "32%", y: phase === "run" ? [0, -5, 0, -5, 0] : 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <Striker kick={kicking} />
        </motion.div>

        {/* הכדור: טס, מתפנצ'ר באמצע הדרך, נופל ושוכב */}
        <motion.div
          className="absolute w-[10%]"
          style={{ x: "-50%", y: "-50%" }}
          initial={false}
          animate={
            kicking && target
              ? {
                  left: [`${START.x}%`, `${midX}%`, `${midX}%`],
                  top: [`${START.y}%`, `${midY}%`, `${GROUND_Y}%`],
                }
              : { left: `${START.x}%`, top: `${START.y}%` }
          }
          transition={kicking ? { duration: 1.5, times: [0, 0.45, 1], ease: ["easeOut", "easeIn"] } : { duration: 0 }}
        >
          <motion.div
            className="aspect-square w-full"
            initial={false}
            animate={
              kicking
                ? { scaleX: [1, 0.75, 0.95, 1.05], scaleY: [1, 0.75, 0.34, 0.24] }
                : { scaleX: 1, scaleY: 1 }
            }
            transition={kicking ? { duration: 1.5, times: [0, 0.45, 0.62, 1] } : { duration: 0 }}
          >
            <SoccerBall />
          </motion.div>
        </motion.div>

        {/* פססססס */}
        {kicking && (
          <motion.span
            className="absolute z-10 font-serif text-lg font-black text-accent"
            style={{ left: `${midX}%`, top: `${midY - 9}%` }}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0], y: -26 }}
            transition={{ delay: 0.75, duration: 1.3 }}
          >
            פססססס…
          </motion.span>
        )}
      </div>

      <p className="mt-4 text-center text-sm text-ink/70" aria-live="polite">
        {phase === "pick" ? "בחרו פינה." : "מכוון..."}
      </p>

      {phase === "done" && (
        <GameOverModal
          message="אוי איזה פאדיחה, הכדור התפנצ'ר. מה תעשו עכשיו?"
          onMore={onMore}
          onHire={onHire}
        />
      )}
    </div>
  );
}
