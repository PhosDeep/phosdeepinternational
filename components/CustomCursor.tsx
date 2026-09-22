"use client";

import { useEffect, useRef, useState } from "react";

type CursorVariant = "default" | "link" | "tech" | "magnetic";

type CursorState = {
  label: string;
  color: string;
  variant: CursorVariant;
};

const DEFAULT_STATE: CursorState = {
  label: "",
  color: "#a83cff",
  variant: "default",
};

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>(DEFAULT_STATE);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);

    const position = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPosition = { ...position };
    let animationFrame = 0;

    const handleMove = (event: PointerEvent) => {
      position.x = event.clientX;
      position.y = event.clientY;
      setVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate3d(${position.x}px, ${position.y}px, 0)`;
      }

      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-cursor]"
      );

      setState(
        target
          ? {
              label: target.dataset.cursorLabel ?? "",
              color: target.dataset.cursorColor ?? DEFAULT_STATE.color,
              variant: (target.dataset.cursor as CursorVariant) ?? "default",
            }
          : DEFAULT_STATE
      );
    };

    const handleLeave = (event: MouseEvent) => {
      if (!event.relatedTarget) setVisible(false);
    };

    const handleEnter = () => setVisible(true);

    const animate = () => {
      ringPosition.x += (position.x - ringPosition.x) * 0.18;
      ringPosition.y += (position.y - ringPosition.y) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate3d(${ringPosition.x}px, ${ringPosition.y}px, 0)`;
      }

      animationFrame = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", handleMove);
    document.documentElement.addEventListener("mouseleave", handleLeave);
    document.documentElement.addEventListener("mouseenter", handleEnter);
    animationFrame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
      document.documentElement.removeEventListener("mouseenter", handleEnter);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  if (!enabled) return null;

  const isActive = state.variant !== "default";

  return (
    <>
      <div
        ref={dotRef}
        className="custom-cursor-dot"
        style={{ "--cursor-color": state.color, opacity: visible ? 1 : 0 } as React.CSSProperties}
      />
      <div
        ref={ringRef}
        className={`custom-cursor-ring cursor-${state.variant} ${isActive ? "is-active" : ""}`}
        style={{ "--cursor-color": state.color, opacity: visible ? 1 : 0 } as React.CSSProperties}
      >
        <span className="cursor-shape">
          <span className="cursor-spin" aria-hidden="true" />
          <span className="cursor-corner cursor-corner-tl" />
          <span className="cursor-corner cursor-corner-tr" />
          <span className="cursor-corner cursor-corner-bl" />
          <span className="cursor-corner cursor-corner-br" />
          {(state.variant === "link" || state.variant === "magnetic") && state.label && (
            <span className="cursor-label">{state.label}</span>
          )}
        </span>
      </div>
    </>
  );
}
