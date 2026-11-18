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
//   parts     (אופציונלי) רשימת חלקים לקמפיינים בלי סרטון (פוסטים, מודעות)
//   cover     (אופציונלי) נתיב תמונת קאבר מתוך public/covers/ . בלי זה: מהסרטון הראשון, ואם אין, קאבר טיפוגרפי
// ============================================================

export type Category = "creative" | "social";

export type Video =
  | { provider: "youtube" | "vimeo"; id: string; label?: string }
  | { provider: "link"; url: string; label?: string };

export type Project = {
  id: string;
  title: string;
  brand?: string;
  category: Category;
  blurb?: string;
  videos?: Video[];
  parts?: string[];
  cover?: string;
};

const yt = (id: string, label?: string): Video => ({ provider: "youtube", id, label });
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const vimeo = (id: string, label?: string): Video => ({ provider: "vimeo", id, label });
const link = (url: string, label?: string): Video => ({ provider: "link", url, label });
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
    title: "ווינר",
    brand: "ווינר",
    category: "creative",
    parts: ["נתוני הקמפיין יעלו בקרוב (בוויקס: סרטוני 6 ו-14 שניות, כמה גרסאות)"],
    // TODO: סרטונים או תמונות
  },
  {
    id: "igul-letova",
    title: "עיגול לטובה",
    category: "creative",
    parts: ["הספרייה לעיוורים", "חסדי לב", "לשובע", "אור ירוק"],
  },
  {
    id: "nature-museum-creative",
    title: "מוזיאון הטבע",
    brand: "מוזיאון הטבע",
    category: "creative",
    parts: ["אמזונס", "יום כדור הארץ", "דרווין"],
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
    blurb:
      "בסגר הראשון של הקורונה, רצינו למצוא דרך לתת לאנשים את הסיור במוזיאון - גם מהבית. צילומים מלאים של המוזיאון ועמוד אינסטגרם באווירת סיור.",
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
    parts: [
      "אירוויזיון",
      "יום העצמאות",
      "חיפה נגד פסז'",
      "שעון קיץ",
      "חולצה לבנה",
      "חזרה לגן",
      "אולימפיאדה",
      "ט\"ו באב",
      "שעון חורף",
    ],
  },
  {
    id: "nature-museum-posts",
    title: "מוזיאון הטבע: פוסטים",
    brand: "מוזיאון הטבע",
    category: "social",
    parts: ["פרה", "חודש הקניות", "ט\"ו באב", "יום כדור הארץ", "גיוון", "סוכות"],
  },
];

void link; // זמין לטיקטוקים ולינקים חיצוניים

// ---- עזרים ----

export const thumbOf = (v: Video): string | null =>
  v.provider === "youtube" ? `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg` : null;

export const coverOf = (p: Project): string | null => {
  if (p.cover) return p.cover;
  const first = p.videos?.find((v) => thumbOf(v));
  return first ? thumbOf(first) : null;
};
