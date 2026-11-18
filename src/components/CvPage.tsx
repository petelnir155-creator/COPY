import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { site } from "../data/site";
import { timeline, timelineTail } from "../data/timeline";

const ease = [0.2, 0.7, 0.2, 1] as const;

export default function CvPage() {
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);

  // הקו האדום-כתום "נצבע" בזמן הגלילה
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const prev = document.title;
    document.title = "ניר פטל — קורות חיים";
    window.scrollTo(0, 0);
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-5 pb-20 pt-6 sm:px-8">
      <header className="flex items-center justify-between border-b-2 border-ink pb-4 text-sm">
        <a href="#top" className="font-serif text-xl font-black">
          {site.name}
        </a>
        <a href="#top" className="link-draw pb-0.5 font-medium">
          ← חזרה לאתר
        </a>
      </header>

      <div className="py-12 sm:py-16">
        <p className="mb-3 text-sm text-ink/60">הגרסה המלאה</p>
        <h1 className="font-serif text-6xl font-black leading-[0.95] sm:text-8xl">קורות חיים</h1>
        <p className="mt-6 max-w-xl text-lg text-ink/80">
          הגרסה הרשמית נמצאת בקובץ ה-PDF.{" "}
          <a href={site.cv} download className="link-draw pb-0.5 font-medium text-ink">
            הורדה
          </a>
          . הגרסה הזאת היא הנכונה יותר.
        </p>
      </div>

      <div className="relative">
        <div aria-hidden className="absolute inset-y-0 start-[7px] w-0.5 bg-ink/15" />
        <motion.div
          aria-hidden
          className="absolute inset-y-0 start-[7px] w-0.5 bg-accent"
          style={{ scaleY: reduce ? 1 : progress, transformOrigin: "top" }}
        />

        <ol ref={listRef} className="relative">
          {timeline.map((m) => (
            <motion.li
              key={m.when + m.text}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, ease }}
              className="relative pb-14 ps-10 sm:ps-14"
            >
              <span
                aria-hidden
                className="absolute start-0 top-3 h-4 w-4 rounded-full border-2 border-ink bg-paper"
              />
              <h2 className="font-serif text-3xl font-black leading-tight sm:text-5xl">{m.when}</h2>
              <p className="mt-3 max-w-xl text-lg leading-relaxed sm:text-2xl">{m.text}</p>
            </motion.li>
          ))}

          {timelineTail && (
            <li className="relative ps-10 sm:ps-14">
              <span
                aria-hidden
                className="absolute start-0 top-3 h-4 w-4 animate-pulse rounded-full bg-accent"
              />
              <p className="font-serif text-2xl font-bold text-ink/60 sm:text-3xl">{timelineTail}</p>
            </li>
          )}
        </ol>
      </div>

      <footer className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t-2 border-ink pt-6 text-sm">
        <a
          href={site.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-ink px-5 py-3 font-medium text-paper transition hover:bg-accent hover:text-ink active:scale-[0.98]"
        >
          וואטסאפ ↗
        </a>
        <a href="#top" className="link-draw pb-0.5 font-medium">
          ← חזרה לאתר
        </a>
      </footer>
    </div>
  );
}
