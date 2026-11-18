import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import { site } from "../data/site";
import Football from "./games/Football";
import Basketball from "./games/Basketball";
import type { GameProps } from "./games/GameOverModal";

// להוסיף משחקון: ליצור קומפוננטה ב-src/components/games/ שמקבלת { onMore, onHire }, ולהוסיף שורה כאן.
const games: { id: string; title: string; blurb: string; Component: ComponentType<GameProps> }[] = [
  { id: "football", title: "כדורגל", blurb: "פנדלים. בחרו פינה.", Component: Football },
  { id: "basketball", title: "כדורסל", blurb: "החליקו. זרקו. תתפללו.", Component: Basketball },
];

export default function GamesPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = games.find((g) => g.id === activeId);

  useEffect(() => {
    const prev = document.title;
    document.title = "ניר פטל — משחקונים";
    window.scrollTo(0, 0);
    return () => {
      document.title = prev;
    };
  }, []);

  const backToList = () => {
    setActiveId(null);
    window.scrollTo(0, 0);
  };
  // "השארת פרטים": אזור הקשר בעמוד הראשי
  const hire = () => {
    window.location.hash = "#contact";
  };

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

      <div className="py-10 sm:py-14">
        <p className="mb-3 text-sm text-ink/60">משחקונים</p>
        <h1 className="font-serif text-3xl font-black leading-snug sm:text-5xl sm:leading-tight">
          בזמן שאתם מתלבטים כמה עבודות וכסף להביא לי, הכנתי לכם כמה משחקונים שינעימו את זמנכם. למקרה שמוזיקת
          המעליות לא עשתה את העבודה
        </h1>
      </div>

      {active ? (
        <section aria-label={active.title}>
          <div className="mb-6 flex items-center justify-between gap-4">
            <button type="button" onClick={backToList} className="link-draw pb-0.5 text-sm font-medium">
              ← למשחקונים
            </button>
            <h2 className="font-serif text-2xl font-black">{active.title}</h2>
          </div>
          <active.Component onMore={backToList} onHire={hire} />
        </section>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {games.map((g) => (
            <li key={g.id}>
              <button
                type="button"
                onClick={() => setActiveId(g.id)}
                className="group block w-full border-2 border-ink p-5 text-start transition hover:bg-ink hover:text-paper active:scale-[0.99]"
              >
                <span className="block font-serif text-4xl font-black leading-none">{g.title}</span>
                <span className="mt-3 block text-base opacity-80">{g.blurb}</span>
                <span className="mt-5 block text-sm font-medium text-accent">שחקו ↗</span>
              </button>
            </li>
          ))}
          <li>
            <div className="flex h-full min-h-[9rem] items-center border-2 border-dashed border-ink/40 p-5 font-serif text-2xl font-bold text-ink/50">
              ועוד משחקונים בהמשך...
            </div>
          </li>
        </ul>
      )}
    </div>
  );
}
