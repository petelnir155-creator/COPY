// רצועת המותגים (Marquee).
// אם יש `logo` (נתיב בתוך public/logos/, עדיף SVG) מוצג הלוגו, אחרת השם כוורדמארק טיפוגרפי.
// TODO: להחליף ב-12 הלוגואים האמיתיים מהוויקס.

export type Brand = { name: string; logo?: string };

export const brands: Brand[] = [
  { name: "מקדונלד'ס" },
  { name: "דורקס" },
  { name: "פלאפון" },
  { name: "וניש" },
  { name: "מוזיאון הטבע" },
  { name: "ווינר" },
];
