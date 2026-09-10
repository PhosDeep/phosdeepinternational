"use client";

import { useEffect, useState } from "react";

const GREETINGS = [
  "Hello",
  "नमस्ते",
  "Bonjour",
  "Ciao",
  "Hola",
  "こんにちは",
  "Olá",
  "Hallo",
  "PHOSDEEP",
];

export default function IntroQuoteOverlay() {
  const [visible, setVisible] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Lock body scrolling while preloader is active
    document.body.style.overflow = "hidden";

    // Cycle through greetings every 240ms (~2.4s total)
    const intervalTime = 240;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev < GREETINGS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          dismissPreloader();
          return prev;
        }
      });
    }, intervalTime);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "";
    };
  }, []);

  const dismissPreloader = () => {
    setFadingOut(true);
    setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
    }, 850);
  };

  if (!visible) return null;

  const currentGreeting = GREETINGS[currentIndex];

  return (
    <div
      className={`multilingual-preloader ${fadingOut ? "is-sliding-out" : ""}`}
      aria-label="Multilingual Greeting Preloader"
    >
      {/* MINIMAL ATMOSPHERE */}
      <div className="preloader-bg-mesh" aria-hidden="true" />
      <div className="preloader-glow-orb" aria-hidden="true" />

      {/* CENTER GREETING DISPLAY (EXACT USER REFERENCE MATCH) */}
      <div className="preloader-center-box">
        <div className="greeting-word-wrapper" key={currentGreeting}>
          <span className="greeting-dot">•</span>
          <span className="greeting-text">{currentGreeting}</span>
        </div>
      </div>

      {/* MINIMAL BOTTOM BRAND TAG */}
      <div className="preloader-bottom-tag">
        <span className="brand-dot-beacon" />
        <span>PHOSDEEP INTERNATIONAL // FRONTIER LABS</span>
      </div>
    </div>
  );
}
