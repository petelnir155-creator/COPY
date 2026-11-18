import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { Project } from "./data/projects";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Work from "./components/Work";
import Marquee from "./components/Marquee";
import Contact from "./components/Contact";
import Modal from "./components/Modal";
import ElevatorMusic from "./components/ElevatorMusic";
import NewsPage from "./components/NewsPage";
import CvPage from "./components/CvPage";

const NEWS_HASH = "#/news";
const CV_HASH = "#/cv";

export default function App() {
  const [open, setOpen] = useState<Project | null>(null);
  const [hash, setHash] = useState(() => window.location.hash);
  const isNews = hash === NEWS_HASH;
  const isCv = hash === CV_HASH;

  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    // מקש מעל Tab (Backquote, בלי קשר לשפת המקלדת) מחליף בין האתר לדף הכיסוי
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Backquote" || e.metaKey || e.ctrlKey || e.altKey) return;
      window.location.hash = window.location.hash === NEWS_HASH ? "#top" : NEWS_HASH;
    };
    window.addEventListener("hashchange", onHash);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (isNews || isCv) setOpen(null);
    if (isNews) window.dispatchEvent(new Event("site:video-start")); // משתיק מוזיקה
    window.scrollTo(0, 0);
  }, [isNews, isCv]);

  // דף הכיסוי: בלי מוזיקה ובלי שום דבר אחר
  if (isNews) return <NewsPage />;

  return (
    <>
      {isCv ? (
        <CvPage />
      ) : (
        <>
          <a
            href="#work"
            className="sr-only focus:not-sr-only focus:fixed focus:start-3 focus:top-3 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
          >
            דלגו לתוכן
          </a>
          <Nav />
          <main>
            <Hero />
            <Work onOpen={setOpen} />
            <Marquee />
            <Contact />
          </main>
        </>
      )}
      {/* מוזיקת המעליות ממשיכה לנגן גם בעמוד הקורות */}
      <ElevatorMusic />
      <AnimatePresence>
        {open && <Modal key={open.id} project={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </>
  );
}
