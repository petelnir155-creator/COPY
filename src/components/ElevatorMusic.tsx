import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { site } from "../data/site";

const bars = [0.9, 1.2, 0.7];

export default function ElevatorMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const a = audioRef.current;
    if (a) a.volume = 0.5;
    // כשמתחיל סרטון במודאל, המעלית נעצרת
    const pause = () => audioRef.current?.pause();
    window.addEventListener("site:video-start", pause);
    return () => window.removeEventListener("site:video-start", pause);
  }, []);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
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
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={`${site.music.label} ${site.music.hint}`}
        title={site.music.hint}
        className="fixed start-4 z-30 flex items-center gap-2.5 border-2 border-ink bg-paper px-3.5 py-2 text-sm font-medium shadow-[3px_3px_0_0_#111] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
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
    </>
  );
}
