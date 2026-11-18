import { Component, lazy, Suspense, useState } from "react";
import type { ReactNode } from "react";
import Football from "./Football";
import type { GameProps } from "./GameOverModal";

// מנסה לטעון את גרסת התלת-ממד (three.js נטען רק כאן). אם הטעינה, ה-WebGL או הרינדור נכשלים,
// חוזרים אוטומטית לגרסת ה-SVG, כך שהמשחק אף פעם לא נשבר.
// הטעינה מתחילה ברגע שהקובץ הזה נטען (כניסה לעמוד המשחקים), עוד לפני שבוחרים משחק.
const loading = import("./Football3D");
loading.catch(() => {});
const Football3D = lazy(() => loading);

class Boundary extends Component<{ fallback: ReactNode; children: ReactNode }, { err: boolean }> {
  state = { err: false };
  static getDerivedStateFromError() {
    return { err: true };
  }
  render() {
    return this.state.err ? this.props.fallback : this.props.children;
  }
}

// בזמן הטעינה: מסגרת כהה באותו גודל, כדי שלא תהבהב גרסת ה-SVG
function Placeholder() {
  return <div className="mx-auto aspect-[4/3] w-full max-w-xl border-2 border-ink bg-ink" aria-hidden />;
}

function webglOk() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch {
    return false;
  }
}

export default function FootballGame(props: GameProps) {
  const [failed, setFailed] = useState(() => !webglOk());
  const svg = <Football {...props} />;
  if (failed) return svg;
  return (
    <Boundary fallback={svg}>
      <Suspense fallback={<Placeholder />}>
        <Football3D {...props} onFail={() => setFailed(true)} />
      </Suspense>
    </Boundary>
  );
}
