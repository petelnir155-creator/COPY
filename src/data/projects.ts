// ============================================================
// כאן מוסיפים קמפיין חדש: מעתיקים בלוק, משנים, שומרים. זהו.
//
// שדות:
//   id        מזהה ייחודי (אנגלית, בלי רווחים)
//   title     שם הקמפיין
//   brand     (אופציונלי) שם המותג
//   category  "creative" | "social"
//   blurb     (אופציונלי) משפט-שניים
//   videos    (אופציונלי) רשימת סרטונים: yt("ID", "תווית") / vimeo("ID", "תווית") / link("URL", "תווית")
//   images    (אופציונלי) גלריה: img("/work/<id>/01.webp", "הסבר קצר מתחת לתמונה") . התמונה הראשונה היא גם הקאבר אם אין cover
//   parts     (אופציונלי) רשימת חלקים לקמפיינים בלי סרטון (פוסטים, מודעות)
//   cover     (אופציונלי) נתיב תמונת קאבר מתוך public/covers/ . בלי זה: מהסרטון הראשון, ואם אין, קאבר טיפוגרפי
// ============================================================

export type Category = "creative" | "social";

export type Video =
  | { provider: "youtube" | "vimeo"; id: string; label?: string }
  | { provider: "link"; url: string; label?: string }
  | { provider: "file"; src: string; poster?: string; label?: string };

export type Img = { src: string; caption?: string };

export type Project = {
  id: string;
  title: string;
  brand?: string;
  category: Category;
  blurb?: string;
  videos?: Video[];
  images?: Img[];
  parts?: string[];
  cover?: string;
};

const yt = (id: string, label?: string): Video => ({ provider: "youtube", id, label });
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const vimeo = (id: string, label?: string): Video => ({ provider: "vimeo", id, label });
const link = (url: string, label?: string): Video => ({ provider: "link", url, label });
const file = (src: string, poster?: string, label?: string): Video => ({ provider: "file", src, poster, label });
// מספר תמונות ממוספרות בתיקייה: gallery("vanish-posts", 6) => 01.webp ... 06.webp
const img = (src: string, caption?: string): Img => ({ src, caption });
const gallery = (id: string, n: number): Img[] =>
  Array.from({ length: n }, (_, i) => img(`/work/${id}/${String(i + 1).padStart(2, "0")}.webp`));
const cv = (id: string) => `/work/${id}/cover.webp`;
void vimeo; // זמין לשימוש עתידי

export const categories: { key: Category; label: string }[] = [
  { key: "creative", label: "קריאייטיב" },
  { key: "social", label: "סושיאל" },
];

export const projects: Project[] = [
  // ───────────── קריאייטיב ─────────────
  {
    id: "big-deal",
    title: "ביג דיל",
    brand: "מקדונלד'ס",
    category: "creative",
    videos: [
      yt("FB6vksIdDOg", "גלגל שלישי"),
      yt("Rx6o3cpSg0c", "ביג שף"),
      yt("TzpUIK7hDME", "אחיות"),
      yt("RgrZvJUYLl4", "אחות קוסמת"),
      yt("hzJjRUQYesg", "אח קטן"),
      yt("sPfQzs5zo3o", "מיני דג"),
      yt("Yr2nrf1wk7I", "אבא מוסרי"),
      yt("o0ChZdjy_SE", "על הפוטטו"),
    ],
  },
  {
    id: "chicken-big-mac",
    title: "צ'יקן ביג מק",
    brand: "מקדונלד'ס",
    category: "creative",
    videos: [
      yt("Me_cjYwjuf8", "צ'יקן ביג מק חזר"),
      yt("7aUwKLOyGq0", "עם רוטב ביג מק האגדי"),
    ],
  },
  {
    id: "rib-entrecote",
    title: "ריב אנטרקוט",
    brand: "מקדונלד'ס",
    category: "creative",
    videos: [
      yt("qNKwtn-kx5A", "רוטב אלבמה"),
      yt("xcGZFGX8r7s", "קראנץ' רויאל"),
    ],
  },
  {
    id: "mondial",
    title: "מונדיאל עשרים ו-יש!",
    brand: "ווינר",
    category: "creative",
    videos: [
      yt("Aa8ywhXXm0U", "משה"),
      yt("9PTa4m14vFc", "משורר"),
      yt("MzpTojMi3dg", "סאונדמן"),
    ],
  },
  {
    id: "adidas-ball",
    title: "הכדור הרשמי של המונדיאל",
    brand: "מקדונלד'ס",
    category: "creative",
    blurb: "בשביל כדור אדידס הרשמי של המונדיאל צריך רק מקדונלד'ס.",
    videos: [yt("lpa7Cqk9d5M")],
  },
  {
    id: "hot-honey",
    title: "הוט האני",
    brand: "מקדונלד'ס",
    category: "creative",
    videos: [yt("87lvVF9MUl4", "דרופ חדש")],
  },
  {
    id: "mac-nuggets-mix",
    title: "מק נאגטס מיקס",
    brand: "מקדונלד'ס",
    category: "creative",
    videos: [yt("FNK72GxUJoQ", "המיקס של הקיץ")],
  },
  {
    id: "ice-valentines",
    title: "עלה לכם מהולנטיינז?",
    brand: "אייס ACE",
    category: "creative",
    blurb: "בואו לאייס!",
    videos: [yt("Bpds-tzpAsk")],
  },
  {
    id: "winner",
    title: "ווינר חסות",
    brand: "ווינר",
    category: "creative",
    videos: [
      yt("teFP0ErBpns", "חסות 1"),
      yt("nSr1IVGrl_U", "חסות 2"),
      yt("qMlcenQAOS4", "חסות 3"),
    ],
  },
  {
    id: "igul-letova",
    title: "עיגול לטובה",
    category: "creative",
    cover: cv("igul-letova"),
    images: [
      img("/work/igul-letova/01.webp", "הכסף הקטן שלכם יכול לעזור לארגון \"לשובע\" להאכיל משפחות"),
      img("/work/igul-letova/02.webp", "הכסף הקטן שלכם יכול לעזור לארגון \"חסדי לב\" לתת מידע פיננסי למשפחות שרוצות לצאת ממעגל העוני"),
      img("/work/igul-letova/03.webp", "הכסף הקטן שלכם יכול לעזור לספרייה המרכזית לעיוורים וכבדי ראייה להנגיש עשרות אלפי ספרים"),
      img("/work/igul-letova/04.webp", "הכסף הקטן שלכם יכול לעזור לעמותת \"אור ירוק\" להציל חיים בכבישים"),
      img("/work/igul-letova/05.webp", "הכסף הקטן שלכם יכול לעזור לעמותת \"בית קובי\" לתמוך בחיילים בודדים"),
    ],
  },
  {
    id: "nature-museum-creative",
    title: "מוזיאון הטבע",
    brand: "מוזיאון הטבע",
    category: "creative",
    cover: cv("nature-museum-creative"),
    images: [
      img("/work/nature-museum-creative/01.webp", "בעקבות השריפות באמזונס, נכחדו המון מינים שלא היו מוכרים למדע"),
      img("/work/nature-museum-creative/02.webp", "מודעה ליום כדור הארץ, על דג זהב שמבקש משאלה: לא למות מפלסטיק"),
      img("/work/nature-museum-creative/03.webp", "מודעה לרגל 160 שנה ליציאת הספר של דרווין שסיפר בין היתר שדאגה לטבע היא דאגה עצמנו"),
    ],
  },
  {
    id: "tic-tac",
    title: "טיק טק: מירוץ לילה",
    brand: "טיק טק",
    category: "creative",
    cover: cv("tic-tac"),
    images: [
      img(
        "/work/tic-tac/01.webp",
        "המודעה הראשונה שעשיתי כקופי היא טיק טק נותנת חסות למירוץ הלילה וזה היה על שילוטים ברחבי תל אביב אז אני הצעיר נעמדתי בתחנות אוטובוס ליד אנשים ואמרתי בטלפון בקול \"כן כן אני פה ליד המודעה שהכנתי, מסתכל עליה, כן אני הכנתי\""
      ),
    ],
  },

  // ───────────── סושיאל ─────────────
  {
    id: "mega-crispy",
    title: "מגה קריספי צ'יקן חריף",
    brand: "מקדונלד'ס",
    category: "social",
    videos: [yt("_JQwf6Nc6Zc", "חדש במקדונלד'ס! חריף וחריף אששש!")],
  },
  {
    id: "crunchy-royale",
    title: "קראנצ'י קראנץ' רויאל",
    // TODO: לאשר מותג (כנראה מקדונלד'ס)
    category: "social",
    blurb: "ביס שכולו קראנץ'!",
    videos: [yt("wGMw9b2Jot4")],
  },
  {
    id: "noa-kirel",
    title: "סדרה או שתייה עם נועה קירל",
    category: "social",
    videos: [yt("13YX4tE38Ek")],
  },
  {
    id: "nature-museum-home",
    title: "מוזיאון הטבע בבית",
    brand: "מוזיאון הטבע",
    category: "social",
    cover: cv("nature-museum-home"),
    blurb:
      "בסגר הראשון של הקורונה, רצינו לתת לאנשים סיור במוזיאון - גם מהבית. אז עשינו הפקת צילומים לכל המוזיאון, ויצרנו עמוד אינסטגרם באווירת סיור, עם מידע על כל פרט ומעבר בין כל קטגוריה במוזיאון.",
    videos: [file("/work/nature-museum-home/tour.mp4", "/work/nature-museum-home/poster.webp", "הסיור")],
  },
  {
    id: "durex-tiktok",
    title: "דורקס בטיקטוק",
    brand: "דורקס",
    category: "social",
    parts: ["טיפים", "מזלות 2", "מזלות 3"],
    // TODO: לינקים לטיקטוקים: link("https://www.tiktok.com/...", "טיפים")
    videos: [],
  },
  {
    id: "pelephone-tiktok",
    title: "חנן בן ארי ואוראל צברי",
    brand: "פלאפון",
    category: "social",
    // TODO: לינק לטיקטוק
    videos: [],
  },
  {
    id: "vanish-posts",
    title: "וניש: פוסטים",
    brand: "וניש",
    category: "social",
    cover: cv("vanish-posts"),
    images: gallery("vanish-posts", 6),
  },
  {
    id: "nature-museum-posts",
    title: "מוזיאון הטבע: פוסטים",
    brand: "מוזיאון הטבע",
    category: "social",
    cover: cv("nature-museum-posts"),
    images: gallery("nature-museum-posts", 5),
  },
  {
    id: "shufersal-travel",
    title: "שופרסל טרוול: פוסטים",
    brand: "שופרסל טרוול",
    category: "social",
    cover: cv("shufersal-travel"),
    images: gallery("shufersal-travel", 6),
  },
  {
    id: "bezeq-international",
    title: "בזק בינלאומי: פוסטים",
    brand: "בזק בינלאומי",
    category: "social",
    cover: cv("bezeq-international"),
    images: gallery("bezeq-international", 8),
  },
  {
    id: "pelephone-posts",
    title: "פלאפון: פוסטים",
    brand: "פלאפון",
    category: "social",
    cover: cv("pelephone-posts"),
    images: gallery("pelephone-posts", 11),
  },
  {
    id: "durex-posts",
    title: "דורקס: פוסטים",
    brand: "דורקס",
    category: "social",
    cover: cv("durex-posts"),
    images: gallery("durex-posts", 10),
  },
  {
    id: "fiat-posts",
    title: "פיאט: פוסטים",
    brand: "פיאט",
    category: "social",
    cover: cv("fiat"),
    images: gallery("fiat", 7),
  },
  {
    id: "mahsanei-hashmal-posts",
    title: "מחסני חשמל: פוסטים",
    brand: "מחסני חשמל",
    category: "social",
    cover: cv("mahsanei-hashmal"),
    images: gallery("mahsanei-hashmal", 7),
  },
  {
    id: "eldan-post",
    title: "אלדן: פוסט",
    brand: "אלדן",
    category: "social",
    cover: cv("eldan"),
    images: gallery("eldan", 1),
  },
];

void link;
void img; // זמין לטיקטוקים ולינקים חיצוניים

// ---- עזרים ----

export const thumbOf = (v: Video): string | null =>
  v.provider === "youtube" ? `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg` : null;

export const coverOf = (p: Project): string | null => {
  if (p.cover) return p.cover;
  const first = p.videos?.find((v) => thumbOf(v));
  return first ? thumbOf(first) : null;
};
