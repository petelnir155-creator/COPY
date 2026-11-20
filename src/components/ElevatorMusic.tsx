import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { site } from "../data/site";

const bars = [0.9, 1.2, 0.7];

export default function ElevatorMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  // אם המוזיקה התנגנה כשהתחיל סרטון, היא תחזור לנגן כשחלון הסרטון נסגר
  const resumeAfterVideo = useRef(false);

  useEffect(() => {
    const a = audioRef.current;
    if (a) a.volume = 0.5;
    // כשמתחיל סרטון במודאל, המעלית נעצרת, וכשהחלון נסגר היא חוזרת (אם הייתה מנגנת קודם)
    const pause = () => {
      const el = audioRef.current;
      if (el && !el.paused) {
        resumeAfterVideo.current = true;
        el.pause();
      }
    };
    const resume = () => {
      const el = audioRef.current;
      if (resumeAfterVideo.current && el) {
        resumeAfterVideo.current = false;
        el.play().catch(() => {});
      }
    };
    window.addEventListener("site:video-start", pause);
    window.addEventListener("site:video-end", resume);
    return () => {
      window.removeEventListener("site:video-start", pause);
      window.removeEventListener("site:video-end", resume);
    };
  }, []);

  const restart = async () => {
    const a = audioRef.current;
    if (!a) return;
    resumeAfterVideo.current = false;
    a.currentTime = 0;
    try {
      setFailed(false);
      await a.play();
    } catch {
      setFailed(true);
    }
  };

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    // בחירה ידנית של הגולש גוברת על "להמשיך אחרי הסרטון"
    resumeAfterVideo.current = false;
    if (a.paused) {
      try {
        setFailed(false);
        await a.play();
      } catch {
        setFailed(true);
      }
    } else {
      a.pause();
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={site.music.src}
        preload="none"
        loop
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setFailed(true)}
      />
      <div className="fixed start-4 z-30 flex items-stretch gap-2" style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={`${site.music.label} ${site.music.hint}`}
        title={site.music.hint}
        className="flex items-center gap-2.5 border-2 border-ink bg-paper px-3.5 py-2 text-sm font-medium shadow-[3px_3px_0_0_#111] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
      >
        <span aria-hidden className="flex h-4 items-end gap-[3px] text-accent">
          {bars.map((d, i) => (
            <motion.span
              key={i}
              className="h-full w-[3px] origin-bottom bg-current"
              animate={playing ? { scaleY: [0.3, 1, 0.45, 0.9, 0.3] } : { scaleY: 0.3 }}
              transition={playing ? { duration: d, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
            />
          ))}
        </span>
        <span>{failed ? "המעלית תקועה" : playing ? "השתקה" : site.music.label}</span>
      </button>
      <button
        type="button"
        onClick={restart}
        aria-label="התחלה מחדש"
        title="התחלה מחדש"
        className="flex items-center justify-center border-2 border-ink bg-paper px-3 text-lg shadow-[3px_3px_0_0_#111] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
      >
        <span aria-hidden>↺</span>
      </button>
      </div>
    </>
  );
}
