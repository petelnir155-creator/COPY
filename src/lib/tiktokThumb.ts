// תמונה ממוזערת של סרטון טיקטוק, דרך ה-oEmbed הציבורי שלהם. אם זה נכשל (חסימה, CORS, בלי רשת) מחזירים null
// והאתר נשאר עם הקאבר הטיפוגרפי. הכתובת של התמונה מתחדשת בכל טעינה כי היא פגה אחרי זמן.
const cache = new Map<string, Promise<string | null>>();

export function tiktokThumb(url: string): Promise<string | null> {
  let p = cache.get(url);
  if (!p) {
    p = fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => (j && typeof j.thumbnail_url === "string" ? (j.thumbnail_url as string) : null))
      .catch(() => null);
    cache.set(url, p);
  }
  return p;
}
