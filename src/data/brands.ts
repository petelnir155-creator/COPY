// רצועת המותגים (Marquee). 12 הלוגואים מהאתר הישן, באותו סדר.
// הקבצים ב-public/logos/ נחתכו מצילומי מסך (איכות בינונית). כדי לשדרג: להחליף את הקובץ
// באותו שם (עדיף SVG או PNG גדול), או לעדכן כאן את הנתיב.

export type Brand = { name: string; logo?: string };

export const brands: Brand[] = [
  { name: "וניש", logo: "/logos/vanish.png" },
  { name: "מחסני חשמל", logo: "/logos/mahsanei-hashmal.png" },
  { name: "שופרסל Online", logo: "/logos/shufersal.png" },
  { name: "דורקס", logo: "/logos/durex.png" },
  { name: "מקדונלד'ס", logo: "/logos/mcdonalds.png" },
  { name: "פלאפון", logo: "/logos/pelephone.png" },
  { name: "yes", logo: "/logos/yes.png" },
  { name: "בזק", logo: "/logos/bezeq.png" },
  { name: "פיאט", logo: "/logos/fiat.png" },
  { name: "כאל", logo: "/logos/cal.png" },
  { name: "LG", logo: "/logos/lg.png" },
  { name: "בזק בינלאומי", logo: "/logos/bird.png" },
];

// לקוחות מהקמפיינים שעוד אין להם לוגו ברצועה: מוזיאון הטבע, ווינר, אייס ACE.
// כשיהיה לוגו: להעתיק לכאן שורה כמו למעלה.
