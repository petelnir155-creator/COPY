// רצועת המותגים (Marquee). 12 הלוגואים מהאתר הישן, באותו סדר.
// הקבצים ב-public/logos/ נחתכו מצילומי מסך (איכות בינונית). כדי לשדרג: להחליף את הקובץ
// באותו שם (עדיף SVG או PNG גדול), או לעדכן כאן את הנתיב.

// mode: "gray" = אפור ברירת מחדל (ללוגו עם פרטים פנימיים), "mono" = צללית בצבע הדיו (ללוגו שטוח בצבע אחד).
// scale: תיקון אופטי לגודל (למשל 1.3 ללוגו שנראה קטן ביחס לשאר). בהובר תמיד חוזר הצבע המקורי.
export type Brand = { name: string; logo?: string; mode?: "gray" | "mono"; scale?: number };

export const brands: Brand[] = [
  { name: "וניש", logo: "/logos/vanish.png" },
  { name: "מחסני חשמל", logo: "/logos/mahsanei-hashmal.webp", mode: "mono" },
  { name: "שופרסל Online", logo: "/logos/shufersal.png" },
  { name: "דורקס", logo: "/logos/durex.png" },
  { name: "מקדונלד'ס", logo: "/logos/mcdonalds.webp", mode: "mono", scale: 0.9 },
  { name: "פלאפון", logo: "/logos/pelephone.png" },
  { name: "yes", logo: "/logos/yes.webp", mode: "mono" },
  { name: "בזק", logo: "/logos/bezeq.png" },
  { name: "פיאט", logo: "/logos/fiat.png" },
  { name: "כאל", logo: "/logos/cal.png" },
  { name: "LG", logo: "/logos/lg.png" },
  { name: "בזק בינלאומי", logo: "/logos/bezeq-international.svg", mode: "mono" },
  { name: "ווינר", logo: "/logos/winner.webp", scale: 0.9 },
];

// לקוחות מהקמפיינים שעוד אין להם לוגו ברצועה: מוזיאון הטבע, אייס ACE.
// כשיהיה לוגו: להעתיק לכאן שורה כמו למעלה.
