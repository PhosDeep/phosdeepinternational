"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

const FORMULAS = [
  "e^(i*pi) + 1 = 0",
  "integral e^(-x^2) dx = sqrt(pi)",
  "div E = rho / epsilon",
  "curl B = mu J + mu epsilon dE/dt",
  "i hbar dpsi/dt = H psi",
  "E = mc^2",
  "a^2 + b^2 = c^2",
  "P(A|B) = P(B|A) P(A) / P(B)",
  "det(A - lambda I) = 0",
  "delta x delta p >= hbar / 2",
  "n! ~= sqrt(2 pi n) (n/e)^n",
  "grad^2 phi = 0",
];

interface FormulaStreamProps {
  className?: string;
  style?: CSSProperties;
}

export default function FormulaStream({ className, style }: FormulaStreamProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!root || !canvas || !context) return;

    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let lastTime = 0;
    let offset = 0;
    let pointerX = 0;
    let pointerY = 0;
    let pointerActive = false;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = root.clientWidth;
      height = root.clientHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = root.getBoundingClientRect();
      pointerX = event.clientX - bounds.left;
      pointerY = event.clientY - bounds.top;
      pointerActive = true;
    };
    const onPointerLeave = () => {
      pointerActive = false;
    };

    const draw = (time: number) => {
      const delta = lastTime ? Math.min(0.05, (time - lastTime) / 1000) : 0;
      lastTime = time;
      offset = (offset + delta * 8) % 320;
      context.clearRect(0, 0, width, height);
      context.font = "italic 13px Georgia, serif";
      context.textBaseline = "middle";

      const rows = Math.max(8, Math.ceil(height / 58));
      for (let row = 0; row < rows; row += 1) {
        const baseY = row * 58 - 18;
        const phase = row * 0.7;
        const push = pointerActive
          ? Math.max(0, 1 - Math.abs(baseY - pointerY) / 180) * (7 + Math.sin(pointerX / 120) * 3)
          : 0;
        context.fillStyle = row % 4 === 0
          ? "rgba(55, 230, 156, 0.34)"
          : "rgba(43, 217, 255, 0.26)";

        for (let item = -1; item < 7; item += 1) {
          const x = item * 290 - offset + ((row * 83) % 180);
          const y = baseY - Math.sin((x / Math.max(1, width)) * Math.PI + phase) * 24 + push;
          context.save();
          context.translate(x, y);
          context.rotate(Math.cos((x / Math.max(1, width)) * Math.PI + phase) * 0.05);
          context.fillText(FORMULAS[(row + item + FORMULAS.length) % FORMULAS.length], 0, 0);
          context.restore();
        }
      }

      animationFrame = requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(root);
    resize();
    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerleave", onPointerLeave);
    animationFrame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div ref={rootRef} className={className} style={{ position: "absolute", inset: 0, pointerEvents: "none", ...style }} aria-hidden="true">
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, display: "block" }} />
    </div>
  );
}
