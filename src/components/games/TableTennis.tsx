import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GameOverModal from "./GameOverModal";
import type { GameProps } from "./GameOverModal";

// מגרש טניס רגיל בדשא. אדם עם מחבט ביד אחת ושולחן ביד השנייה.
// זורק את השולחן לאוויר, ובורח. הבמה 4:3 וה-SVG 400x300 ממופה עליה 1:1.

type Phase = "ready" | "thrown" | "done";
type Pose = "idle" | "throw" | "run";

function PingTable() {
  return (
    <svg viewBox="0 0 120 72" className="block w-full overflow-visible" aria-hidden>
      <g stroke="#111" strokeWidth="4" strokeLinecap="round">
        <line x1="14" y1="42" x2="10" y2="68" />
        <line x1="106" y1="42" x2="110" y2="68" />
        <line x1="34" y1="32" x2="32" y2="52" strokeOpacity="0.55" />
        <line x1="86" y1="32" x2="88" y2="52" strokeOpacity="0.55" />
      </g>
      <polygon points="14,16 106,16 118,42 2,42" fill="#1B1B1B" stroke="#111" strokeWidth="3" strokeLinejoin="round" />
      <polygon points="18,19 102,19 112,39 8,39" fill="none" stroke="#F4EFE6" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="60" y1="19" x2="60" y2="39" stroke="#F4EFE6" strokeWidth="1.5" />
      {/* רשת */}
      <rect x="6" y="22" width="108" height="10" fill="#F4EFE6" fillOpacity="0.85" stroke="#111" strokeWidth="1.5" />
      <g stroke="#111" strokeOpacity="0.35" strokeWidth="1">
        {Array.from({ length: 10 }, (_, i) => (
          <line key={i} x1={16 + i * 10} y1="22" x2={16 + i * 10} y2="32" />
        ))}
      </g>
      <line x1="6" y1="20" x2="6" y2="34" stroke="#111" strokeWidth="3" strokeLinecap="round" />
      <line x1="114" y1="20" x2="114" y2="34" stroke="#111" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function Player({ pose, step }: { pose: Pose; step: boolean }) {
  return (
    <svg viewBox="0 0 100 160" className="block w-full overflow-visible" aria-hidden>
      {/* מחבט (טניס רגיל) ביד שמאל */}
      <g>
        <line x1="20" y1="84" x2="9" y2="106" stroke="#111" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="5" cy="120" rx="10" ry="15" fill="#F4EFE6" fillOpacity="0.5" stroke="#FF4A1C" strokeWidth="3.5" />
        <g stroke="#111" strokeOpacity="0.3" strokeWidth="1">
          <line x1="5" y1="106" x2="5" y2="134" />
          <line x1="-4" y1="120" x2="14" y2="120" />
        </g>
      </g>
      <g stroke="#111" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* יד שמאל עם המחבט */}
        <path d="M33 44 L20 84" />
        {/* יד ימין: מחזיקה שולחן / זורקת / מתנופפת בריצה */}
        {pose === "idle" && <path d="M67 44 L84 64 L90 52" />}
        {pose === "throw" && <path d="M67 44 L88 16" />}
        {pose === "run" && <path d={step ? "M67 44 L82 58 L92 44" : "M67 44 L74 66 L68 84"} />}
      </g>
      <g stroke="#111" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {pose === "run" ? (
          step ? (
            <>
              <path d="M42 112 L28 136 L12 142" />
              <path d="M58 112 L72 128 L84 148" />
            </>
          ) : (
            <>
              <path d="M42 112 L52 132 L40 150" />
              <path d="M58 112 L78 124 L92 118" />
            </>
          )
        ) : (
          <>
            <path d="M42 112 L40 148" />
            <path d="M58 112 L60 148" />
          </>
        )}
      </g>
      {pose !== "run" && (
        <>
          <ellipse cx="38" cy="152" rx="11" ry="5.5" fill="#FF4A1C" stroke="#111" strokeWidth="2.5" />
          <ellipse cx="62" cy="152" rx="11" ry="5.5" fill="#FF4A1C" stroke="#111" strokeWidth="2.5" />
        </>
      )}
      <rect x="34" y="92" width="32" height="24" rx="3" fill="#F4EFE6" stroke="#111" strokeWidth="3" />
      <path
        d="M32 38 Q50 32 68 38 L66 94 L34 94 Z"
        fill="#F4EFE6"
        stroke="#111"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path d="M33 56 H67" stroke="#FF4A1C" strokeWidth="5" />
      <circle cx="50" cy="20" r="13" fill="#F4EFE6" stroke="#111" strokeWidth="3.5" />
      <path d="M38 16 Q50 3 62 16" stroke="#111" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M37 14 H63" stroke="#FF4A1C" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export default function TableTennis({ onMore, onHire }: GameProps) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [pose, setPose] = useState<Pose>("idle");
  const [step, setStep] = useState(false);

  useEffect(() => {
    if (phase !== "thrown") return;
    setPose("throw");
    const t1 = window.setTimeout(() => setPose("run"), 450);
    const t2 = window.setTimeout(() => setPhase("done"), 3400);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [phase]);

  // ריצה: מחליפים בין שתי תנוחות רגליים
  useEffect(() => {
    if (pose !== "run") return;
    const i = window.setInterval(() => setStep((s) => !s), 160);
    return () => window.clearInterval(i);
  }, [pose]);

  const thrown = phase !== "ready";

  return (
    <div>
      <div className="relative mx-auto aspect-[4/3] w-full max-w-xl select-none overflow-hidden border-2 border-ink bg-paper-2">
        {/* שיחים, דשא עם פסי כיסוח, קווי מגרש ורשת */}
        <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" aria-hidden>
          <rect x="0" y="0" width="400" height="165" fill="#EEE7DA" />
          {Array.from({ length: 15 }, (_, i) => (
            <circle key={i} cx={i * 28} cy={150 - (i % 3) * 4} r="22" fill={i % 2 ? "#B8D4BF" : "#A9C8B2"} />
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={i} x={i * 50} y="165" width="50" height="135" fill={i % 2 ? "#CFE3D4" : "#C3DBC9"} />
          ))}
          <g fill="none" stroke="#F4EFE6" strokeWidth="3.5" strokeLinejoin="round">
            <polygon points="78,172 322,172 392,292 8,292" />
            <line x1="200" y1="172" x2="200" y2="292" />
            <line x1="104" y1="218" x2="296" y2="218" />
          </g>
          {/* רשת הטניס */}
          <g>
            <rect x="46" y="150" width="308" height="26" fill="#F4EFE6" fillOpacity="0.4" />
            <g stroke="#111" strokeOpacity="0.3" strokeWidth="1">
              {Array.from({ length: 31 }, (_, i) => (
                <line key={i} x1={46 + i * 10} y1="150" x2={46 + i * 10} y2="176" />
              ))}
              <line x1="46" y1="163" x2="354" y2="163" />
            </g>
            <line x1="46" y1="150" x2="354" y2="150" stroke="#F4EFE6" strokeWidth="5" />
            <line x1="46" y1="146" x2="46" y2="180" stroke="#111" strokeWidth="5" strokeLinecap="round" />
            <line x1="354" y1="146" x2="354" y2="180" stroke="#111" strokeWidth="5" strokeLinecap="round" />
          </g>
        </svg>

        {/* השחקן: ניגש עם שולחן, זורק, בורח שמאלה */}
        <motion.div
          className="absolute bottom-[3%] w-[22%]"
          initial={false}
          animate={{ left: thrown ? "-35%" : "20%" }}
          transition={thrown ? { delay: 0.5, duration: 1.6, ease: "easeIn" } : { duration: 0 }}
        >
          <motion.div
            animate={pose === "run" ? { y: [0, -7, 0] } : { y: 0 }}
            transition={pose === "run" ? { duration: 0.32, repeat: Infinity } : { duration: 0.1 }}
          >
            <Player pose={pose} step={step} />
          </motion.div>
        </motion.div>

        {/* השולחן: ביד, ואז באוויר (יוצא מהמסגרת) ונוחת בכוח */}
        <motion.div
          className="absolute w-[30%]"
          style={{ x: "-50%", y: "-50%" }}
          initial={false}
          animate={
            thrown
              ? {
                  left: ["46%", "52%", "64%", "70%", "70%"],
                  top: ["58%", "-30%", "-34%", "78%", "78%"],
                  rotate: [0, 300, 560, 720, 720],
                }
              : { left: "46%", top: "58%", rotate: 0 }
          }
          transition={
            thrown
              ? { duration: 2.4, times: [0, 0.3, 0.55, 0.85, 1], ease: ["easeOut", "linear", "easeIn", "linear"] }
              : { duration: 0 }
          }
        >
          <PingTable />
        </motion.div>

        {thrown && (
          <>
            <motion.span
              className="absolute h-6 w-24 rounded-full bg-ink/20"
              style={{ left: "70%", top: "90%", x: "-50%", y: "-50%" }}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: [0, 0.7, 0], scale: [0.3, 1.4, 2] }}
              transition={{ delay: 2.0, duration: 0.9 }}
            />
            <motion.div
              className="absolute z-10 font-fun text-3xl font-normal"
              style={{ left: "58%", top: "52%" }}
              initial={{ scale: 0, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: -6, opacity: 1 }}
              transition={{ delay: 2.05, type: "spring", stiffness: 500, damping: 18 }}
            >
              קראש!
            </motion.div>
          </>
        )}
      </div>

      <div className="mt-4 flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-ink/70" aria-live="polite">
          {phase === "ready" ? "מחבט ביד אחת, שולחן ביד השנייה." : "..."}
        </p>
        <button
          type="button"
          onClick={() => setPhase((p) => (p === "ready" ? "thrown" : p))}
          disabled={phase !== "ready"}
          className="border-2 border-ink px-6 py-2.5 font-medium transition hover:bg-ink hover:text-paper active:scale-[0.98] disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink"
        >
          זרקו את השולחן
        </button>
      </div>

      {phase === "done" && (
        <GameOverModal
          message="אוקיי הורדתי את הקובץ הלא נכון באימיול. איך מתקדמים מכאן?"
          onMore={onMore}
          onHire={onHire}
        />
      )}
    </div>
  );
}
