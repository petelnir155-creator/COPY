import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { site } from "../data/site";

const ease = [0.2, 0.7, 0.2, 1] as const;

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>();

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
    } catch {
      // דפדפן ישן או הקשר לא מאובטח: בחירה ידנית בשדה זמני
      const t = document.createElement("textarea");
      t.value = site.email;
      t.style.position = "fixed";
      t.style.opacity = "0";
      document.body.appendChild(t);
      t.select();
      try {
        document.execCommand("copy");
      } catch {
        /* אין מה לעשות; הכתובת מוצגת גם בטקסט */
      }
      t.remove();
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section id="contact" className="scroll-mt-14 bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <p className="mb-4 font-sans text-sm tabular-nums text-paper/60">02</p>

        <h2 className="font-serif text-4xl font-black leading-tight sm:text-6xl">{site.contactIntro}</h2>
        <p className="mt-3 text-xl text-paper/80 sm:text-2xl">{site.contactCan}</p>

        <ul className="mt-8 grid max-w-3xl gap-x-10 gap-y-3 sm:grid-cols-2">
          {site.services.map((s, i) => (
            <motion.li
              key={s}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease }}
              className="flex items-baseline gap-3 border-b border-paper/20 pb-3 text-lg sm:text-xl"
            >
              <span aria-hidden className="font-sans text-sm tabular-nums text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              {s}
            </motion.li>
          ))}
        </ul>

        <motion.h3
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7, ease }}
          className="mt-16 max-w-4xl font-serif text-5xl font-black leading-[0.98] sm:mt-24 sm:text-8xl"
        >
          {site.contactTitle}
        </motion.h3>
        <p className="mt-5 max-w-xl text-xl text-paper/80 sm:text-2xl">{site.contactSub}</p>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={site.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] px-7 py-4 text-lg font-bold text-ink transition hover:bg-paper active:scale-[0.98]"
          >
            וואטסאפ
            <span aria-hidden>↗</span>
          </a>
          <a
            href={site.cv}
            download
            className="inline-flex items-center gap-2 px-3 py-4 text-lg underline underline-offset-4 decoration-paper/40 transition hover:decoration-accent"
          >
            קורות חיים (PDF)
            <span aria-hidden>↓</span>
          </a>
        </div>
        <div className="mt-8 inline-flex items-stretch border-2 border-paper/70">
          <span dir="ltr" className="select-all px-5 py-3 text-lg sm:text-xl">
            {site.email}
          </span>
          <button
            type="button"
            onClick={copyEmail}
            aria-label="העתק את כתובת המייל"
            className="flex min-w-[6.5rem] items-center justify-center gap-2 border-s-2 border-paper/70 px-4 text-base font-medium transition hover:bg-paper hover:text-ink active:scale-[0.98]"
          >
            {copied ? "הועתק" : "העתקה"}
            <span aria-hidden>{copied ? "✓" : "⧉"}</span>
          </button>
        </div>
        <span className="sr-only" role="status" aria-live="polite">
          {copied ? "הכתובת הועתקה" : ""}
        </span>

        <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-paper/25 pt-6 text-lg">
          {site.socials.map((s) => (
            <li key={s.href}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="link-draw pb-0.5">
                {s.label} ↗
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-sm text-paper/50">
          © {new Date().getFullYear()} {site.name}
          {" · "}
          <a href="#/a11y" className="underline underline-offset-4 hover:text-paper">
            הצהרת נגישות
          </a>
        </p>
      </div>
    </section>
  );
}
