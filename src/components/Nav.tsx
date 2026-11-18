import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "../data/site";
import { categories } from "../data/projects";
import type { Category } from "../data/projects";

const links = [
  { href: "#work", label: "עבודות" },
  { href: "#brands", label: "מותגים" },
  { href: "#/cv", label: "קורות" },
  { href: "#/games", label: "משחקונים" },
  { href: "#contact", label: "דברו איתי" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const close = () => setOpen(false);

  // נעילת גלילה, Esc לסגירה, והחזרת פוקוס לכפתור
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      menuBtn.current?.focus({ preventScroll: true });
    };
  }, [open]);

  // קישור-משנה לטאב ספציפי בעבודות: מעביר את הטאב ואז גולל
  const goToTab = (key: Category) => {
    window.dispatchEvent(new CustomEvent<Category>("site:set-tab", { detail: key }));
    close();
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper/90 backdrop-blur">
        <nav
          aria-label="ניווט ראשי"
          className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8"
        >
          <a href="#top" className="font-serif text-xl font-black leading-none">
            {site.name}
          </a>

          {/* דסקטופ */}
          <ul className="hidden items-center gap-6 text-base font-medium md:flex lg:gap-8">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="link-draw pb-0.5">
                  {l.label}
                </a>
              </li>
            ))}
            {/* הלשונית עם השם הארוך בכוונה: נגללת בתוך מסגרת קבועה */}
            <li>
              <a
                href="#/news"
                title={site.coverTabLabel}
                className="block w-44 border-2 border-ink px-3 py-1 text-sm transition hover:bg-ink hover:text-paper lg:w-64"
              >
                <span className="block overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]">
                  <span
                    dir="ltr"
                    className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none"
                    style={{ animationDuration: "18s" }}
                  >
                    {[0, 1].map((i) => (
                      <span key={i} dir="rtl" aria-hidden={i === 1} className="whitespace-nowrap pe-10">
                        {site.coverTabLabel}
                      </span>
                    ))}
                  </span>
                </span>
              </a>
            </li>
          </ul>

          {/* מובייל */}
          <button
            ref={menuBtn}
            type="button"
            onClick={() => setOpen(true)}
            aria-label="פתיחת תפריט"
            aria-expanded={open}
            className="flex items-center gap-2 border-2 border-ink px-3 py-1.5 text-sm font-medium transition active:scale-95 md:hidden"
          >
            תפריט
            <span aria-hidden className="flex flex-col gap-[3px]">
              <span className="block h-0.5 w-4 bg-ink" />
              <span className="block h-0.5 w-4 bg-ink" />
              <span className="block h-0.5 w-2.5 bg-accent" />
            </span>
          </button>
        </nav>
      </header>

      {/* התפריט הצדדי יושב מחוץ ל-header: backdrop-filter שם היה שובר את ה-fixed */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            className="fixed inset-0 z-50 bg-ink/60 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
          />
        )}
        {open && (
          <motion.aside
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="תפריט"
            className="fixed inset-y-0 start-0 z-50 flex w-[84%] max-w-sm flex-col overflow-y-auto border-e-2 border-ink bg-paper px-6 pb-8 pt-5 md:hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="font-serif text-xl font-black">{site.name}</span>
              <button
                ref={closeBtn}
                type="button"
                onClick={close}
                aria-label="סגירת תפריט"
                className="flex h-10 w-10 items-center justify-center border-2 border-ink text-lg transition active:scale-95"
              >
                ✕
              </button>
            </div>

            <ul className="space-y-5 font-serif text-4xl font-black leading-none">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  <a href={l.href} onClick={close} className="block py-1">
                    {l.label}
                  </a>

                  {l.href === "#work" && (
                    <ul className="mt-3 flex flex-wrap gap-2 font-sans text-base font-medium">
                      {categories.map((c) => (
                        <li key={c.key}>
                          <a
                            href="#work"
                            onClick={() => goToTab(c.key)}
                            className="inline-block border-2 border-ink px-3 py-1.5 transition active:bg-ink active:text-paper"
                          >
                            {c.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + links.length * 0.05, duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
                className="border-t-2 border-ink pt-5 font-sans text-lg font-medium leading-snug"
              >
                <a href="#/news" onClick={close} className="block">
                  {site.coverTabLabel} ↗
                </a>
              </motion.li>
            </ul>

            <div className="mt-auto space-y-4 pt-10">
              <div className="flex flex-wrap gap-2">
                <a
                  href={site.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-ink px-5 py-3 font-medium text-paper active:scale-[0.98]"
                >
                  וואטסאפ ↗
                </a>
                <a
                  href={site.cv}
                  download
                  className="inline-flex items-center gap-2 border-2 border-ink px-5 py-[10px] font-medium active:scale-[0.98]"
                >
                  קורות חיים ↓
                </a>
              </div>
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink/70">
                {site.socials.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="link-draw pb-0.5">
                      {s.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
