import { useEffect, useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { categories, projects } from "../data/projects";
import type { Category, Project } from "../data/projects";
import ProjectCard from "./ProjectCard";

export default function Work({ onOpen }: { onOpen: (p: Project) => void }) {
  const [tab, setTab] = useState<Category>("creative");
  const list = useMemo(() => projects.filter((p) => p.category === tab), [tab]);

  // התפריט הצדדי במובייל מחליף טאב דרך אירוע
  useEffect(() => {
    const onSetTab = (e: Event) => {
      const key = (e as CustomEvent<Category>).detail;
      if (key === "creative" || key === "social") setTab(key);
    };
    window.addEventListener("site:set-tab", onSetTab);
    return () => window.removeEventListener("site:set-tab", onSetTab);
  }, []);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      setTab((t) => (t === "creative" ? "social" : "creative"));
    }
  };

  return (
    <section id="work" className="scroll-mt-14 border-t-2 border-ink">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 font-sans text-sm tabular-nums text-ink/60">01</p>
            <h2 className="font-serif text-5xl font-black leading-none sm:text-7xl">עבודות</h2>
          </div>
        </div>

        <div role="tablist" aria-label="סוג עבודות" onKeyDown={onKey} className="mb-10 flex gap-8 border-b-2 border-ink">
          {categories.map((c) => {
            const active = tab === c.key;
            return (
              <button
                key={c.key}
                role="tab"
                id={`tab-${c.key}`}
                aria-selected={active}
                aria-controls="work-panel"
                tabIndex={active ? 0 : -1}
                onClick={() => setTab(c.key)}
                className={`relative pb-3 font-serif text-2xl font-bold transition-colors sm:text-3xl ${
                  active ? "text-ink" : "text-ink/45 hover:text-ink/80"
                }`}
              >
                {c.label}
                {active && (
                  <motion.span
                    layoutId="tab-underline"
                    className="absolute inset-x-0 -bottom-[2px] h-1 bg-accent"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <motion.ul
          key={tab}
          id="work-panel"
          role="tabpanel"
          aria-labelledby={`tab-${tab}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
        >
          {list.map((p, i) => (
            <motion.li
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-6%" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.06, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <ProjectCard project={p} index={i} onOpen={() => onOpen(p)} />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
