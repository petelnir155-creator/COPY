import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { motion } from "framer-motion";
import GameOverModal from "./GameOverModal";
import type { GameProps } from "./GameOverModal";
import Svg from "./Svg";
import { basketBall, basketCrowd, basketOverlay, basketScene, basketSky, basketTop, hooper, hoop } from "./art/basketball";

// הבמה 4:3, ה-SVG 400x300 ממופה עליה 1:1. הגרפיקה ב-art/basketball.ts.
// הכדור (16% מהרוחב = 64 יחידות) גדול מפתח החישוק (56 יחידות), לכן הוא נתקע.
// אם משנים את הגיאומטריה של החישוק (art/basketball.ts, hoop()), צריך לעדכן גם את RIM וגם את מיקום ה-div של החישוק.
//
// התסריט אחרי הזריקה (3.2 שניות, אותו ציר זמן לכל האלמנטים):
// הכדור עף בקשת, נתקע, החישוק שוקע, הקהל קופץ, המצלמה מתקרבת ב"ריפליי", ואז הפופ-אפ.

type Phase = "ready" | "thrown" | "done";

const HOLD = { x: 29.4, y: 68 }; // איפה הכדור ביד
const RIM = { x: 81, y: 29.3 }; // איפה הוא נתקע
const TOTAL = 3.2; // משך התסריט בשניות

export default function Basketball({ onMore, onHire }: GameProps) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [clock, setClock] = useState(24);
  const startY = useRef<number | null>(null);

  useEffect(() => {
    if (phase !== "thrown") return;
    const done = window.setTimeout(() => setPhase("done"), (TOTAL + 0.5) * 1000);
    const tick = window.setInterval(() => setClock((c) => Math.max(0, c - 1)), 130);
    return () => {
      window.clearTimeout(done);
      window.clearInterval(tick);
    };
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
      <div className="relative mx-auto aspect-[4/3] w-full max-w-xl select-none overflow-hidden border-2 border-ink bg-ink">
        {/* שכבת הסצנה: מתקרבת כולה בריפליי, סביב החישוק */}
        <motion.div
          className="absolute inset-0"
          style={{ transformOrigin: "80% 34%" }}
          initial={false}
          animate={thrown ? { scale: [1, 1, 1.75, 1.7] } : { scale: 1 }}
          transition={thrown ? { duration: TOTAL, times: [0, 0.38, 0.64, 1], ease: "easeInOut" } : { duration: 0 }}
        >
          <Svg html={basketSky()} viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" />
          {/* הקהל קופץ בזמן הזריקה וברגע הנתקעות */}
          <motion.div
            className="absolute inset-0"
            initial={false}
            animate={thrown ? { y: [0, 0, -7, 0, -8, 0, 0] } : { y: 0 }}
            transition={thrown ? { duration: TOTAL, times: [0, 0.1, 0.22, 0.34, 0.5, 0.62, 1] } : { duration: 0 }}
          >
            <Svg html={basketCrowd()} viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" />
          </motion.div>
          <Svg html={basketTop()} viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" />
          <Svg html={basketScene()} viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" />

          {/* חישוק: שוקע כלפי מטה כשהכדור תקוע */}
          <motion.div
            className="absolute"
            style={{ left: "72.5%", top: "37.33%", width: "16.5%", height: "21.33%", transformOrigin: "96% 12%" }}
            initial={false}
            animate={thrown ? { rotate: [0, 0, -2, -8, -6, -8, -7.4] } : { rotate: 0 }}
            transition={thrown ? { duration: TOTAL, times: [0, 0.37, 0.4, 0.46, 0.5, 0.56, 1] } : { duration: 0 }}
          >
            <Svg html={hoop()} viewBox="0 0 66 64" />
          </motion.div>

          {/* צל הכדור על הפרקט */}
          <motion.span
            className="pointer-events-none absolute h-[2.4%] w-[9%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/40"
            style={{ top: "93%" }}
            initial={false}
            animate={thrown ? { left: [`${HOLD.x}%`, "55%", `${RIM.x}%`], opacity: [0.5, 0.25, 0.4], scale: [1, 0.6, 0.8] } : { left: `${HOLD.x}%`, opacity: 0.5, scale: 1 }}
            transition={thrown ? { duration: 1.2, ease: "linear" } : { duration: 0 }}
          />

          {/* השחקן: קופץ בזריקה */}
          <div className="absolute bottom-[3%] left-[10%] w-[22%]">
            <motion.div
              initial={false}
              animate={thrown ? { y: [0, -9, 0] } : { y: [0, -2, 0] }}
              transition={thrown ? { duration: 0.55 } : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Svg html={hooper(thrown)} viewBox="0 0 100 160" />
            </motion.div>
          </div>

          {/* הכדור: קשת, נתקע על החישוק ושוקע איתו. שלושה צללים בהירים מאחוריו יוצרים שובל בזמן הטיסה */}
          {[3, 2, 1, 0].map((k) => (
            <motion.div
              key={k}
              className="pointer-events-none absolute w-[16%]"
              style={{ x: "-50%", y: "-50%" }}
              initial={false}
              animate={
                thrown
                  ? {
                      left: [`${HOLD.x}%`, "55%", `${RIM.x}%`, `${RIM.x}%`, `${RIM.x}%`, `${RIM.x}%`, `${RIM.x}%`],
                      top: [`${HOLD.y}%`, "14%", `${RIM.y}%`, `${RIM.y}%`, `${RIM.y + 2.4}%`, `${RIM.y + 1.4}%`, `${RIM.y + 1.9}%`],
                      rotate: [0, 300, 540, 540, 552, 540, 546],
                      ...(k > 0 ? { opacity: [0.28 - k * 0.07, 0.28 - k * 0.07, 0.2 - k * 0.05, 0, 0, 0, 0] } : {}),
                    }
                  : { left: `${HOLD.x}%`, top: `${HOLD.y}%`, rotate: 0, opacity: k > 0 ? 0 : 1 }
              }
              transition={
                thrown
                  ? {
                      duration: TOTAL,
                      delay: k * 0.045,
                      times: [0, 0.24, 0.37, 0.4, 0.46, 0.5, 1],
                      ease: ["easeOut", "easeIn", "linear", "easeOut", "easeInOut", "easeOut"],
                    }
                  : { duration: 0 }
              }
            >
              <div className="aspect-square w-full">
                <Svg html={basketBall()} viewBox="0 0 40 40" />
              </div>
            </motion.div>
          ))}

          {thrown && (
            <>
              <motion.div
                className="absolute z-10 font-fun text-3xl font-normal text-paper"
                style={{ left: "55%", top: "8%" }}
                initial={{ scale: 0, rotate: -12, opacity: 0 }}
                animate={{ scale: 1, rotate: -8, opacity: 1 }}
                transition={{ delay: 1.25, type: "spring", stiffness: 500, damping: 18 }}
              >
                בונק!
              </motion.div>
              {/* הדגשה: הכדור גדול מהחישוק ותקוע עליו */}
              <motion.span
                aria-hidden
                className="pointer-events-none absolute aspect-square w-[21%] rounded-full border-[3px] border-accent"
                style={{ left: `${RIM.x}%`, top: `${RIM.y + 1.5}%`, x: "-50%", y: "-50%" }}
                initial={{ opacity: 0, scale: 1.6 }}
                animate={{ opacity: [0, 1, 0.35, 1, 0.35, 1], scale: [1.6, 1, 1.08, 1, 1.08, 1] }}
                transition={{ delay: 1.35, duration: 1.6 }}
              />
            </>
          )}

        </motion.div>

        <Svg html={basketOverlay()} viewBox="0 0 400 300" className="pointer-events-none absolute inset-0 h-full w-full" />

        {/* שעון זריקה */}
        <div
          className={`pointer-events-none absolute left-1/2 top-2.5 z-20 -translate-x-1/2 border border-paper/30 bg-ink px-3 py-1 font-mono text-lg font-bold leading-none tabular-nums text-accent sm:text-xl ${
            thrown && clock === 0 ? "animate-pulse" : ""
          }`}
          aria-hidden
        >
          {String(clock).padStart(2, "0")}
        </div>

        {thrown && (
          <motion.div
            className="pointer-events-none absolute start-2.5 top-2.5 z-20 flex items-center gap-1.5 bg-accent px-2 py-1 text-[11px] font-bold leading-none text-paper sm:text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-paper" />
            ריפליי
          </motion.div>
        )}

        {!thrown && (
          <div className="pointer-events-none absolute end-2.5 top-12 z-10 border-2 border-paper bg-ink px-2.5 py-1 text-sm font-bold text-paper">
            החליקו כדי לזרוק
          </div>
        )}

        {/* אזור ההחלקה (touch-none רק כאן, כדי לא לחסום גלילה בשאר העמוד) */}
        <div
          className="absolute bottom-0 left-0 z-10 h-[65%] w-[50%] cursor-grab touch-none"
          onPointerDown={onDown}
          onPointerUp={onUp}
          onPointerCancel={() => (startY.current = null)}
          aria-hidden
        />
      </div>

      <div className="mt-4 flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-ink/70" aria-live="polite">
          {phase === "ready" ? "החליקו כדי לזרוק." : "..."}
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
