import { motion } from "framer-motion";
import { site } from "../data/site";

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-14 bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <p className="mb-4 font-sans text-sm tabular-nums text-paper/60">02</p>
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
          className="max-w-4xl font-serif text-5xl font-black leading-[0.98] sm:text-8xl"
        >
          {site.contactTitle}
        </motion.h2>
        <p className="mt-6 max-w-xl text-lg text-paper/80 sm:text-xl">{site.contactSub}</p>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={site.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-accent px-7 py-4 text-lg font-bold text-ink transition hover:bg-paper active:scale-[0.98]"
          >
            וואטסאפ
            <span aria-hidden>↗</span>
          </a>
          <a
            href={site.cv}
            download
            className="inline-flex items-center gap-2 border-2 border-paper px-7 py-[14px] text-lg font-medium transition hover:bg-paper hover:text-ink active:scale-[0.98]"
          >
            קורות חיים (PDF)
            <span aria-hidden>↓</span>
          </a>
        </div>

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
        </p>
      </div>
    </section>
  );
}
