// רצועת המותגים (Marquee). הלוגואים של הלקוחות. הסדר כאן הוא הסדר ברצועה.
// הלוגואים הוחלפו לגרסאות איכותיות. אם יש לוגו שעדיין מטושטש (דורקס, פיאט), להחליף את הקובץ באותו שם.
// באותו שם (עדיף SVG או PNG גדול), או לעדכן כאן את הנתיב.

// mode: "gray" = אפור ברירת מחדל (ללוגו עם פרטים פנימיים), "mono" = צללית בצבע הדיו (ללוגו שטוח בצבע אחד).
// scale: תיקון אופטי לגודל (למשל 1.3 ללוגו שנראה קטן ביחס לשאר). בהובר תמיד חוזר הצבע המקורי.
export type Brand = { name: string; logo?: string; mode?: "gray" | "mono"; scale?: number };

export const brands: Brand[] = [
  { name: "מקדונלד'ס", logo: "/logos/mcdonalds.webp", mode: "mono", scale: 0.9 },
  { name: "פיניש", logo: "/logos/finish.webp" },
  { name: "yes", logo: "/logos/yes.webp", mode: "mono" },
  { name: "יטבתה", logo: "/logos/yotvata.webp" },
  { name: "מחסני חשמל", logo: "/logos/mahsanei-hashmal.webp", mode: "mono" },
  { name: "ווינר", logo: "/logos/winner.webp", scale: 0.9 },
  { name: "דורקס", logo: "/logos/durex.webp" },
  { name: "הוט סינמה", logo: "/logos/hot-cinema.webp" },
  { name: "וניש", logo: "/logos/vanish.webp" },
  { name: "אייס ACE", logo: "/logos/ace.webp", mode: "mono" },
  { name: "בנא משקאות", logo: "/logos/bana.webp" },
  { name: "פיאט", logo: "/logos/fiat.webp" },
  { name: "טיק טק", logo: "/logos/tic-tac.webp" },
  { name: "סימילאק", logo: "/logos/similac.webp" },
  { name: "בזק בינלאומי", logo: "/logos/bezeq-international.svg", mode: "mono" },
  { name: "מרפט", logo: "/logos/marpet.webp" },
  { name: "מוזיאון הטבע", logo: "/logos/museum.webp" },
  { name: "LG", logo: "/logos/lg.webp" },
  { name: "שופרסל טרוול", logo: "/logos/shufersal-travel.webp" },
  { name: "פלאפון", logo: "/logos/pelephone.webp" },
  { name: "בנק הפועלים", logo: "/logos/bank-hapoalim.webp" },
  { name: "פורינה", logo: "/logos/purina.webp" },
  { name: "איירוויק", logo: "/logos/airwick.webp" },
  { name: "BUG", logo: "/logos/bug.webp" },
  { name: "יאנגו דלי", logo: "/logos/yango-deli.webp", mode: "mono" },
  { name: "עיריית ירושלים", logo: "/logos/jerusalem.svg", mode: "mono", scale: 1.1 },
];


