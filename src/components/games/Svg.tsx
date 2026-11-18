// עוטף את מחרוזות ה-SVG מתיקיית art (גרפיקה סטטית שנוצרת בקוד, בלי קלט משתמש).
export default function Svg({
  html,
  viewBox,
  className = "block h-full w-full",
}: {
  html: string;
  viewBox: string;
  className?: string;
}) {
  return (
    <svg
      viewBox={viewBox}
      className={className}
      aria-hidden
      focusable="false"
      overflow="visible"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
