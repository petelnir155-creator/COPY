import { brands } from "../data/brands";

export default function Marquee() {
  // שתי חצאים זהים, כל חצי חוזר פעמיים כדי למלא גם מסכים רחבים. האנימציה זזה 50% ללולאה חלקה.
  // עם הרבה לוגואים אין צורך להכפיל כל חצי. משך הלולאה גדל עם הכמות, כך שהמהירות קבועה
  // (בערך 70 פיקסל לשנייה) בין אם יש 12 לוגואים ובין אם 22.
  const half = brands.length >= 14 ? brands : [...brands, ...brands];
  const track = [...half, ...half];
  const duration = `${Math.round(half.length * 2.2)}s`;

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
        חלק מהמותגים שהסכימו לעבוד איתי
      </h2>

      <div
        dir="ltr"
        className="flex w-max animate-marquee items-center hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={{ animationDuration: duration }}
      >
        {track.map((b, i) => (
          <div
            key={i}
            dir="rtl"
            aria-hidden={i >= brands.length}
            className="flex items-center gap-8 ps-8"
          >
            {b.logo ? (
              // תיבה קבועה לכל לוגו: אותו גובה ורוחב מקסימלי, התמונה נכנסת פנימה (contain) בלי להימתח.
              // כך קבצים בגדלים ופורמטים שונים (PNG/WebP/SVG) נראים כמשפחה אחת.
              // ברירת מחדל: אפור, בהובר צבע. "mono": צללית בצבע הדיו (ללוגו שטוח, כולל צהוב).
              <span className="flex h-14 w-36 items-center justify-center sm:h-16 sm:w-44">
                <img
                  src={b.logo}
                  alt={i < brands.length ? b.name : ""}
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
    </section>
  );
}
