import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import { motion } from "framer-motion";
import GameOverModal from "./GameOverModal";
import type { GameProps } from "./GameOverModal";
import { createTennis3D, IMPACT_T } from "./three/tennis3d";

// גרסת התלת-ממד של "טניס שולחן". בהחלקה כלפי מעלה (או חץ למעלה / Enter / רווח) הוא מגיש: זורק שולחן ובורח.
type Phase = "ready" | "thrown" | "done";

export default function TableTennis3D({ onMore, onHire, onFail }: GameProps & { onFail: () => void }) {
  const host = useRef<HTMLDivElement>(null);
  const ctrl = useRef<ReturnType<typeof createTennis3D> | null>(null);
  const [phase, setPhase] = useState<Phase>("ready");
  const [broken, setBroken] = useState(false);
  const [ump, setUmp] = useState({ x: 82, y: 36 });
  const [pl, setPl] = useState({ x: 22, y: 60 });
  const startY = useRef<number | null>(null);

  useEffect(() => {
    if (!host.current) return;
    let c: ReturnType<typeof createTennis3D> | null = null;
    try {
      c = createTennis3D(host.current, { onFail, onReady: (i) => {
          setUmp(i.ump);
          setPl(i.player);
        } });
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

  const serve = () => {
    if (phase !== "ready") return;
    ctrl.current?.serve();
    setPhase("thrown");
  };

  useEffect(() => {
    if (phase !== "thrown") return;
    const t2 = window.setTimeout(() => setBroken(true), IMPACT_T * 1000);
    const t3 = window.setTimeout(() => setPhase("done"), 3500);
    return () => {
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [phase]);

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
        <div ref={host} className="absolute inset-0" />

        {broken && (
          <>
            <motion.div
              className="absolute z-20 font-fun text-3xl font-normal text-paper drop-shadow-[0_2px_0_rgba(0,0,0,.55)]"
              style={{ left: `${pl.x + 8}%`, top: `${pl.y - 24}%` }}
              initial={{ scale: 0, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: -6, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 18 }}
            >
              קראש!
            </motion.div>
            {/* שופט הכיסא מכריז */}
            <motion.div
              className="absolute z-20 -translate-x-1/2 -translate-y-full border-2 border-ink bg-paper px-2 py-0.5 font-fun text-lg font-normal leading-tight"
              style={{ left: `${Math.min(ump.x, 86)}%`, top: `${Math.max(ump.y - 2, 12)}%` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 500, damping: 18 }}
            >
              אאוט!
            </motion.div>
          </>
        )}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 55%, transparent 55%, rgba(20,12,4,.45) 100%)" }}
        />

        {!thrown && (
          <div className="pointer-events-none absolute end-2.5 top-2.5 z-10 border-2 border-ink bg-paper px-2.5 py-1 text-sm font-bold">
            החליקו כדי להגיש
          </div>
        )}
        {!thrown && (
          <motion.div
            className="pointer-events-none absolute z-10 text-3xl font-black leading-none text-paper drop-shadow-[0_2px_0_rgba(0,0,0,.6)]"
            style={{ left: `${pl.x}%`, top: `${Math.max(pl.y - 32, 8)}%`, x: "-50%" }}
            animate={{ y: [0, -10, 0], opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            aria-hidden
          >
            ↑
          </motion.div>
        )}

        <div
          className="absolute bottom-0 left-0 z-10 h-[75%] w-[55%] cursor-grab touch-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
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
