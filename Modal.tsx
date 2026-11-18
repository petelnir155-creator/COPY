import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { thumbOf } from "../data/projects";
import type { Project, Video } from "../data/projects";

// ---- נגן קליל: מציג פוסטר, ורק בלחיצה טוען iframe (חוסך משקל במובייל) ----
function Player({
  video,
  autoplay,
  onStart,
}: {
  video: Video;
  autoplay: boolean;
  onStart: () => void;
}) {
  const [on, setOn] = useState(autoplay);

  useEffect(() => {
    if (on) window.dispatchEvent(new Event("site:video-start"));
  }, [on]);

  if (video.provider === "link") {
    return (
      <div className="flex aspect-video w-full items-center justify-center bg-ink">
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-accent px-6 py-3 font-medium text-ink transition active:scale-[0.98]"
        >
          לצפייה ↗
        </a>
      </div>
    );
  }

  const src =
    video.provider === "youtube"
      ? `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
      : `https://player.vimeo.com/video/${video.id}?autoplay=1&dnt=1`;

  if (on) {
    return (
      <iframe
        title={video.label ?? "סרטון"}
        src={src}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        className="aspect-video w-full bg-ink"
      />
    );
  }

  const poster = thumbOf(video);
  return (
    <button
      type="button"
      onClick={() => {
        setOn(true);
        onStart();
      }}
      aria-label={`נגנו: ${video.label ?? "סרטון"}`}
      className="group relative block aspect-video w-full overflow-hidden bg-ink"
    >
      {poster && (
        <img src={poster} alt="" decoding="async" className="h-full w-full object-cover opacity-90" />
      )}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-xl text-ink transition-transform duration-300 group-hover:scale-110 group-active:scale-95">
          <span aria-hidden className="ms-[-3px]">▶</span>
        </span>
      </span>
    </button>
  );
}

export default function Modal({ project: p, onClose }: { project: Project; onClose: () => void }) {
  const videos = p.videos ?? [];
  const [active, setActive] = useState(0);
  const [started, setStarted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, [onClose]);

  const current = videos[active];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/75 sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={p.title}
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 32, opacity: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 34 }}
        className="relative max-h-[92dvh] w-full max-w-4xl overflow-y-auto border-2 border-ink bg-paper"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b-2 border-ink bg-paper px-5 py-4 sm:px-7">
          <div>
            {p.brand && <p className="text-sm text-ink/60">{p.brand}</p>}
            <h3 className="font-serif text-2xl font-black leading-tight sm:text-3xl">{p.title}</h3>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="סגירה"
            className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-ink text-lg transition hover:bg-ink hover:text-paper active:scale-95"
          >
            ✕
          </button>
        </div>

        <div className="px-5 pb-7 pt-5 sm:px-7">
          {current && (
            <Player
              key={`${active}-${started}`}
              video={current}
              autoplay={started}
              onStart={() => setStarted(true)}
            />
          )}

          {videos.length > 1 && (
            <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="סרטונים בקמפיין">
              {videos.map((v, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={i === active}
                  className={`border-2 border-ink px-4 py-2 text-sm font-medium transition active:scale-95 ${
                    i === active ? "bg-ink text-paper" : "hover:bg-paper-2"
                  }`}
                >
                  {v.label ?? `סרטון ${i + 1}`}
                </button>
              ))}
            </div>
          )}

          {p.blurb && <p className="mt-6 max-w-2xl text-lg leading-relaxed">{p.blurb}</p>}

          {p.parts && p.parts.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm text-ink/60">מה בפנים</p>
              <ul className="flex flex-wrap gap-2">
                {p.parts.map((part) => (
                  <li key={part} className="border-2 border-ink px-3 py-1.5 text-sm">
                    {part}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
