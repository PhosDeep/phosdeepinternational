"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

interface FlowRibbonsProps {
  colorA?: string;
  colorB?: string;
  count?: number;
  speed?: number;
  strength?: number;
  className?: string;
  style?: CSSProperties;
}

type Mote = { x: number; y: number; life: number; span: number; tint: number; pace: number };

function hexToRgb(value: string) {
  const hex = value.replace("#", "");
  const normalized = hex.length === 3 ? hex.split("").map((part) => part + part).join("") : hex;
  return [
    parseInt(normalized.slice(0, 2), 16) || 0,
    parseInt(normalized.slice(2, 4), 16) || 0,
    parseInt(normalized.slice(4, 6), 16) || 0,
  ];
}

export default function FlowRibbons({
  colorA = "#00C896",
  colorB = "#2BD9FF",
  count = 150,
  speed = 0.7,
  strength = 13,
  className,
  style,
}: FlowRibbonsProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;";
    root.appendChild(canvas);
    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let last = performance.now();
    let time = 0;
    let pointerX = -1;
    let pointerY = -1;
    const motes: Mote[] = [];
    const first = hexToRgb(colorA);
    const second = hexToRgb(colorB);

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = root.clientWidth;
      height = root.clientHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!motes.length) {
        for (let index = 0; index < count; index += 1) {
          const span = 2 + Math.random() * 5;
          motes.push({ x: Math.random() * width, y: Math.random() * height, life: Math.random() * span, span, tint: Math.random(), pace: 0.5 + Math.random() * 0.8 });
        }
      }
    };

    const onMove = (event: PointerEvent) => {
      const bounds = root.getBoundingClientRect();
      pointerX = event.clientX - bounds.left;
      pointerY = event.clientY - bounds.top;
    };
    const onLeave = () => { pointerX = -1; pointerY = -1; };

    const draw = (now: number) => {
      const delta = Math.min(0.05, (now - last) / 1000);
      last = now;
      time += delta;
      context.globalCompositeOperation = "destination-out";
      context.fillStyle = "rgba(0, 0, 0, 0.08)";
      context.fillRect(0, 0, width, height);
      context.globalCompositeOperation = "source-over";
      context.lineCap = "round";

      for (const mote of motes) {
        const previousX = mote.x;
        const previousY = mote.y;
        const noise = Math.sin(mote.x * 0.012 + time * 0.25) + Math.cos(mote.y * 0.009 - time * 0.18);
        let angle = noise * 1.25;
        if (pointerX >= 0) {
          const dx = pointerX - mote.x;
          const dy = pointerY - mote.y;
          const distance = Math.hypot(dx, dy);
          const reach = 120 + strength * 24;
          if (distance > 1 && distance < reach) {
            const influence = (1 - distance / reach) ** 2;
            angle += (Math.atan2(dy, dx) - Math.PI * 0.42) * influence * (strength / 10);
          }
        }
        mote.x += Math.cos(angle) * speed * 42 * mote.pace * delta;
        mote.y += Math.sin(angle) * speed * 42 * mote.pace * delta;
        mote.life -= delta;
        if (mote.life <= 0 || mote.x < -20 || mote.x > width + 20 || mote.y < -20 || mote.y > height + 20) {
          mote.x = Math.random() * width;
          mote.y = Math.random() * height;
          mote.life = mote.span;
        }
        const mix = mote.tint;
        const red = Math.round(first[0] + (second[0] - first[0]) * mix);
        const green = Math.round(first[1] + (second[1] - first[1]) * mix);
        const blue = Math.round(first[2] + (second[2] - first[2]) * mix);
        const fade = Math.min(1, Math.min(mote.life, mote.span - mote.life) * 0.8) * 0.72;
        context.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${fade})`;
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(previousX, previousY);
        context.lineTo(mote.x, mote.y);
        context.stroke();
      }
      frame = requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(root);
    resize();
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      canvas.remove();
    };
  }, [colorA, colorB, count, speed, strength]);

  return <div ref={rootRef} className={className} style={{ position: "absolute", inset: 0, pointerEvents: "auto", ...style }} />;
}
