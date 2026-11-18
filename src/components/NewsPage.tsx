import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

// דף הכיסוי: "עולם הפרסום היומי". כאן עורכים את הטקסטים של הכתבות.

const today = new Intl.DateTimeFormat("he-IL", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(new Date());

const neutralIcon =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23555'/%3E%3Ctext x='32' y='46' font-size='38' font-family='serif' font-weight='900' text-anchor='middle' fill='%23fff'%3E%D7%A2%3C/text%3E%3C/svg%3E";

// מחליף כותרת לשונית ו-favicon כחלק מהבדיחה ("אתר חדשות"), ומחזיר אותם ביציאה
function useDisguise() {
  useEffect(() => {
    const prevTitle = document.title;
    const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    const prevHref = icon?.getAttribute("href") ?? null;
    document.title = "עולם הפרסום היומי";
    icon?.setAttribute("href", neutralIcon);
    window.scrollTo(0, 0);
    return () => {
      document.title = prevTitle;
      if (icon && prevHref) icon.setAttribute("href", prevHref);
    };
  }, []);
}

function Article({
  id,
  kicker,
  title,
  byline,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  byline: string;
  children: ReactNode;
}) {
  return (
    <article id={id} className="scroll-mt-6 border-t-2 border-ink py-10 sm:py-14">
      <p className="mb-3 text-sm font-bold text-accent">{kicker}</p>
      <h2 className="font-serif text-3xl font-black leading-[1.08] sm:text-5xl">{title}</h2>
      <p className="mb-8 mt-4 text-sm text-ink/60">{byline}</p>
      <div className="max-w-2xl space-y-5 text-lg leading-relaxed">{children}</div>
    </article>
  );
}

function Petition() {
  const [signed, setSigned] = useState(false);
  const goal = 1000;
  const count = signed ? 2 : 1;

  return (
    <div className="my-8 border-2 border-ink bg-paper-2 p-5">
      <p className="mb-3 font-serif text-xl font-bold">
        חתמו עד כה: <span className="tabular-nums">{count}</span> מתוך {goal.toLocaleString("he-IL")}
      </p>
      <div className="h-3 border-2 border-ink bg-paper" role="progressbar" aria-valuenow={count} aria-valuemin={0} aria-valuemax={goal}>
        <motion.div
          className="h-full bg-accent"
          initial={false}
          animate={{ width: `${Math.max((count / goal) * 100, 1.5)}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        />
      </div>
      <button
        type="button"
        disabled={signed}
        onClick={() => setSigned(true)}
        className="mt-4 bg-ink px-5 py-3 font-medium text-paper transition hover:bg-accent hover:text-ink active:scale-[0.98] disabled:cursor-default disabled:bg-ink/40 disabled:hover:text-paper"
      >
        {signed ? "תודה. זה לא יעזור, אבל תודה." : "אני חותם/ת: תנו לניר העלאה"}
      </button>
    </div>
  );
}

const tips = [
  "לשלוח את הטיוטה לפני הדדליין. לא הרבה לפני, רק מספיק כדי שיחשוב שזה תמיד קורה.",
  "להסכים עם הרעיון שלו בישיבה, ולהוסיף \"ואולי גם...\" כך שזה יהיה הרעיון שלו, רק טוב יותר.",
  "לתזמן מיילים ליום ראשון בשבע בבוקר. שיחשוב שאתה קם מוקדם.",
  "להגיד \"מעולה, שמתי לב לזה\" על כל דבר. גם כשלא שמת לב.",
  "להביא שלוש גרסאות לכותרת. הוא תמיד יבחר את השנייה, אז תדאג שהטובה תהיה שם.",
  "כשהוא שואל \"איפה זה עומד\", לענות \"כמעט שם\", ולוודא שיש שם משהו.",
  "קפה. בלי קשר לשום דבר. תמיד קפה.",
  "ולסיום: לא לפתוח בשעות העבודה אתרים שנראים כמו תיק עבודות. אם הוא מתקרב, לחצו על המקש מעל Tab.",
];

export default function NewsPage() {
  useDisguise();

  return (
    <div className="mx-auto max-w-4xl px-5 pb-16 pt-8 sm:px-8">
      <header className="border-b-4 border-double border-ink pb-6 text-center">
        <p className="mb-2 text-xs tracking-wide text-ink/60">{today}</p>
        <h1 className="font-serif text-5xl font-black leading-none sm:text-7xl">עולם הפרסום היומי</h1>
        <p className="mt-3 text-sm text-ink/70">הכל על התעשייה. אין כאן שום תיק עבודות.</p>
      </header>

      <nav aria-label="בגיליון היום" className="border-b border-ink/30 py-4 text-sm">
        <span className="font-bold">בגיליון היום: </span>
        <a href="#/news" onClick={(e) => { e.preventDefault(); document.getElementById("a1")?.scrollIntoView({ behavior: "smooth" }); }} className="link-draw">מגמות</a>
        <span className="mx-2 text-ink/40">·</span>
        <a href="#/news" onClick={(e) => { e.preventDefault(); document.getElementById("a2")?.scrollIntoView({ behavior: "smooth" }); }} className="link-draw">עצומה</a>
        <span className="mx-2 text-ink/40">·</span>
        <a href="#/news" onClick={(e) => { e.preventDefault(); document.getElementById("a3")?.scrollIntoView({ behavior: "smooth" }); }} className="link-draw">ניהול</a>
      </nav>

      <Article
        id="a1"
        kicker="מגמות"
        title="כל מה שחדש בעולם הפרסום! אם אתה קורא על זה אתה בטח עובד מעולה, ניר!"
        byline="מערכת עולם הפרסום היומי · 4 דקות קריאה (אבל ייראה כמו 40)"
      >
        <p>
          בשבוע האחרון קרו בתעשייה דברים. הרבה דברים. לא ניכנס לפרטים, אבל כולם חשובים, כולם דחופים, וכולם
          דורשים שתשב מול המסך בפרצוף מרוכז ותהנהן קלות.
        </p>
        <h3 className="pt-2 font-serif text-2xl font-bold">שלוש מגמות שאי אפשר להתעלם מהן</h3>
        <ol className="list-decimal space-y-4 ps-6 marker:font-bold marker:text-accent">
          <li>
            <strong>בינה מלאכותית.</strong> עוד. שוב. ובכל פעם שמישהו אומר "AI" בישיבה, כולם מהנהנים כאילו
            הבינו בדיוק למה הוא התכוון.
          </li>
          <li>
            <strong>הקמפיין שכולם מדברים עליו.</strong> מסתבר שאף אחד לא ממש ראה אותו. כולם מדברים עליו כי
            כולם שמעו שמדברים עליו.
          </li>
          <li>
            <strong>חזרה לבסיס.</strong> אחרי עשור של חידושים, התעשייה גילתה מחדש רעיון מהפכני: לכתוב משהו
            טוב, ולהראות אותו לאנשים.
          </li>
        </ol>
        <p>
          בנימה אישית: אם הגעת עד לכאן, ברור שאתה עוסק בעבודה חשובה ומקצועית. המשך כך. ואל תשכח להסתכל קצת
          בעיניים רציניות לפני שאתה גולל.
        </p>
        <p className="text-ink/60">המשך בעמוד הבא. (אין עמוד הבא.)</p>
      </Article>

      <Article
        id="a2"
        kicker="עצומה"
        title="תנו לניר העלאה! זה דף אמיתי!"
        byline="מטעם ועד הציבור הרחב (חבר ועד אחד) · קריאה של דקה, חתימה של שנייה"
      >
        <p>
          אנו, חברי הציבור הרחב, מבקשים לפנות בכבוד אל מי שאחראי על שכרו של ניר פטל, קופירייטר, מנהל סושיאל
          ואבא של דין, בבקשה פשוטה אחת: העלאה.
        </p>
        <h3 className="pt-2 font-serif text-2xl font-bold">נימוקים</h3>
        <ul className="list-disc space-y-3 ps-6 marker:text-accent">
          <li>ניר כתב מאות כותרות, והכי חשוב: הגיש אותן בזמן.</li>
          <li>ניר מצליח להרדים את דין ועדיין לשלוח את הטיוטה עד הבוקר.</li>
          <li>ניר כתב ג'ינגלים בגיל 12, בחינם. הגיע הזמן לסגור את הפער.</li>
          <li>העלאה תשפר מורל, תגביר יצירתיות ותביא עוד כותרות. מומחים מסכימים. מומחה אחד לפחות: ניר.</li>
        </ul>
        <Petition />
        <p className="text-sm text-ink/60">העצומה אינה מחייבת משפטית. היא כן מחייבת מוסרית.</p>
      </Article>

      <Article
        id="a3"
        kicker="ניהול"
        title="כל הדרכים לגרום למנהל שלך להיות מאושר"
        byline="מדור ניהול · שמונה טיפים, אחד מהם באמת עובד"
      >
        <p>
          מחקרים מראים (בלי לציין אילו) שמנהל מאושר הוא מנהל שמאשר. הנה הדרכים להגיע לשם:
        </p>
        <ol className="list-decimal space-y-4 ps-6 marker:font-bold marker:text-accent">
          {tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ol>
      </Article>

      <footer className="flex items-center justify-between border-t-2 border-ink pt-6 text-xs text-ink/50">
        <span>© עולם הפרסום היומי. כל הזכויות שמורות לעולם דמיוני.</span>
        <a href="#top" className="hover:text-ink">
          ← ניר
        </a>
      </footer>
    </div>
  );
}
