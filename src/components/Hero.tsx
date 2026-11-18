import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { site } from "../data/site";

const ease = [0.2, 0.7, 0.2, 1] as const;

export default function Hero() {
  const reduce = useReducedMotion();
  const [order, setOrder] = useState<number[]>(site.roles.map((_, i) => i));
  // אם התמונה עוד לא הועלתה (או נכשלה), כל מה שקשור לדין פשוט נעלם והמבנה לא נשבר
  const [photoOk, setPhotoOk] = useState(true);

  const shuffle = () => setOrder((o) => [o[o.length - 1], ...o.slice(0, -1)]);

  // "לא בהכרח בסדר הזה": אחרי רגע, הסדר באמת משתנה
  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(shuffle, 2200);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <section id="top" className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-16">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-4 text-sm font-medium tracking-wide text-ink/70"
      >
        {site.kicker}
      </motion.p>

      <h1 className="font-serif text-[clamp(5rem,27vw,17rem)] font-black leading-[0.85] tracking-tight">
        {/* ריפוד עליון + מרג'ין שלילי: המסכה גבוהה מספיק לא לחתוך את הקצה העליון של ל' */}
        <span className="-mt-[0.22em] block overflow-hidden pb-[0.08em] pt-[0.22em]">
          <motion.span
            className="block"
            initial={{ y: "130%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease }}
          >
            {site.name}
          </motion.span>
        </span>
      </h1>

      <div
        className={`mt-8 grid items-center gap-8 ${
          photoOk ? "md:grid-cols-[minmax(0,1fr)_15rem]" : ""
        }`}
      >
        <div>
          <ol className="font-serif text-3xl font-bold leading-tight sm:text-5xl">
            {order.map((roleIdx, pos) => (
              <motion.li
                key={roleIdx}
                layout={!reduce}
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
                className="flex items-baseline gap-3"
              >
                <span className="w-6 font-sans text-sm font-medium tabular-nums text-accent">
                  0{pos + 1}
                </span>
                <span>{site.roles[roleIdx]}</span>

                {/* החץ שייך ל"אבא של דין", אז הוא זז איתו כשהסדר מתחלף ומצויר מחדש */}
                {roleIdx === site.deanRoleIndex && photoOk && (
                  <svg
                    key={pos}
                    aria-hidden
                    className="hidden h-8 max-w-sm flex-1 self-center text-ink md:block"
                    viewBox="0 0 200 40"
                    preserveAspectRatio="none"
                    fill="none"
                  >
                    <motion.path
                      d="M196 24 C 150 6, 90 40, 14 20"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      initial={reduce ? undefined : ({ pathLength: 0 } as never)}
                      animate={{ pathLength: 1 } as never}
                      transition={{ duration: 0.7, delay: 0.35, ease }}
                    />
                    <motion.path
                      d="M14 20 L 32 8 M14 20 L 30 34"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      initial={reduce ? undefined : ({ pathLength: 0 } as never)}
                      animate={{ pathLength: 1 } as never}
                      transition={{ duration: 0.3, delay: 0.95, ease }}
                    />
                  </svg>
                )}
              </motion.li>
            ))}
          </ol>

          <button
            type="button"
            onClick={shuffle}
            className="link-draw mt-4 pb-0.5 text-sm text-ink/70"
            aria-label="ערבבו את סדר התפקידים"
          >
            ({site.rolesNote}) ↻
          </button>
        </div>

        {photoOk && (
          <motion.figure
            initial={{ opacity: 0, scale: 0.92, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            transition={{ duration: 0.7, delay: 0.5, ease }}
            className="mx-auto w-44 border-2 border-ink bg-paper p-2 shadow-[4px_4px_0_0_#111] md:w-full"
          >
            <img
              src={site.deanPhoto}
              alt={site.deanAlt}
              width={480}
              height={640}
              decoding="async"
              onError={() => setPhotoOk(false)}
              className="aspect-[3/4] w-full object-cover"
            />
          </motion.figure>
        )}
      </div>

      <div className="mt-14 max-w-2xl space-y-3 text-xl leading-relaxed sm:text-2xl">
        {site.jingle.map((line, i) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.6, delay: i * 0.12, ease }}
          >
            {line}
          </motion.p>
        ))}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.6, delay: 0.3, ease }}
          className="pt-2 font-serif text-2xl font-bold sm:text-3xl"
        >
          {site.jingleKicker}{" "}
          <span className="relative inline-block">
            <span className="relative z-10">{site.jingleKickerHighlight}</span>
            <svg
              aria-hidden
              className="absolute inset-x-0 -bottom-2 h-3 w-full text-accent"
              viewBox="0 0 300 12"
              preserveAspectRatio="none"
              fill="none"
            >
              <motion.path
                d="M2 8 C 60 2, 120 11, 180 5 S 270 6, 298 4"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                // cast: טיפוסי framer-motion מתנגשים עם pathLength של SVG
                initial={{ pathLength: 0 } as never}
                whileInView={{ pathLength: 1 } as never}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.6, ease }}
              />
            </svg>
          </span>
        </motion.p>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <a
          href={site.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-ink px-6 py-3.5 font-medium text-paper transition hover:bg-accent hover:text-ink active:scale-[0.98]"
        >
          וואטסאפ
          <span aria-hidden>↗</span>
        </a>
        <a
          href={site.cv}
          download
          className="inline-flex items-center gap-2 border-2 border-ink px-6 py-3 font-medium transition hover:bg-ink hover:text-paper active:scale-[0.98]"
        >
          קורות חיים (PDF)
          <span aria-hidden>↓</span>
        </a>
      </div>
    </section>
  );
}
