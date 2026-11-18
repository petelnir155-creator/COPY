import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import { motion } from "framer-motion";
import GameOverModal from "./GameOverModal";
import type { GameProps } from "./GameOverModal";
import Svg from "./Svg";
import { table, tableLeg, tennisOverlay, tennisPlayer, tennisScene } from "./art/tennis";
import type { TennisPose } from "./art/tennis";

// מגרש טניס רגיל בדשא. אדם עם מחבט ביד אחת ושולחן (רגיל, מעץ) ביד השנייה.
// בהחלקה כלפי מעלה הוא "מגיש": זורק את השולחן כמעט ישר למעלה, מסתובב באוויר, ובורח.
// השולחן נופל בדיוק במקום שבו הוא עמד, על הגב (רגליים באוויר), ונשבר קצת.
// הבמה 4:3 וה-SVG 400x300 ממופה עליה 1:1. הגרפיקה ב-art/tennis.ts.

type Phase = "ready" | "thrown" | "done";

const LAND = { x: 31, y: 86 }; // מרכז השולחן כשהוא שוכב על הגב (אחוזים)
const FLIGHT = 2.0; // משך המעוף בשניות
const IMPACT = FLIGHT * 0.78; // רגע הנגיעה בקרקע

// רסיסי עץ: וקטורי התפזרות בפיקסלים
const splinters = [
  { dx: -46, dy: -52, r: 140, w: 9, h: 3 },
  { dx: -22, dy: -74, r: -90, w: 7, h: 3 },
  { dx: 10, dy: -64, r: 200, w: 10, h: 3 },
  { dx: 40, dy: -48, r: 60, w: 6, h: 4 },
  { dx: 62, dy: -22, r: -150, w: 8, h: 3 },
  { dx: -64, dy: -20, r: 110, w: 6, h: 3 },
  { dx: 24, dy: -36, r: -40, w: 5, h: 5 },
];

export default function TableTennis({ onMore, onHire }: GameProps) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [pose, setPose] = useState<TennisPose>("idle");
  const [step, setStep] = useState(false);
  const [broken, setBroken] = useState(false);
  const startY = useRef<number | null>(null);

  const serve = () => setPhase((p) => (p === "ready" ? "thrown" : p));

  useEffect(() => {
    if (phase !== "thrown") return;
    setPose("throw");
    const t1 = window.setTimeout(() => setPose("runA"), 380);
    const t2 = window.setTimeout(() => setBroken(true), IMPACT * 1000);
    const t3 = window.setTimeout(() => setPhase("done"), (FLIGHT + 1.5) * 1000);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [phase]);

  // ריצה: מחליפים בין שתי תנוחות רגליים
  useEffect(() => {
    if (pose !== "runA" && pose !== "runB") return;
    const i = window.setInterval(() => setStep((s) => !s), 150);
    return () => window.clearInterval(i);
  }, [pose]);
  const shownPose: TennisPose = pose === "runA" || pose === "runB" ? (step ? "runA" : "runB") : pose;

  // "החלקה למעלה" על אזור השחקן. גם מקלדת: חץ למעלה / Enter / רווח
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    startY.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    if (startY.current !== null && e.clientY - startY.current < -28) serve();
    startY.current = null;
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      serve();
    }
  };

  const thrown = phase !== "ready";

  return (
    <div>
      <div className="relative mx-auto aspect-[4/3] w-full max-w-xl select-none overflow-hidden border-2 border-ink bg-ink">
        {/* רעידת מצלמה בנחיתה */}
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={broken ? { x: [0, -4, 4, -3, 2, 0], y: [0, 3, -2, 2, -1, 0] } : { x: 0, y: 0 }}
          transition={{ duration: 0.5 }}
        >
        <Svg html={tennisScene()} viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" />

        {/* השולחן ביד: מאחורי הגוף, נתפס בקצה */}
        {!thrown && (
          <div
            className="absolute w-[24%] -translate-x-1/2 -translate-y-1/2"
            style={{ left: "39.5%", top: "74%" }}
          >
            <Svg html={table(false)} viewBox="0 0 120 80" />
          </div>
        )}

        {/* השחקן: ניגש עם שולחן, זורק, בורח שמאלה */}
        <motion.div
          className="absolute bottom-[3%] w-[20%]"
          initial={false}
          animate={{ left: thrown ? "-30%" : "12%" }}
          transition={thrown ? { delay: 0.45, duration: 1.5, ease: "easeIn" } : { duration: 0 }}
        >
          <motion.div
            animate={pose === "runA" || pose === "runB" ? { y: [0, -6, 0] } : pose === "idle" ? { y: [0, -2, 0] } : { y: 0 }}
            transition={pose === "runA" || pose === "runB" ? { duration: 0.3, repeat: Infinity } : pose === "idle" ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : { duration: 0.1 }}
          >
            <Svg html={tennisPlayer(shownPose)} viewBox="0 0 100 160" />
          </motion.div>
        </motion.div>

        {/* השולחן באוויר: זריקה כמעט אנכית עם סיבוב, נופל על הגב, קופץ קלות */}
        {thrown && (
          <motion.div
            className="absolute z-10 w-[24%]"
            style={{ x: "-50%", y: "-50%" }}
            initial={{ left: "39.5%", top: "74%", rotate: 0 }}
            animate={{
              left: ["39.5%", "40%", `${LAND.x}%`, `${LAND.x}%`, `${LAND.x}%`],
              top: ["74%", "17%", `${LAND.y}%`, `${LAND.y - 4}%`, `${LAND.y}%`],
              rotate: [0, 300, 540, 548, 540],
            }}
            transition={{
              duration: FLIGHT,
              times: [0, 0.42, 0.78, 0.88, 1],
              ease: ["easeOut", "easeIn", "easeOut", "easeIn"],
            }}
          >
            <Svg html={table(broken)} viewBox="0 0 120 80" />
          </motion.div>
        )}

        {/* ברגע הנחיתה: רגל שנשברה, רסיסים, אבק וקראש */}
        {broken && (
          <>
            <motion.div
              className="absolute z-10 w-[2.2%]"
              style={{ left: `${LAND.x + 9}%`, top: `${LAND.y - 4}%`, x: "-50%", y: "-50%" }}
              initial={{ x: "-50%", y: "-50%", rotate: 0, opacity: 1 }}
              animate={{ x: [0, 60, 95], y: [0, -70, 14], rotate: [0, 300, 520] }}
              transition={{ duration: 0.9, ease: "easeOut", times: [0, 0.45, 1] }}
            >
              <Svg html={tableLeg()} viewBox="0 0 9 37" />
            </motion.div>
            {splinters.map((s, i) => (
              <motion.span
                key={i}
                className="absolute z-10 rounded-[1px] bg-[#c99a6c]"
                style={{ left: `${LAND.x}%`, top: `${LAND.y - 3}%`, width: s.w, height: s.h }}
                initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                animate={{ x: s.dx, y: [0, s.dy, s.dy + 70], rotate: s.r, opacity: [1, 1, 0] }}
                transition={{ duration: 0.85, ease: "easeOut" }}
              />
            ))}
            <motion.span
              className="absolute h-5 w-28 rounded-full bg-paper/50"
              style={{ left: `${LAND.x}%`, top: `${LAND.y + 8}%`, x: "-50%", y: "-50%" }}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: [0, 0.8, 0], scale: [0.3, 1.4, 2.1] }}
              transition={{ duration: 0.9 }}
            />
            <motion.div
              className="absolute z-20 font-fun text-3xl font-normal text-ink"
              style={{ left: "42%", top: "44%" }}
              initial={{ scale: 0, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: -6, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 18 }}
            >
              קראש!
            </motion.div>
            {/* שופט הכיסא מכריז */}
            <motion.div
              className="absolute z-20 -translate-x-1/2 border-2 border-ink bg-paper px-2 py-0.5 font-fun text-lg font-normal leading-tight"
              style={{ left: "82%", top: "36%" }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 500, damping: 18 }}
            >
              אאוט!
            </motion.div>
          </>
        )}
        </motion.div>

        <Svg html={tennisOverlay()} viewBox="0 0 400 300" className="pointer-events-none absolute inset-0 h-full w-full" />

        {!thrown && (
          <div className="pointer-events-none absolute end-2.5 top-2.5 z-10 border-2 border-ink bg-paper px-2.5 py-1 text-sm font-bold">
            החליקו כדי להגיש
          </div>
        )}
        {!thrown && (
          <motion.div
            className="pointer-events-none absolute z-10 text-3xl font-black leading-none text-ink"
            style={{ left: "20%", top: "52%", x: "-50%" }}
            animate={{ y: [0, -10, 0], opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            aria-hidden
          >
            ↑
          </motion.div>
        )}

        {/* אזור ההחלקה */}
        <div
          className="absolute bottom-0 left-0 z-10 h-[70%] w-[55%] cursor-grab touch-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          role="button"
          tabIndex={thrown ? -1 : 0}
          aria-label="הגשה: החליקו כלפי מעלה, או לחצו על חץ למעלה"
          onPointerDown={onDown}
          onPointerUp={onUp}
          onPointerCancel={() => (startY.current = null)}
          onKeyDown={onKey}
        />
      </div>

      <p className="mt-4 text-center text-sm text-ink/70" aria-live="polite">
        {phase === "ready" ? "החליקו כדי להגיש." : "..."}
      </p>

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
