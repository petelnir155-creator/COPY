import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { motion } from "framer-motion";
import GameOverModal from "./GameOverModal";
import type { GameProps } from "./GameOverModal";
import { createBasketball3D, TOTAL } from "./three/basketball3d";

// גרסת התלת-ממד של זריקת העונשין. אותו תסריט כמו ה-SVG: זריקה, הכדור נתקע, הקהל קופץ, ריפליי, פופ-אפ.
type Phase = "ready" | "thrown" | "done";

export default function Basketball3D({ onMore, onHire, onFail }: GameProps & { onFail: () => void }) {
  const host = useRef<HTMLDivElement>(null);
  const ctrl = useRef<ReturnType<typeof createBasketball3D> | null>(null);
  const [phase, setPhase] = useState<Phase>("ready");
  const [clock, setClock] = useState(24);
  const startY = useRef<number | null>(null);

  useEffect(() => {
    if (!host.current) return;
    let c: ReturnType<typeof createBasketball3D> | null = null;
    try {
      c = createBasketball3D(host.current, { onFail, onReady: () => {} });
      ctrl.current = c;
    } catch {
      onFail();
    }
    return () => {
      c?.dispose();
      ctrl.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase !== "thrown") return;
    const done = window.setTimeout(() => setPhase("done"), (TOTAL + 0.5) * 1000);
    const tick = window.setInterval(() => setClock((c) => Math.max(0, c - 1)), 130);
    return () => {
      window.clearTimeout(done);
      window.clearInterval(tick);
    };
  }, [phase]);

  const throwBall = () => {
    if (phase !== "ready") return;
    ctrl.current?.throwBall();
    setPhase("thrown");
  };
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
        <div ref={host} className="absolute inset-0" />

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
            {/* הדגשה: הכדור גדול מהחישוק ותקוע עליו (הזום מרכז אותו במסך) */}
            <motion.span
              aria-hidden
              className="pointer-events-none absolute aspect-square w-[24%] rounded-full border-[3px] border-accent"
              style={{ left: "50%", top: "50%", x: "-50%", y: "-50%" }}
              initial={{ opacity: 0, scale: 1.7 }}
              animate={{ opacity: [0, 1, 0.35, 1, 0.35, 1], scale: [1.7, 1, 1.08, 1, 1.08, 1] }}
              transition={{ delay: 2.0, duration: 1.5 }}
            />
          </>
        )}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 55% 50%, transparent 52%, rgba(0,0,0,.55) 100%)" }}
        />

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
