import { useEffect, useState } from "react";
import { coverOf } from "../data/projects";
import { tiktokThumb } from "../lib/tiktokThumb";
import type { Project } from "../data/projects";

// קאבר טיפוגרפי לקמפיינים בלי תמונה/סרטון: דיו, אדום-כתום או נייר כהה
const typeStyles = [
  "bg-ink text-paper",
  "bg-accent text-ink",
  "bg-paper-2 text-ink",
];

export default function ProjectCard({
  project: p,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: () => void;
}) {
  // לסרטוני טיקטוק בלי קאבר ידני מנסים להביא תמונה ממוזערת. אם זה לא מצליח, נשאר הקאבר הטיפוגרפי
  const firstVideo = p.videos?.[0];
  const ttUrl = !p.cover && firstVideo?.provider === "tiktok" ? firstVideo.url : null;
  const [ttThumb, setTtThumb] = useState<string | null>(null);
  useEffect(() => {
    if (!ttUrl) return;
    let live = true;
    tiktokThumb(ttUrl).then((u) => live && setTtThumb(u));
    return () => {
      live = false;
    };
  }, [ttUrl]);
  const cover = coverOf(p) ?? ttThumb;
  const videoCount = p.videos?.length ?? 0;
  const imageCount = p.images?.length ?? 0;

  return (
    <button type="button" onClick={onOpen} className="group block w-full text-start">
      <div className="relative aspect-[4/3] overflow-hidden border-2 border-ink bg-paper-2">
        {cover ? (
          <img
            src={cover}
            alt=""
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div
            className={`flex h-full w-full flex-col justify-between p-5 pb-16 transition-transform duration-500 ease-out group-hover:scale-[1.03] ${
              typeStyles[index % typeStyles.length]
            }`}
          >
            <span className="font-sans text-sm opacity-70">{p.brand ?? " "}</span>
            <span className="font-serif text-3xl font-black leading-[1.05] sm:text-4xl">{p.title}</span>
          </div>
        )}

        {videoCount === 0 && imageCount > 1 && (
          <span className="absolute bottom-3 start-3 bg-ink px-3 py-1.5 text-xs font-medium text-paper transition-colors group-hover:bg-accent group-hover:text-ink">
            {imageCount} {p.category === "social" ? "פוסטים" : "מודעות"}
          </span>
        )}

        {videoCount > 0 && (
          <span className="absolute bottom-3 start-3 flex items-center gap-2 bg-ink px-3 py-1.5 text-xs font-medium text-paper transition-colors group-hover:bg-accent group-hover:text-ink">
            <span aria-hidden>▶</span>
            {videoCount > 1 ? `${videoCount} סרטונים` : "סרטון"}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-3">
        <div>
          {p.brand && <p className="mb-0.5 text-sm text-ink/60">{p.brand}</p>}
          <h3 className="font-serif text-2xl font-bold leading-tight">
            <span className="link-draw pb-0.5">{p.title}</span>
          </h3>
        </div>
        <span className="font-sans text-sm tabular-nums text-ink/45">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </button>
  );
}
