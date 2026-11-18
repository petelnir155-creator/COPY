import { brands } from "../data/brands";

export default function Marquee() {
  // שתי חצאים זהים, כל חצי חוזר פעמיים כדי למלא גם מסכים רחבים. האנימציה זזה 50% ללולאה חלקה.
  const half = [...brands, ...brands];
  const track = [...half, ...half];

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

      <div dir="ltr" className="flex w-max animate-marquee items-center hover:[animation-play-state:paused] motion-reduce:animate-none">
        {track.map((b, i) => (
          <div
            key={i}
            dir="rtl"
            aria-hidden={i >= brands.length}
            className="flex items-center gap-8 ps-8"
          >
            {b.logo ? (
              <img src={b.logo} alt={b.name} loading="lazy" className="h-9 w-auto opacity-80 grayscale" />
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
