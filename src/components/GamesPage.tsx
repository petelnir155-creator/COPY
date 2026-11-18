import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import { site } from "../data/site";
import Football from "./games/Football";
import Basketball from "./games/Basketball";
import TableTennis from "./games/TableTennis";
import type { GameProps } from "./games/GameOverModal";

// להוסיף משחקון: ליצור קומפוננטה ב-src/components/games/ שמקבלת { onMore, onHire }, ולהוסיף שורה כאן.
const games: { id: string; title: string; blurb?: string; Component: ComponentType<GameProps> }[] = [
  { id: "football", title: "דו-קרב פנדלים", blurb: "הבקעתם? קיבלתם תסריט בחצי מחיר!", Component: Football },
  { id: "basketball", title: "זריקת עונשין", blurb: "קלעתם לסל? קיבלתם גאנט בחינם ממני!", Component: Basketball },
  { id: "tabletennis", title: "טניס שולחן", Component: TableTennis },
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
        <h1 className="font-fun text-3xl font-normal leading-snug sm:text-5xl sm:leading-tight">
          בזמן שאתם מתלבטים כמה עבודות וכסף להביא לי, הכנתי לכם כמה משחקונים שינעימו את זמנכם.
        </h1>
      </div>

      {active ? (
        <section aria-label={active.title}>
          <div className="mb-6 flex items-center justify-between gap-4">
            <button type="button" onClick={backToList} className="link-draw pb-0.5 text-sm font-medium">
              ← למשחקונים
            </button>
            <h2 className="font-fun text-2xl font-normal">{active.title}</h2>
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
                <span className="block font-fun text-4xl font-normal leading-none">{g.title}</span>
                {g.blurb && <span className="mt-3 block text-base opacity-80">{g.blurb}</span>}
                <span className="mt-5 block text-sm font-medium text-accent">שחקו ↗</span>
              </button>
            </li>
          ))}
          <li>
            <div className="flex h-full min-h-[9rem] items-center border-2 border-dashed border-ink/40 p-5 font-fun text-2xl font-normal text-ink/50">
              ועוד משחקונים בהמשך...
            </div>
          </li>
        </ul>
      )}
    </div>
  );
}
