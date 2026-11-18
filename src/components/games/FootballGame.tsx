import { Component, lazy, Suspense, useState } from "react";
import type { ReactNode } from "react";
import Football from "./Football";
import type { GameProps } from "./GameOverModal";

// מנסה לטעון את גרסת התלת-ממד (three.js נטען רק כאן). אם הטעינה, ה-WebGL או הרינדור נכשלים,
// חוזרים אוטומטית לגרסת ה-SVG, כך שהמשחק אף פעם לא נשבר.
const Football3D = lazy(() => import("./Football3D"));

class Boundary extends Component<{ fallback: ReactNode; children: ReactNode }, { err: boolean }> {
  state = { err: false };
  static getDerivedStateFromError() {
    return { err: true };
  }
  render() {
    return this.state.err ? this.props.fallback : this.props.children;
  }
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
      <Suspense fallback={svg}>
        <Football3D {...props} onFail={() => setFailed(true)} />
      </Suspense>
    </Boundary>
  );
}
