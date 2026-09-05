"use client";

import { useEffect, useRef, useState } from "react";

type CursorVariant = "default" | "link" | "tech" | "magnetic";

type CursorState = {
  label: string;
  color: string;
  variant: CursorVariant;
  symbol: string;
};

const DEFAULT_STATE: CursorState = {
  label: "",
  color: "#a83cff",
  variant: "default",
  symbol: "",
};

/**
 * Custom HUD-style reticle cursor.
 *
 * Important structural rule: the outer `.custom-cursor-ring` element's
 * `transform` is owned exclusively by JS (it tracks the pointer every
 * frame). Nothing else may animate `transform` on that same element —
 * CSS animations take priority over inline styles for whichever
 * property they target, so an `animation` on this element would hijack
 * position tracking the instant it played. The spin effect for the
 * "tech" variant therefore lives on a separate, purely decorative
 * child (`.cursor-spin`) whose transform JS never touches.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>(DEFAULT_STATE);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    setEnabled(fine);
    if (!fine) return;

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: pos.x, y: pos.y };
    let raf = 0;

    const handleMove = (event: PointerEvent) => {
      pos.x = event.clientX;
      pos.y = event.clientY;
      setVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      }

      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-cursor]"
      );

      if (target) {
        setState({
          label: target.dataset.cursorLabel ?? "",
          color: target.dataset.cursorColor ?? DEFAULT_STATE.color,
          variant: (target.dataset.cursor as CursorVariant) ?? "default",
          symbol: target.dataset.cursorSymbol ?? "",
        });
      } else {
        setState(DEFAULT_STATE);
      }
    };

    // Fade the cursor out cleanly when the pointer leaves the
    // viewport (browser chrome, another window) instead of leaving
    // it frozen mid-page, and bring it back on re-entry.
    const handleDocLeave = (event: MouseEvent) => {
      if (!event.relatedTarget) setVisible(false);
    };
    const handleDocEnter = () => setVisible(true);

    const animateRing = () => {
      ring.x += (pos.x - ring.x) * 0.18;
      ring.y += (pos.y - ring.y) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      }

      raf = requestAnimationFrame(animateRing);
    };

    window.addEventListener("pointermove", handleMove);
    document.documentElement.addEventListener("mouseleave", handleDocLeave);
    document.documentElement.addEventListener("mouseenter", handleDocEnter);
    raf = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.documentElement.removeEventListener("mouseleave", handleDocLeave);
      document.documentElement.removeEventListener("mouseenter", handleDocEnter);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  const isActive = state.variant !== "default";

  return (
    <>
      <div
        ref={dotRef}
        className="custom-cursor-dot"
        style={{
          "--cursor-color": state.color,
          opacity: visible ? 1 : 0,
        } as React.CSSProperties}
      />

      <div
        ref={ringRef}
        className={`custom-cursor-ring cursor-${state.variant} ${isActive ? "is-active" : ""}`}
        style={{
          "--cursor-color": state.color,
          opacity: visible ? 1 : 0,
        } as React.CSSProperties}
      >
        <span className="cursor-shape">

          <span className="cursor-spin" aria-hidden="true" />

          <span className="cursor-corner cursor-corner-tl" />
          <span className="cursor-corner cursor-corner-tr" />
          <span className="cursor-corner cursor-corner-bl" />
          <span className="cursor-corner cursor-corner-br" />

          {/* Tech variant intentionally shows no duplicate glyph —
              the reticle stays a transparent outline so the card's
              own icon underneath does the talking. */}

          {(state.variant === "link" || state.variant === "magnetic") && state.label && (
            <span className="cursor-label">{state.label}</span>
          )}

        </span>
      </div>
    </>
  );
}
