import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { motion } from "framer-motion";
import GameOverModal from "./GameOverModal";
import type { GameProps } from "./GameOverModal";

// הבמה 4:3, ה-SVG 400x300 ממופה עליה 1:1.
// הכדור (16% מהרוחב = 64 יחידות) גדול מפתח החישוק (56 יחידות), לכן הוא נתקע.

type Phase = "ready" | "thrown" | "done";

const HOLD = { x: 29.4, y: 68 }; // איפה הכדור ביד
const RIM = { x: 81, y: 29.3 }; // איפה הוא נתקע

function BasketBall() {
  return (
    <svg viewBox="0 0 40 40" className="block h-full w-full" aria-hidden>
      <circle cx="20" cy="20" r="18" fill="#FF4A1C" stroke="#111" strokeWidth="2.5" />
      <g stroke="#111" strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M20 2 V38" />
        <path d="M2 20 H38" />
        <path d="M7 6 Q20 20 7 34" />
        <path d="M33 6 Q20 20 33 34" />
      </g>
    </svg>
  );
}

function Hooper({ throwing }: { throwing: boolean }) {
  return (
    <svg viewBox="0 0 100 160" className="block w-full overflow-visible" aria-hidden>
      <g stroke="#111" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {throwing ? (
          <>
            <path d="M33 42 L44 8" />
            <path d="M67 42 L84 4" />
          </>
        ) : (
          <>
            <path d="M33 44 L62 60 L82 58" />
            <path d="M67 44 L74 62 L82 60" />
          </>
        )}
      </g>
      <g stroke="#111" strokeWidth="9" strokeLinecap="round" fill="none">
        <path d="M42 112 L40 148" />
        <path d="M58 112 L60 148" />
      </g>
      <ellipse cx="38" cy="152" rx="10" ry="5" fill="#111" />
      <ellipse cx="62" cy="152" rx="10" ry="5" fill="#111" />
      <rect x="34" y="92" width="32" height="24" rx="3" fill="#111" />
      <path
        d="M32 38 Q50 32 68 38 L66 94 L34 94 Z"
        fill="#111"
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
        fill="#F4EFE6"
      >
        נ
      </text>
      <circle cx="50" cy="20" r="13" fill="#F4EFE6" stroke="#111" strokeWidth="3.5" />
      <path d="M38 16 Q50 3 62 16" stroke="#111" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default function Basketball({ onMore, onHire }: GameProps) {
  const [phase, setPhase] = useState<Phase>("ready");
  const startY = useRef<number | null>(null);

  useEffect(() => {
    if (phase !== "thrown") return;
    const t = window.setTimeout(() => setPhase("done"), 2600);
    return () => window.clearTimeout(t);
  }, [phase]);

  const throwBall = () => setPhase((p) => (p === "ready" ? "thrown" : p));

  // "בהחלקה": החלקה כלפי מעלה על אזור השחקן זורקת את הכדור
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    startY.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    if (startY.current !== null && e.clientY - startY.current < -28) throwBall();
    startY.current = null;
  };

  const thrown = phase !== "ready";

  return (
    <div>
      <div className="relative mx-auto aspect-[4/3] w-full max-w-xl select-none overflow-hidden border-2 border-ink bg-paper-2">
        {/* רצפה, עמוד, לוח, חישוק ורשת */}
        <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" aria-hidden>
          <rect x="0" y="262" width="400" height="38" fill="#F4EFE6" />
          <line x1="0" y1="262" x2="400" y2="262" stroke="#111" strokeWidth="3" />
          <line x1="356" y1="130" x2="356" y2="262" stroke="#111" strokeWidth="9" />
          <rect x="352" y="40" width="9" height="92" fill="#F4EFE6" stroke="#111" strokeWidth="3" />
          <g stroke="#111" strokeOpacity="0.45" strokeWidth="1.5" fill="none">
            <polygon points="296,120 352,120 340,172 308,172" />
            <line x1="310" y1="120" x2="316" y2="172" />
            <line x1="324" y1="120" x2="324" y2="172" />
            <line x1="338" y1="120" x2="332" y2="172" />
            <line x1="302" y1="146" x2="346" y2="146" />
          </g>
          <line x1="294" y1="120" x2="353" y2="120" stroke="#111" strokeWidth="6" strokeLinecap="round" />
        </svg>

        <div className="absolute end-3 top-3 z-10 border-2 border-ink bg-paper px-2.5 py-1 text-sm font-bold">
          בהחלקה, זרקו את הכדור
        </div>

        {/* השחקן */}
        <div className="absolute bottom-[3%] left-[10%] w-[22%]">
          <Hooper throwing={thrown} />
        </div>

        {/* אזור ההחלקה (touch-none רק כאן, כדי לא לחסום גלילה בשאר העמוד) */}
        <div
          className="absolute bottom-0 left-0 z-10 h-[65%] w-[50%] cursor-grab touch-none"
          onPointerDown={onDown}
          onPointerUp={onUp}
          onPointerCancel={() => (startY.current = null)}
          aria-hidden
        />

        {/* הכדור: קשת, נתקע על החישוק ורועד */}
        <motion.div
          className="pointer-events-none absolute w-[16%]"
          style={{ x: "-50%", y: "-50%" }}
          initial={false}
          animate={
            thrown
              ? {
                  left: [`${HOLD.x}%`, "55%", `${RIM.x}%`, `${RIM.x}%`, `${RIM.x}%`, `${RIM.x}%`],
                  top: [`${HOLD.y}%`, "12%", `${RIM.y}%`, `${RIM.y}%`, `${RIM.y - 1}%`, `${RIM.y}%`],
                  rotate: [0, 300, 540, 540, 552, 540],
                }
              : { left: `${HOLD.x}%`, top: `${HOLD.y}%`, rotate: 0 }
          }
          transition={
            thrown
              ? {
                  duration: 1.9,
                  times: [0, 0.4, 0.62, 0.7, 0.8, 1],
                  ease: ["easeOut", "easeIn", "linear", "easeOut", "easeIn"],
                }
              : { duration: 0 }
          }
        >
          <div className="aspect-square w-full">
            <BasketBall />
          </div>
        </motion.div>

        {thrown && (
          <motion.div
            className="absolute z-10 font-serif text-3xl font-black"
            style={{ left: "56%", top: "6%" }}
            initial={{ scale: 0, rotate: -12, opacity: 0 }}
            animate={{ scale: 1, rotate: -8, opacity: 1 }}
            transition={{ delay: 1.3, type: "spring", stiffness: 500, damping: 18 }}
          >
            בונק!
          </motion.div>
        )}
      </div>

      <div className="mt-4 flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-ink/70" aria-live="polite">
          {phase === "ready" ? "החליקו כלפי מעלה על השחקן, או לחצו על הכפתור." : "..."}
        </p>
        <button
          type="button"
          onClick={throwBall}
          disabled={phase !== "ready"}
          className="border-2 border-ink px-6 py-2.5 font-medium transition hover:bg-ink hover:text-paper active:scale-[0.98] disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink"
        >
          זרקו
        </button>
      </div>

      {phase === "done" && (
        <GameOverModal
          message="לא, אני לא מאמין. מי בנה את הסל הזה? הוא לא יעבוד יותר בעיר הזאת!!!"
          onMore={onMore}
          onHire={onHire}
        />
      )}
    </div>
  );
}
