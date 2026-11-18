import { Component, lazy, Suspense, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import type { GameProps } from "./GameOverModal";

// עוטף משחק תלת-ממד: מתחיל לטעון את הקוד מיד כשהקובץ נטען (כניסה לעמוד המשחקים),
// מציג מסגרת כהה בזמן הטעינה, ואם משהו נכשל (WebGL, טעינה, רינדור) חוזר לגרסת ה-SVG.

class Boundary extends Component<{ fallback: ReactNode; children: ReactNode }, { err: boolean }> {
  state = { err: false };
  static getDerivedStateFromError() {
    return { err: true };
  }
  render() {
    return this.state.err ? this.props.fallback : this.props.children;
  }
}

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

export default function with3D(
  Svg: ComponentType<GameProps>,
  loading: Promise<{ default: ComponentType<GameProps & { onFail: () => void }> }>
): ComponentType<GameProps> {
  loading.catch(() => {});
  const Lazy = lazy(() => loading);
  return function Game3D(props: GameProps) {
    const [failed, setFailed] = useState(() => !webglOk());
    const svg = <Svg {...props} />;
    if (failed) return svg;
    return (
      <Boundary fallback={svg}>
        <Suspense fallback={<Placeholder />}>
          <Lazy {...props} onFail={() => setFailed(true)} />
        </Suspense>
      </Boundary>
    );
  };
}
