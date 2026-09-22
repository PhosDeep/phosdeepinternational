"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "./robot-sequence.module.css";
import { ScrollStory, STORY_SLIDES } from "./ScrollStory";

interface RobotScrollSequenceProps {
  frameUrls: string[];
  frameCount?: number;
  naturalWidth?: number;
  naturalHeight?: number;
  scrollHeightVh?: number;
}

export default function RobotScrollSequence({
  frameUrls,
  frameCount: initialFrameCount,
  naturalWidth = 1920,
  naturalHeight = 1080,
  scrollHeightVh = 1000,
}: RobotScrollSequenceProps) {
  const totalFrames = initialFrameCount || frameUrls.length;

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const frameIndexRef = useRef<HTMLSpanElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const loadedFlagsRef = useRef<Uint8Array>(new Uint8Array(totalFrames));
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isPreloaderVisible, setIsPreloaderVisible] = useState<boolean>(true);

  const currentFrameRef = useRef<number>(0);
  const lastDrawnFrameRef = useRef<number>(-1);
  const rafIdRef = useRef<number | null>(null);
  const targetProgressRef = useRef<number>(0);
  const smoothProgressRef = useRef<number>(0);
  const prefersReducedMotionRef = useRef<boolean>(false);

  // Initialize image slots
  if (imagesRef.current.length !== totalFrames) {
    imagesRef.current = new Array(totalFrames).fill(null);
    loadedFlagsRef.current = new Uint8Array(totalFrames);
  }

  /**
   * Draw specific frame index onto canvas with cover-fit math
   */
  const drawFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      // Locate target image or fallback to nearest loaded neighbor
      let imgToDraw: HTMLImageElement | null = null;
      let drawnIndex = index;

      if (loadedFlagsRef.current[index] === 1 && imagesRef.current[index]) {
        imgToDraw = imagesRef.current[index];
      } else {
        // Search backwards first for closest past frame
        for (let i = index - 1; i >= 0; i--) {
          if (loadedFlagsRef.current[i] === 1 && imagesRef.current[i]) {
            imgToDraw = imagesRef.current[i];
            drawnIndex = i;
            break;
          }
        }
        // If not found, search forwards
        if (!imgToDraw) {
          for (let i = index + 1; i < totalFrames; i++) {
            if (loadedFlagsRef.current[i] === 1 && imagesRef.current[i]) {
              imgToDraw = imagesRef.current[i];
              drawnIndex = i;
              break;
            }
          }
        }
      }

      if (!imgToDraw || !imgToDraw.complete || imgToDraw.naturalWidth === 0) {
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      if (
        canvas.width !== Math.floor(displayWidth * dpr) ||
        canvas.height !== Math.floor(displayHeight * dpr)
      ) {
        canvas.width = Math.floor(displayWidth * dpr);
        canvas.height = Math.floor(displayHeight * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Cover calculations
      const hRatio = displayWidth / naturalWidth;
      const vRatio = displayHeight / naturalHeight;
      const scale = Math.max(hRatio, vRatio);

      const drawW = naturalWidth * scale;
      const drawH = naturalHeight * scale;
      const drawX = (displayWidth - drawW) / 2;
      const drawY = (displayHeight - drawH) / 2;

      ctx.drawImage(imgToDraw, drawX, drawY, drawW, drawH);
      ctx.restore();

      lastDrawnFrameRef.current = drawnIndex;
    },
    [naturalWidth, naturalHeight, totalFrames]
  );

  /**
   * Smooth update loop for text overlays & HUD telemetry
   */
  const updateOverlays = useCallback(
    (progress: number, frameIdx: number) => {
      // 1. Update HUD Frame counter
      if (frameIndexRef.current) {
        frameIndexRef.current.textContent = String(frameIdx + 1).padStart(
          3,
          "0"
        );
      }

      // 2. Hide scroll prompt once user begins scrolling
      if (scrollIndicatorRef.current) {
        scrollIndicatorRef.current.style.opacity = progress > 0.04 ? "0" : "1";
      }

      // 3. Update storytelling slides via direct style modification (0 React re-renders)
      const slides = slidesRef.current;
      const totalSlides = STORY_SLIDES.length;

      for (let i = 0; i < totalSlides; i++) {
        const el = slides[i];
        if (!el) continue;

        const config = STORY_SLIDES[i];
        const [start, end] = config.range;
        const isFirst = i === 0;
        const isLast = i === totalSlides - 1;

        let opacity = 0;
        let translateY = 18;

        if (progress >= start && progress <= end) {
          const duration = end - start;
          const localProgress = (progress - start) / duration;

          if (isFirst) {
            // First slide: visible at start, fades out at end of window
            if (localProgress < 0.7) {
              opacity = 1;
              translateY = 0;
            } else {
              const fadeOut = (localProgress - 0.7) / 0.3;
              opacity = 1 - fadeOut;
              translateY = -18 * fadeOut;
            }
          } else if (isLast) {
            // Final slide: fades in and stays fully visible until the next section
            if (localProgress < 0.3) {
              const fadeIn = localProgress / 0.3;
              opacity = fadeIn;
              translateY = 18 * (1 - fadeIn);
            } else {
              opacity = 1;
              translateY = 0;
            }
          } else {
            // Intermediate slides: smooth in -> hold -> smooth out
            if (localProgress < 0.22) {
              const fadeIn = localProgress / 0.22;
              opacity = fadeIn;
              translateY = 18 * (1 - fadeIn);
            } else if (localProgress > 0.78) {
              const fadeOut = (localProgress - 0.78) / 0.22;
              opacity = 1 - fadeOut;
              translateY = -18 * fadeOut;
            } else {
              opacity = 1;
              translateY = 0;
            }
          }
        } else if (isFirst && progress < start) {
          // Above start, keep first visible
          opacity = 1;
          translateY = 0;
        } else if (isLast && progress > end) {
          // Past end, keep last visible as hero state
          opacity = 1;
          translateY = 0;
        }

        // Apply styles directly
        el.style.opacity = opacity.toFixed(3);
        el.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
        el.style.visibility = opacity <= 0.001 ? "hidden" : "visible";
      }
    },
    []
  );

  /**
   * Master render loop with silky smooth momentum damping
   */
  const renderLoop = useCallback(() => {
    rafIdRef.current = null;

    const target = targetProgressRef.current;
    const current = smoothProgressRef.current;
    const diff = target - current;

    // Smooth fluid easing (12% per frame creates a luxurious cinematic feel)
    if (Math.abs(diff) > 0.0002) {
      smoothProgressRef.current += diff * 0.12;
    } else {
      smoothProgressRef.current = target;
    }

    const progress = smoothProgressRef.current;

    let targetIndex = prefersReducedMotionRef.current
      ? totalFrames - 1
      : Math.floor(progress * (totalFrames - 1));

    targetIndex = Math.max(0, Math.min(totalFrames - 1, targetIndex));

    currentFrameRef.current = targetIndex;

    drawFrame(targetIndex);
    updateOverlays(progress, targetIndex);

    // Keep animating smoothly until settled on target
    if (Math.abs(target - smoothProgressRef.current) > 0.0002) {
      rafIdRef.current = requestAnimationFrame(renderLoop);
    }
  }, [drawFrame, updateOverlays, totalFrames]);

  const requestRender = useCallback(() => {
    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(renderLoop);
    }
  }, [renderLoop]);

  /**
   * Scroll handler: calculates exact scroll progress deterministically
   */
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollDistance =
        containerRef.current.offsetHeight - window.innerHeight;

      if (totalScrollDistance <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.max(
        0,
        Math.min(1, currentScroll / totalScrollDistance)
      );

      targetProgressRef.current = progress;

      const targetIdx = Math.max(
        0,
        Math.min(totalFrames - 1, Math.floor(progress * (totalFrames - 1)))
      );

      // Prioritize loading frames near current scroll position
      if (loadedFlagsRef.current[targetIdx] === 0) {
        for (
          let i = Math.max(0, targetIdx - 3);
          i <= Math.min(totalFrames - 1, targetIdx + 12);
          i++
        ) {
          if (loadedFlagsRef.current[i] === 0 && !imagesRef.current[i]) {
            const img = new Image();
            img.decoding = "async";
            img.src = frameUrls[i];
            imagesRef.current[i] = img;
            img.onload = () => {
              loadedFlagsRef.current[i] = 1;
              if (
                Math.abs(i - currentFrameRef.current) <=
                Math.abs(lastDrawnFrameRef.current - currentFrameRef.current)
              ) {
                requestRender();
              }
            };
          }
        }
      }

      requestRender();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [requestRender, totalFrames, frameUrls]);

  /**
   * Window resize handler
   */
  useEffect(() => {
    const handleResize = () => {
      requestRender();
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [requestRender]);

  /**
   * Reduced motion preference listener
   */
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotionRef.current = mediaQuery.matches;

    const handleChange = (e: MediaQueryListEvent) => {
      prefersReducedMotionRef.current = e.matches;
      requestRender();
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [requestRender]);

  /**
   * Progressive Image Preloader: loads eagerly across full sequence
   */
  useEffect(() => {
    if (frameUrls.length === 0) return;

    let isSubscribed = true;
    let loadedCounter = 0;

    const markFrameLoaded = (index: number, img: HTMLImageElement) => {
      if (!isSubscribed) return;
      imagesRef.current[index] = img;
      loadedFlagsRef.current[index] = 1;
      loadedCounter++;

      if (loadedCounter % 15 === 0 || loadedCounter === totalFrames) {
        setLoadedCount(loadedCounter);
      }

      if (loadedCounter >= 30) {
        setIsPreloaderVisible(false);
      }

      // If this frame is closer to current scroll position than what is currently drawn, re-render
      const currentDist = Math.abs(index - currentFrameRef.current);
      const drawnDist = Math.abs(
        lastDrawnFrameRef.current - currentFrameRef.current
      );

      if (currentDist <= drawnDist || index === 0) {
        requestRender();
      }
    };

    const loadImage = (index: number): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        if (imagesRef.current[index]?.complete) {
          resolve(imagesRef.current[index]!);
          return;
        }

        const img = new Image();
        img.decoding = "async";
        img.src = frameUrls[index];

        img.onload = () => {
          markFrameLoaded(index, img);
          resolve(img);
        };

        img.onerror = () => {
          resolve(img);
        };
      });
    };

    // 1. Immediately load frame 0 and first 30 frames for instant smooth start
    for (let i = 0; i < Math.min(30, totalFrames); i++) {
      loadImage(i);
    }

    // 2. Load milestone keyframes across the sequence
    for (let i = 30; i < totalFrames; i += 10) {
      loadImage(i);
    }
    loadImage(totalFrames - 1);

    // 3. Eager background streaming for all remaining frames in fast chunks
    let currentIdx = 0;
    const loadBatch = () => {
      if (!isSubscribed) return;
      let count = 0;
      while (currentIdx < totalFrames && count < 16) {
        if (loadedFlagsRef.current[currentIdx] === 0) {
          loadImage(currentIdx);
          count++;
        }
        currentIdx++;
      }

      if (currentIdx < totalFrames) {
        setTimeout(loadBatch, 20);
      }
    };

    const timer = setTimeout(loadBatch, 50);

    return () => {
      isSubscribed = false;
      clearTimeout(timer);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [frameUrls, totalFrames, requestRender]);

  const loadPercent = Math.min(100, Math.round((loadedCount / totalFrames) * 100));

  return (
    <section
      ref={containerRef}
      className={styles.sequenceContainer}
      style={{ height: `${scrollHeightVh}vh` }}
      aria-label="Interactive AI Robot Scroll Sequence"
    >
      <div className={styles.stickyStage}>
        {/* The Single HTML5 Canvas */}
        <canvas ref={canvasRef} className={styles.robotCanvas} />

        {/* Cinematic Vignette Gradients */}
        <div className={styles.cinematicVignette} />
        <div className={styles.topFade} />
        <div className={styles.bottomFade} />

        {/* Story Overlays & HUD Telemetry */}
        <ScrollStory
          slidesRef={slidesRef}
          frameIndexRef={frameIndexRef}
          totalFrames={totalFrames}
          scrollIndicatorRef={scrollIndicatorRef}
        />

        {/* Minimal Subtle Preload Bar */}
        <div
          className={`${styles.minimalPreloader} ${
            isPreloaderVisible ? styles.preloaderVisible : ""
          }`}
          aria-hidden="true"
        >
          <div className={styles.preloaderTrack}>
            <div
              className={styles.preloaderFill}
              style={{ width: `${loadPercent}%` }}
            />
          </div>
          <span className={styles.preloaderText}>
            CACHING {loadPercent}%
          </span>
        </div>
      </div>
    </section>
  );
}
