import { brands } from "../data/brands";
import type { Brand } from "../data/brands";

// שתי שורות לוגואים שזזות בכיוונים הפוכים, בלי עצירה (גם לא בהובר).
// הלוגואים מתחלקים לסירוגין בין השורות כדי שהמשפחות יתערבבו. כל שורה מוכפלת פעם אחת ללולאה חלקה (-50%).
// משך הלולאה גדל עם כמות הלוגואים בשורה, כך שהמהירות קבועה (בערך 70 פיקסל לשנייה).
function Row({ items, reverse, offset }: { items: Brand[]; reverse?: boolean; offset: number }) {
  // אם יש מעט לוגואים בשורה, מכפילים אותם כדי למלא גם מסכים רחבים
  const unit = items.length >= 10 ? items : [...items, ...items];
  const track = [...unit, ...unit];
  const duration = `${Math.round(unit.length * 3.4)}s`;

  return (
    <div dir="ltr">
      <div
        dir="ltr"
        className="flex w-max animate-marquee items-center motion-reduce:animate-none"
        style={{
          animationDuration: duration,
          animationDirection: reverse ? "reverse" : "normal",
          animationDelay: `${offset}s`,
        }}
      >
        {track.map((b, i) => (
          <div key={i} dir="rtl" aria-hidden={i >= items.length} className="flex items-center gap-8 ps-8">
            {b.logo ? (
              // תיבה קבועה לכל לוגו: אותו גובה ורוחב מקסימלי, התמונה נכנסת פנימה (contain) בלי להימתח.
              // ברירת מחדל: אפור, בהובר צבע. "mono": צללית בצבע הדיו (ללוגו שטוח).
              <span className="flex h-14 w-36 items-center justify-center sm:h-16 sm:w-44">
                <img
                  src={b.logo}
                  alt={i < items.length ? b.name : ""}
                  loading="lazy"
                  decoding="async"
                  style={b.scale ? { transform: `scale(${b.scale})` } : undefined}
                  className={`max-h-full max-w-full object-contain transition duration-300 ${
                    b.mode === "mono"
                      ? "[filter:brightness(0)_opacity(.85)] hover:[filter:none]"
                      : "grayscale hover:grayscale-0"
                  }`}
                />
              </span>
            ) : (
              <span className="whitespace-nowrap font-serif text-4xl font-black sm:text-5xl">{b.name}</span>
            )}
            <span aria-hidden className="text-2xl text-accent">
              ✶
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Marquee() {
  const rowA = brands.filter((_, i) => i % 2 === 0);
  const rowB = brands.filter((_, i) => i % 2 === 1);

  return (
    <section
      id="brands"
      aria-labelledby="brands-title"
      className="scroll-mt-14 overflow-hidden border-y-2 border-ink py-10 sm:py-14"
    >
      <h2
        id="brands-title"
        className="mx-auto mb-8 max-w-6xl px-5 font-serif text-2xl font-bold sm:px-8 sm:text-3xl"
      >
        יצא לי לכתוב לכל מיני מותגים, למשל:
      </h2>

      {/* העטיפה ב-ltr קריטית: בדף RTL מסלול רחב נצמד לצד ימין, והאנימציה שמזיזה שמאלה חושפת רווח ריק */}
      <div className="space-y-3 sm:space-y-4">
        <Row items={rowA} offset={0} />
        <Row items={rowB} reverse offset={0} />
      </div>
    </section>
  );
}
