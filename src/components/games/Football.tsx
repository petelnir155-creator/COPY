import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GameOverModal from "./GameOverModal";
import type { GameProps } from "./GameOverModal";
import Svg from "./Svg";
import { footballOverlay, footballScene, keeper, soccerBall, striker } from "./art/football";
import type { StrikerPose } from "./art/football";

// הבמה היא 4:3, וה-SVG בגודל 400x300 ממופה עליה 1:1, כך שאחוזים ויחידות SVG מתאימים.
// הגרפיקה עצמה (אצטדיון, שער, שחקנים) ב-art/football.ts.

type Phase = "pick" | "run" | "kick" | "done";
type Corner = { id: string; x: number; y: number; label: string };

// פינות השער (אחוזים מהבמה). השער נמתח מ-27.5% עד 72.5%, הקורה ב-23%, הקרקע ב-42.7%.
const corners: Corner[] = [
  { id: "tl", x: 33, y: 27, label: "פינה שמאלית עליונה" },
  { id: "tr", x: 67, y: 27, label: "פינה ימנית עליונה" },
  { id: "bl", x: 33, y: 38, label: "פינה שמאלית תחתונה" },
  { id: "br", x: 67, y: 38, label: "פינה ימנית תחתונה" },
];

const START = { x: 50, y: 77 }; // נקודת הפנדל

export default function Football({ onMore, onHire }: GameProps) {
  const [phase, setPhase] = useState<Phase>("pick");
  const [target, setTarget] = useState<Corner | null>(null);
  const [step, setStep] = useState(false);

  useEffect(() => {
    if (phase === "run") {
      const t = window.setTimeout(() => setPhase("kick"), 800);
      const i = window.setInterval(() => setStep((s) => !s), 130);
      return () => {
        window.clearTimeout(t);
        window.clearInterval(i);
      };
    }
    if (phase === "kick") {
      const t = window.setTimeout(() => setPhase("done"), 2700);
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
  const groundY = midY + 9;
  const pose: StrikerPose = kicking ? "kick" : phase === "run" ? (step ? "runA" : "runB") : "idle";

  return (
    <div>
      <div className="relative mx-auto aspect-[4/3] w-full max-w-xl select-none overflow-hidden border-2 border-ink bg-ink">
        {/* רעידת מצלמה קלה ברגע שהכדור מתפנצ'ר */}
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={kicking ? { x: [0, 0, -3, 3, -2, 2, 0] } : { x: 0 }}
          transition={kicking ? { duration: 1.3, delay: 0.7, times: [0, 0.15, 0.3, 0.5, 0.65, 0.8, 1] } : { duration: 0 }}
        >
        <Svg html={footballScene()} viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" />

        {/* שוער: מתנדנד, ואחרי הבעיטה צולל לצד השני */}
        <div className="absolute left-[44.5%] top-[22%] w-[11%]">
          <motion.div
            animate={
              kicking && target
                ? { x: target.x < 50 ? "200%" : "-200%", y: "-12%", rotate: target.x < 50 ? 72 : -72 }
                : { x: ["-14%", "14%", "-14%"], y: 0, rotate: 0 }
            }
            transition={
              kicking && target
                ? { duration: 0.5, delay: 0.25, ease: "easeOut" }
                : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <Svg html={keeper()} viewBox="0 0 60 80" />
          </motion.div>
        </div>

        {/* נקודות הפינה: מטרה עם פלוס */}
        {phase === "pick" &&
          corners.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-label={`בעיטה ל${c.label}`}
              onClick={() => pick(c)}
              className="absolute z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 animate-pulse items-center justify-center rounded-full border-2 border-accent bg-ink/50 text-xl font-bold leading-none text-accent transition hover:scale-110 active:scale-90"
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
            >
              +
            </button>
          ))}

        {/* צל הכדור על הדשא */}
        <span
          className="absolute h-[2.2%] w-[6%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/40 transition-opacity"
          style={{ left: `${START.x}%`, top: `${START.y + 2.6}%`, opacity: kicking ? 0 : 1 }}
        />

        {/* הבועט */}
        <motion.div
          className="absolute bottom-[-2%] w-[22%]"
          initial={false}
          animate={{ left: phase === "pick" ? "20%" : "33%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <motion.div
            animate={phase === "run" ? { y: [0, -4, 0] } : { y: 0 }}
            transition={phase === "run" ? { duration: 0.26, repeat: Infinity } : { duration: 0.1 }}
          >
            <Svg html={striker(pose)} viewBox="0 0 100 160" />
          </motion.div>
        </motion.div>

        {/* הכדור: טס, מתפנצ'ר באמצע הדרך, נופל ושוכב */}
        <motion.div
          className="absolute w-[6.5%]"
          style={{ x: "-50%", y: "-50%" }}
          initial={false}
          animate={
            kicking && target
              ? {
                  left: [`${START.x}%`, `${midX}%`, `${midX}%`],
                  top: [`${START.y}%`, `${midY}%`, `${groundY}%`],
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
                ? { scaleX: [1, 0.62, 0.64, 0.7], scaleY: [1, 0.62, 0.22, 0.15], rotate: [0, 300, 360, 360] }
                : { scaleX: 1, scaleY: 1, rotate: 0 }
            }
            transition={kicking ? { duration: 1.5, times: [0, 0.45, 0.62, 1] } : { duration: 0 }}
          >
            <Svg html={soccerBall()} viewBox="0 0 40 40" />
          </motion.div>
        </motion.div>

        {/* אבק בנחיתה ופססססס */}
        {kicking && (
          <>
            <motion.span
              className="absolute h-4 w-12 rounded-full bg-paper/30"
              style={{ left: `${midX}%`, top: `${groundY + 1}%`, x: "-50%", y: "-50%" }}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: [0, 0.7, 0], scale: [0.3, 1.5, 2.2] }}
              transition={{ delay: 1.3, duration: 0.8 }}
            />
            <motion.span
              className="absolute z-10 font-fun text-lg font-normal text-paper"
              style={{ left: `${midX}%`, top: `${midY - 9}%`, x: "-50%" }}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 1, 0], y: -26 }}
              transition={{ delay: 0.75, duration: 1.3 }}
            >
              פססססס…
            </motion.span>
            {/* אוויר שיוצא מהכדור */}
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="absolute h-2 w-2 rounded-full bg-paper/70"
                style={{ left: `${midX + 1}%`, top: `${midY}%` }}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
                animate={{ opacity: [0, 0.9, 0], x: 10 + i * 8, y: -(8 + i * 9), scale: [0.4, 1.2, 1.6] }}
                transition={{ delay: 0.72 + i * 0.12, duration: 0.7, ease: "easeOut" }}
              />
            ))}
          </>
        )}
        </motion.div>

        <Svg html={footballOverlay()} viewBox="0 0 400 300" className="pointer-events-none absolute inset-0 h-full w-full" />

        {/* שעון משדר */}
        <div className="pointer-events-none absolute start-2.5 top-2.5 z-20 flex items-stretch text-[11px] font-bold leading-none text-paper sm:text-xs">
          <span className="bg-accent px-2 py-1.5">פנדל</span>
          <span className="bg-ink/90 px-2 py-1.5 tabular-nums">90+4׳</span>
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-ink/70" aria-live="polite">
        {phase === "pick" ? "בחרו פינה." : "מכוון..."}
      </p>

      {phase === "done" && (
        <GameOverModal
          message="אוי איזה פאדיחה הכדור התפנצ'ר. טוב, מה עכשיו?"
          onMore={onMore}
          onHire={onHire}
        />
      )}
    </div>
  );
}
