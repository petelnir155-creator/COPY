import { useEffect } from "react";
import { site } from "../data/site";

const UPDATED = "19.11.2026";

export default function A11yPage() {
  useEffect(() => {
    const prev = document.title;
    document.title = "ניר פטל — הצהרת נגישות";
    window.scrollTo(0, 0);
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-5 pb-20 pt-6 sm:px-8">
      <header className="flex items-center justify-between border-b-2 border-ink pb-4 text-sm">
        <a href="#top" className="font-serif text-xl font-black">
          {site.name}
        </a>
        <a href="#top" className="link-draw pb-0.5 font-medium">
          ← חזרה לאתר
        </a>
      </header>

      <main className="py-12 sm:py-16">
        <h1 className="font-serif text-5xl font-black leading-[0.95] sm:text-7xl">הצהרת נגישות</h1>
        <p className="mt-6 text-sm text-ink/60">עודכן לאחרונה: {UPDATED}</p>

        <div className="mt-10 space-y-10 text-lg leading-relaxed">
          <section>
            <h2 className="mb-2 font-serif text-2xl font-bold">כוונה</h2>
            <p>
              חשוב לי שכל אחד יוכל להשתמש באתר הזה, כולל אנשים עם מוגבלות. האתר נבנה מתוך מחשבה על נגישות, ואני ממשיך
              לשפר אותו. האתר לא נבדק על ידי בודק נגישות מוסמך, ולכן אני לא טוען שהוא עומד בתקן במלואו.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-serif text-2xl font-bold">מה כבר קיים</h2>
            <ul className="list-disc space-y-1 ps-6">
              <li>האתר בעברית, מימין לשמאל, עם מבנה כותרות ברור ותגיות סמנטיות.</li>
              <li>אפשר לנווט בו עם המקלדת בלבד, כולל פתיחה וסגירה של חלון הפרויקט (Esc) ודפדוף בגלריה (חיצים).</li>
              <li>קישור "דלגו לתוכן" בתחילת הדף.</li>
              <li>לתמונות בגלריה יש טקסט חלופי, ולפעמים הסבר מתחתיהן.</li>
              <li>האתר מכבד את ההגדרה של המכשיר להפחתת תנועה.</li>
              <li>מוזיקת הרקע לא מתחילה לבד. היא מופעלת רק בלחיצה על הכפתור.</li>
              <li>האתר מותאם למסכים קטנים וגדולים, ואפשר להגדיל בו טקסט בדפדפן.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-serif text-2xl font-bold">מגבלות ידועות</h2>
            <ul className="list-disc space-y-1 ps-6">
              <li>
                עמוד המשחקונים כולל משחקים גרפיים בתלת מימד. הם לא נגישים לקורא מסך ולא מתאימים לשימוש במקלדת בלבד.
                אין בהם מידע שלא מופיע במקום אחר באתר.
              </li>
              <li>
                הסרטונים מתנגנים דרך יוטיוב, ואין לי שליטה מלאה על הכתוביות שלהם. לא בכל סרטון יש כתוביות או תמלול.
              </li>
              <li>
                בגלריות הסושיאל מוצגים צילומי מסך של פוסטים. הטקסט שבתוך התמונה לא תמיד נקרא על ידי קורא מסך, והכיתוב
                המלא של הפוסט מופיע רק כשיש הסבר מתחת לתמונה.
              </li>
              <li>קורות החיים בקובץ PDF לא נבדקו לנגישות מלאה. גרסה טקסטואלית שלהם נמצאת בעמוד קורות החיים באתר.</li>
              <li>חלק מהטקסטים הדקורטיביים באפור בהיר עשויים להיות קשים לקריאה למי שרואה בצורה חלקית.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-serif text-2xl font-bold">נתקלתם בבעיה?</h2>
            <p>
              אם משהו לא עובד לכם, או שיש משהו שאפשר לשפר, אשמח לשמוע. כתבו לי ואטפל בזה בהקדם האפשרי. אשמח לדעת מה
              ניסיתם לעשות, באיזה דף, ובאיזה דפדפן ומכשיר.
            </p>
            <p className="mt-3">
              ניר פטל, רכז הנגישות:{" "}
              <a href={`mailto:${site.email}`} className="link-draw pb-0.5 font-medium" dir="ltr">
                {site.email}
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
