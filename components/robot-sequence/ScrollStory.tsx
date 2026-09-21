import React, { forwardRef } from "react";
import styles from "./robot-sequence.module.css";

export interface StorySlideConfig {
  id: string;
  range: [number, number]; // [startProgress, endProgress]
  positionClass: string;
  tag?: string;
  title: string;
  subtitle: string[];
  gradientTitle?: boolean;
}

export const STORY_SLIDES: StorySlideConfig[] = [
  {
    id: "intro",
    range: [0.0, 0.18],
    positionClass: styles.slideLeft,
    tag: "PHOSDEEP // SYSTEM 02",
    title: "GENERATIVE AI",
    subtitle: [
      "Machines that perceive.",
      "Machines that create.",
      "Embodied cognition in real time.",
    ],
    gradientTitle: true,
  },
  {
    id: "perceive",
    range: [0.18, 0.38],
    positionClass: styles.slideLeft,
    tag: "01 — PERCEIVE",
    title: "THE AWAKENING",
    subtitle: [
      "The robot observes its environment.",
      "High-dimensional ocular streams ignite.",
    ],
  },
  {
    id: "scan",
    range: [0.38, 0.58],
    positionClass: styles.slideRight,
    tag: "02 — SCAN",
    title: "SIGNALS IN THE VOID",
    subtitle: [
      "Information becomes signals.",
      "Reality maps into structured latent space.",
    ],
  },
  {
    id: "process",
    range: [0.58, 0.78],
    positionClass: styles.slideLeft,
    tag: "03 — PROCESS",
    title: "THOUGHT IN SILICON",
    subtitle: [
      "Patterns become understanding.",
      "Context crystallizes into intuition.",
    ],
  },
  {
    id: "generate",
    range: [0.78, 0.92],
    positionClass: styles.slideRight,
    tag: "04 — GENERATE",
    title: "THE CREATIVE ACT",
    subtitle: [
      "Understanding becomes creation.",
      "Abstract thought transforms into physical agency.",
    ],
  },
  {
    id: "finale",
    range: [0.92, 1.0],
    positionClass: styles.slideLeft,
    tag: "THE EMBODIED SYNTHESIS",
    title: "FROM PERCEPTION TO CREATION",
    subtitle: [
      "The feedback loop is complete.",
      "An intelligent entity responding to the world it perceives.",
    ],
    gradientTitle: true,
  },
];

interface ScrollStoryProps {
  slidesRef: React.RefObject<(HTMLDivElement | null)[]>;
  frameIndexRef: React.RefObject<HTMLSpanElement | null>;
  totalFrames: number;
  scrollIndicatorRef: React.RefObject<HTMLDivElement | null>;
}

export function ScrollStory({
  slidesRef,
  frameIndexRef,
  totalFrames,
  scrollIndicatorRef,
}: ScrollStoryProps) {
  return (
    <>
      {/* Bottom Scroll Tip — Telemetry & Frame count removed per user request */}
      <div className={styles.hudOverlay}>
        <div className={styles.hudBottomRow} style={{ justifyContent: "center" }}>
          <div className={styles.hudScrollTip} ref={scrollIndicatorRef}>
            <div className={styles.scrollMouseWheel}>
              <span className={styles.scrollMouseDot} />
            </div>
            <span>SCROLL TO ADVANCE</span>
          </div>
        </div>
      </div>

      {/* Narrative Story Overlays */}
      <div className={styles.storyLayer} aria-live="polite">
        {STORY_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            ref={(el) => {
              if (slidesRef.current) {
                slidesRef.current[index] = el;
              }
            }}
            className={`${styles.storySlide} ${slide.positionClass}`}
            data-slide-index={index}
          >
            <div className={styles.storyCard}>
              {slide.tag && (
                <div className={styles.storyIndex}>
                  <span className={styles.storyIndexLine} />
                  <span>{slide.tag}</span>
                  <span className={styles.storyIndexLine} />
                </div>
              )}

              <h2
                className={`${styles.storyTitle} ${
                  slide.gradientTitle ? styles.storyTitleGradient : ""
                }`}
              >
                {slide.title}
              </h2>

              <p className={styles.storySubtitle}>
                {slide.subtitle.map((line, lIdx) => (
                  <span key={lIdx}>{line}</span>
                ))}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
