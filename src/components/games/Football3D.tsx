import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import GameOverModal from "./GameOverModal";
import type { GameProps } from "./GameOverModal";
import { createFootball3D } from "./three/football3d";
import type { CornerId } from "./three/football3d";

// גרסת התלת-ממד של הפנדלים. אותה זרימה כמו הגרסה הדו-ממדית: בחירת פינה → ריצה → בעיטה → פאדיחה.
// אם WebGL לא זמין או נכשל, onFail מחזיר את המשחק לגרסת ה-SVG (ראו FootballGame.tsx).

type Phase = "pick" | "run" | "kick" | "done";
type Ctrl = ReturnType<typeof createFootball3D>;

const LABELS: Record<CornerId, string> = {
  tl: "פינה שמאלית עליונה",
  tr: "פינה ימנית עליונה",
  bl: "פינה שמאלית תחתונה",
  br: "פינה ימנית תחתונה",
};

export default function Football3D({ onMore, onHire, onFail }: GameProps & { onFail: () => void }) {
  const host = useRef<HTMLDivElement>(null);
  const ctrl = useRef<Ctrl | null>(null);
  const [phase, setPhase] = useState<Phase>("pick");
  const [target, setTarget] = useState<CornerId | null>(null);
  const [corners, setCorners] = useState<{ id: CornerId; x: number; y: number }[]>([]);
  const [fx, setFx] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!host.current) return;
    let c: Ctrl | null = null;
    try {
      c = createFootball3D(host.current, { onFail, onReady: setCorners });
      ctrl.current = c;
    } catch (e) {
      onFail();
    }
    return () => {
      c?.dispose();
      ctrl.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase === "run") {
      const t = window.setTimeout(() => setPhase("kick"), 950);
      return () => window.clearTimeout(t);
    }
    if (phase === "kick") {
      const t = window.setTimeout(() => setPhase("done"), 3100);
      return () => window.clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    if (!target) return;
    if (phase === "run" || phase === "kick") ctrl.current?.setPhase(phase, target);
    if (phase === "kick") setFx(ctrl.current?.screenOfPuncture(target) ?? null);
  }, [phase, target]);

  const pick = (id: CornerId) => {
    if (phase !== "pick") return;
    setTarget(id);
    setPhase("run");
  };

  const kicking = phase === "kick" || phase === "done";

  return (
    <div>
      <div className="relative mx-auto aspect-[4/3] w-full max-w-xl select-none overflow-hidden border-2 border-ink bg-ink">
        <div ref={host} className="absolute inset-0" />

        {/* נקודות הפינה: מטרה עם פלוס, ממוקמות לפי ההקרנה של פינות השער האמיתיות */}
        {phase === "pick" &&
          corners.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-label={`בעיטה ל${(LABELS as Record<string, string>)[c.id]}`}
              onClick={() => pick(c.id)}
              className="absolute z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 animate-pulse items-center justify-center rounded-full border-2 border-accent bg-ink/50 text-xl font-bold leading-none text-accent transition hover:scale-110 active:scale-90"
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
            >
              +
            </button>
          ))}

        {kicking && fx && (
          <motion.span
            className="absolute z-10 font-fun text-lg font-normal text-paper"
            style={{ left: `${fx.x}%`, top: `${fx.y - 8}%`, x: "-50%" }}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0], y: -26 }}
            transition={{ delay: 0.82, duration: 0.65 }}
          >
            פססססס…
          </motion.span>
        )}

        {/* קולנוע: וויניטה וגרגר פילם */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 55%, transparent 52%, rgba(0,0,0,.55) 100%)" }}
        />
        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full opacity-[.16] mix-blend-overlay">
          <filter id="fb3Grain">
            <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="5" />
            <feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  1.6 0 0 0 -.6" />
          </filter>
          <rect width="100%" height="100%" filter="url(#fb3Grain)" />
        </svg>

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
        <GameOverModal message="אוי איזה פאדיחה הכדור התפנצ'ר. טוב, מה עכשיו?" onMore={onMore} onHire={onHire} />
      )}
    </div>
  );
}
