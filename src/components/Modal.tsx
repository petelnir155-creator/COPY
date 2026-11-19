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

  if (video.provider === "file") {
    return (
      <video
        src={video.src}
        poster={video.poster}
        controls
        playsInline
        preload="metadata"
        className="mx-auto max-h-[70dvh] w-auto max-w-full bg-ink"
        onPlay={() => window.dispatchEvent(new Event("site:video-start"))}
      >
        <track kind="captions" />
      </video>
    );
  }

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

// ---- גלריית תמונות: חצים, החלקה, מקשי מקלדת וסרט תמונות קטנות ----
function Gallery({ images, title }: { images: { src: string; caption?: string }[]; title: string }) {
  const [i, setI] = useState(0);
  const n = images.length;
  const startX = useRef<number | null>(null);
  const strip = useRef<HTMLDivElement>(null);
  const go = (d: number) => setI((x) => (x + d + n) % n);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (n < 2) return;
      // RTL: חץ שמאלה = הבא
      if (e.key === "ArrowLeft") go(1);
      if (e.key === "ArrowRight") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  useEffect(() => {
    // טעינה מוקדמת של התמונה הבאה והקודמת
    [1, -1].forEach((d) => {
      const im = new Image();
      im.src = images[(i + d + n) % n].src;
    });
    const el = strip.current?.children[i] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [i, images, n]);

  const cur = images[i];
  return (
    <div>
      <div
        className="relative flex min-h-[40dvh] items-center justify-center bg-paper-2 py-3"
        onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (startX.current == null) return;
          const dx = e.changedTouches[0].clientX - startX.current;
          startX.current = null;
          // החלקה שמאלה = הבא (RTL)
          if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
        }}
      >
        <img
          key={cur.src}
          src={cur.src}
          alt={cur.caption ?? `${title}: ${i + 1} מתוך ${n}`}
          decoding="async"
          draggable={false}
          className="max-h-[68dvh] w-auto max-w-full select-none object-contain"
        />
        {n > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="הבא"
              className="absolute start-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border-2 border-ink bg-paper text-lg transition hover:bg-ink hover:text-paper active:scale-95"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="הקודם"
              className="absolute end-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border-2 border-ink bg-paper text-lg transition hover:bg-ink hover:text-paper active:scale-95"
            >
              →
            </button>
          </>
        )}
      </div>

      <div className="mt-3 flex items-start justify-between gap-4">
        <p className="min-h-[1.5rem] max-w-2xl text-lg leading-relaxed">{cur.caption}</p>
        {n > 1 && (
          <span className="shrink-0 font-sans text-sm tabular-nums text-ink/60" aria-live="polite">
            {i + 1} / {n}
          </span>
        )}
      </div>

      {n > 1 && (
        <div ref={strip} className="mt-3 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="בחירת תמונה">
          {images.map((im, k) => (
            <button
              key={im.src}
              type="button"
              onClick={() => setI(k)}
              aria-label={`תמונה ${k + 1}`}
              aria-current={k === i}
              className={`h-16 w-16 shrink-0 overflow-hidden border-2 transition ${
                k === i ? "border-accent" : "border-ink/30 opacity-70 hover:opacity-100"
              }`}
            >
              <img src={im.src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
            </button>
          ))}
        </div>
      )}
    </div>
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

          {p.images && p.images.length > 0 && (
            <div className={current ? "mt-6" : ""}>
              <Gallery images={p.images} title={p.title} />
            </div>
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
