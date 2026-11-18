import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

// כל משחקון מקבל את שני ה-callbacks האלה
export type GameProps = {
  onMore: () => void; // "משחקון נוסף": חזרה לרשימת המשחקונים
  onHire: () => void; // "אשמח להעסיק אותך": מעבר ל"השארת פרטים"
};

export default function GameOverModal({
  message,
  onMore,
  onHire,
}: GameProps & { message: string }) {
  const firstRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    firstRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onMore();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onMore]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        role="alertdialog"
        aria-modal="true"
        aria-label="הודעה מהמשחק"
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 26 }}
        className="w-full max-w-md border-2 border-ink bg-paper p-6 shadow-[6px_6px_0_0_#FF4A1C]"
      >
        <p className="font-fun text-2xl font-normal leading-snug sm:text-3xl">{message}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            ref={firstRef}
            type="button"
            onClick={onMore}
            className="border-2 border-ink px-5 py-3 font-medium transition hover:bg-ink hover:text-paper active:scale-[0.98]"
          >
            משחקון נוסף
          </button>
          <button
            type="button"
            onClick={onHire}
            className="bg-ink px-5 py-3 font-medium text-paper transition hover:bg-accent hover:text-ink active:scale-[0.98]"
          >
            אשמח להעסיק אותך
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
