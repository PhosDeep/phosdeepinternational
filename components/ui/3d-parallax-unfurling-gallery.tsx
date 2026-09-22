"use client";

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

// --- Curated Generative AI & Embodied Robotics Editorial Assets ---
const AI_HELIX_CARDS = [
  {
    id: "card-1",
    type: "cities",
    bg: "#0e0e12",
    color: "#f0edf5",
    topText: "PERCEPTION",
    centerText: "REASONING",
    bottomText: "ACTION",
    accent: "#a83cff",
  },
  {
    id: "card-2",
    type: "split-flower",
    bg: "#e2dfd5",
    color: "#282a24",
    image: "/robot-frames/ezgif-frame-160.jpg", // Robot optical sensor
    tagTop: "0034",
    tagBottom: "0095",
    caption: "ATTN HEADS",
  },
  {
    id: "card-3",
    type: "pattern",
    bg: "#2b2342",
    color: "#f5f0fa",
    title: "LATENT\nDIFFUSION",
    subtitle: "IN 4,096 DIMENSIONS",
  },
  {
    id: "card-4",
    type: "photo-card",
    bg: "#161622",
    color: "#f5f3ec",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&q=80", // AI neural matrix
    badge: "GEN-AI 2026",
    subtitle: "SYNTHETIC COGNITION",
  },
  {
    id: "card-5",
    type: "oval-editorial",
    bg: "#1f1d2b",
    color: "#e8e5f0",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80", // fluid latent manifold
    quote: "Continuity of form across continuous latent space —",
  },
  {
    id: "card-6",
    type: "botanical",
    bg: "#12141a",
    color: "#ffffff",
    image: "/robot-frames/ezgif-frame-080.jpg", // Embodied AI Robot Head profile
    tag: "EMBODIED VLA",
    code: "TORQUE 840 N·m",
  },
  {
    id: "card-7",
    type: "cities",
    bg: "#14111d",
    color: "#f2edfa",
    topText: "MULTIMODAL",
    centerText: "TRANSFORMER",
    bottomText: "DIFFUSION",
    accent: "#743cff",
  },
  {
    id: "card-8",
    type: "portrait",
    bg: "#15151c",
    color: "#ffffff",
    image:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80", // Cybernetic portrait
    badge: "BIOMETRIC",
    subtitle: "NEURAL LATTICE",
  },
  {
    id: "card-9",
    type: "split-flower",
    bg: "#dcd8ce",
    color: "#22251e",
    image: "/robot-frames/ezgif-frame-240.jpg", // Robot kinematics
    tagTop: "0070B",
    tagBottom: "0405B",
    caption: "PARAMETERS",
  },
  {
    id: "card-10",
    type: "photo-card",
    bg: "#121422",
    color: "#ece9df",
    image:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80", // Quantum optical computing
    badge: "AUTONOMOUS",
    subtitle: "KINETIC TRAJECTORY",
  },
];

export default function Helix3DGallery() {
  const containerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const helixPivotRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);

  // Drag & Inertia state
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startDragAngleRef = useRef(0);

  // Animation & scroll state refs (zero React re-renders on scroll)
  const targetProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);
  const targetDragAngleRef = useRef(0);
  const smoothDragAngleRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  // Master render loop (momentum lerping on GPU, zero React re-render lag)
  const renderLoop = useCallback(() => {
    rafIdRef.current = null;

    // Smooth scroll progress lerp (cinematic 0.07 damping)
    const diffP = targetProgressRef.current - smoothProgressRef.current;
    if (Math.abs(diffP) > 0.0001) {
      smoothProgressRef.current += diffP * 0.07;
    } else {
      smoothProgressRef.current = targetProgressRef.current;
    }

    // Smooth drag angle lerp (0.12 damping)
    const diffD = targetDragAngleRef.current - smoothDragAngleRef.current;
    if (Math.abs(diffD) > 0.04) {
      smoothDragAngleRef.current += diffD * 0.12;
    } else {
      smoothDragAngleRef.current = targetDragAngleRef.current;
    }

    const p = smoothProgressRef.current;

    // Gentle ease-in at section start for velvety transition from the robot sequence
    const easedP = p < 0.12 ? Math.pow(p / 0.12, 1.35) * 0.12 : p;

    // Rotate 230 degrees across the 650vh track - measured, cinematic, leisurely
    const scrollRot = easedP * -230;
    const scrollY = 80 - easedP * 160;

    const totalAngle = scrollRot + smoothDragAngleRef.current;
    const totalY = scrollY;

    if (helixPivotRef.current) {
      helixPivotRef.current.style.transform = `rotateX(9deg) rotateZ(3deg) translateY(${totalY.toFixed(
        2
      )}px) rotateY(${totalAngle.toFixed(2)}deg)`;
    }

    // Smooth entrance transition when scrolling from robot into spiral
    if (containerRef.current && stageRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top > 0 && rect.top < vh) {
        const enterRatio = 1 - rect.top / vh;
        const opacity = Math.min(1, Math.max(0.2, enterRatio * 1.35));
        const scale = 0.94 + 0.06 * enterRatio;
        stageRef.current.style.opacity = opacity.toFixed(3);
        stageRef.current.style.transform = `scale(${scale.toFixed(3)})`;
      } else {
        stageRef.current.style.opacity = "1";
        stageRef.current.style.transform = "scale(1)";
      }
    }

    const needsMore =
      Math.abs(targetProgressRef.current - smoothProgressRef.current) > 0.0001 ||
      Math.abs(targetDragAngleRef.current - smoothDragAngleRef.current) > 0.04;

    if (needsMore) {
      rafIdRef.current = requestAnimationFrame(renderLoop);
    }
  }, []);

  const requestRender = useCallback(() => {
    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(renderLoop);
    }
  }, [renderLoop]);

  // Window scroll listener: direct deterministic calculation, zero setState
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScroll =
        containerRef.current.offsetHeight - window.innerHeight;
      if (totalScroll <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalScroll));
      targetProgressRef.current = progress;
      requestRender();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [requestRender]);

  // Mouse / Touch Drag handlers for manual spin
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startDragAngleRef.current = targetDragAngleRef.current;
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - startXRef.current;
      targetDragAngleRef.current = startDragAngleRef.current + deltaX * 0.45;
      requestRender();
    },
    [requestRender]
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = false;
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  }, []);

  // Geometry configuration
  const totalCards = AI_HELIX_CARDS.length;
  const radius = 390; // Cylinder radius in px
  const angleStep = 40; // Degrees between successive cards on the helix
  const yStep = 85; // Vertical step per card along the helix

  return (
    <section
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "650vh",
        backgroundColor: "#05030c",
        color: "#ffffff",
        zIndex: 10,
        userSelect: "none",
      }}
      aria-label="3D Helix AI Matrix"
      suppressHydrationWarning
    >
      {mounted && (
        <div
          ref={stageRef}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          background:
            "radial-gradient(circle at 65% 50%, #150f24 0%, #05030c 75%)",
          transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
          willChange: "opacity, transform",
        }}
      >
        {/* Subtle Micro-Dot Grid Texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage:
              "radial-gradient(circle, rgba(168,60,255,0.08) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.8,
          }}
        />

        {/* Ambient Top & Bottom Gradients for Seamless Blending */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "160px",
            zIndex: 30,
            pointerEvents: "none",
            background:
              "linear-gradient(to bottom, #05030c 0%, rgba(5,3,12,0.7) 60%, transparent 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "180px",
            zIndex: 30,
            pointerEvents: "none",
            background:
              "linear-gradient(to top, #05030c 0%, rgba(5,3,12,0.7) 60%, transparent 100%)",
          }}
        />

        {/* =====================================================
            SIDE-BY-SIDE CONTAINER:
            LEFT: MINIMAL EDITORIAL NARRATIVE (Low text, high impact)
            RIGHT: 3D HELIX SPIRAL CAROUSEL
        ===================================================== */}
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "1520px",
            height: "100%",
            padding: "0 48px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 20,
          }}
        >
          {/* ---------------------------------------------------
              LEFT FLANK: MINIMAL LUXURY EDITORIAL
          --------------------------------------------------- */}
          <div
            style={{
              width: "100%",
              maxWidth: "380px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              zIndex: 25,
            }}
          >
            {/* Minimal Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                width: "fit-content",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "#a83cff",
                  boxShadow: "0 0 10px #a83cff",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(212, 164, 255, 0.85)",
                }}
              >
                02 // THE MANIFOLD
              </span>
            </div>

            {/* Impactful Title */}
            <h2
              style={{
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: "clamp(30px, 3.4vw, 46px)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "#ffffff",
                margin: 0,
              }}
            >
              LATENT
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #ffffff 35%, #a83cff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                SPACE.
              </span>
            </h2>

            {/* Short, Poetic Editorial Sentence */}
            <p
              style={{
                fontFamily: "Georgia, 'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: "16px",
                lineHeight: 1.5,
                color: "rgba(245, 243, 250, 0.78)",
                margin: 0,
              }}
            >
              &ldquo;Intelligence is pure form in perpetual motion across
              high-dimensional latent space.&rdquo;
            </p>

            {/* Just 2 Clean Main Points */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                paddingTop: "14px",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: "11px",
                    fontWeight: 800,
                    color: "#a83cff",
                  }}
                >
                  01
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-geist-sans), sans-serif",
                    fontSize: "13px",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    color: "#ffffff",
                  }}
                >
                  Continuous Neural Topology (4,096-D)
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: "11px",
                    fontWeight: 800,
                    color: "#a83cff",
                  }}
                >
                  02
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-geist-sans), sans-serif",
                    fontSize: "13px",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    color: "#ffffff",
                  }}
                >
                  Real-Time Embodied Actuation (&lt; 14ms)
                </span>
              </div>
            </div>

            {/* Minimal Interaction Prompt */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "10px",
                fontFamily: "var(--font-geist-mono), monospace",
                color: "rgba(245, 243, 250, 0.4)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                paddingTop: "6px",
              }}
            >
              <span>✥</span>
              <span>DRAG TO ROTATE // SCROLL TO EXPLORE</span>
            </div>
          </div>

          {/* ---------------------------------------------------
              RIGHT FLANK: 3D HELIX CAROUSEL
          --------------------------------------------------- */}
          <div
            style={{
              position: "relative",
              flex: 1,
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              perspective: "1400px",
              perspectiveOrigin: "55% 50%",
              cursor: isDragging ? "grabbing" : "grab",
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {/* Main 3D Helix Pivot */}
            <div
              ref={helixPivotRef}
              style={{
                position: "relative",
                width: 0,
                height: 0,
                transformStyle: "preserve-3d",
                transform:
                  "rotateX(9deg) rotateZ(3deg) translateY(80px) rotateY(0deg)",
                willChange: "transform",
              }}
            >
              {AI_HELIX_CARDS.map((item, index) => {
                // Parametric 3D spiral positioning
                const cardAngle = (index - (totalCards - 1) / 2) * angleStep;
                const cardY = (index - (totalCards - 1) / 2) * yStep;

                return (
                  <div
                    key={item.id}
                    style={{
                      position: "absolute",
                      width: "245px",
                      height: "335px",
                      left: "-122px",
                      top: "-167px",
                      transformStyle: "preserve-3d",
                      transform: `rotateY(${cardAngle}deg) translateZ(${radius}px) translateY(${cardY}px)`,
                      borderRadius: "26px",
                      backgroundColor: item.bg,
                      color: item.color,
                      boxShadow:
                        "0 24px 50px -10px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)",
                      overflow: "hidden",
                      cursor: "pointer",
                      backfaceVisibility: "visible",
                      opacity: 0.94,
                      willChange: "transform",
                    }}
                  >
                    {/* CARD TYPE 1: THREE TIER TYPOGRAPHY */}
                    {item.type === "cities" && (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          padding: "26px 22px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          fontFamily: "var(--font-geist-sans), sans-serif",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: 700,
                              letterSpacing: "0.15em",
                              textTransform: "uppercase",
                              color: item.color,
                            }}
                          >
                            {item.topText}
                          </span>
                          <span
                            style={{
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              backgroundColor: item.accent || "#a83cff",
                            }}
                          />
                        </div>

                        <span
                          style={{
                            fontSize: "19px",
                            fontWeight: 800,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: item.color,
                            alignSelf: "center",
                          }}
                        >
                          {item.centerText}
                        </span>

                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: 700,
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            color: item.color,
                            alignSelf: "flex-end",
                          }}
                        >
                          {item.bottomText}
                        </span>
                      </div>
                    )}

                    {/* CARD TYPE 2: SPLIT IMAGE + TYPOGRAPHY */}
                    {item.type === "split-flower" && (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        {/* Left: AI/Robot Photograph */}
                        <div
                          style={{
                            width: "55%",
                            height: "100%",
                            overflow: "hidden",
                            position: "relative",
                          }}
                        >
                          <img
                            src={item.image}
                            alt="AI Sensor"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                        </div>

                        {/* Right: Numeric Typographic Panel */}
                        <div
                          style={{
                            width: "45%",
                            height: "100%",
                            padding: "24px 14px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            fontFamily: "var(--font-geist-mono), monospace",
                            color: item.color,
                          }}
                        >
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: 800,
                              letterSpacing: "0.05em",
                            }}
                          >
                            {item.tagTop}
                          </span>

                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <span style={{ fontSize: "16px", fontWeight: 400 }}>
                              —
                            </span>
                            <span
                              style={{
                                fontSize: "8px",
                                fontWeight: 700,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                opacity: 0.7,
                              }}
                            >
                              {item.caption}
                            </span>
                          </div>

                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: 800,
                              letterSpacing: "0.05em",
                            }}
                          >
                            {item.tagBottom}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* CARD TYPE 3: GEOMETRIC PATTERN */}
                    {item.type === "pattern" && (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          padding: "26px 22px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <h3
                            style={{
                              fontSize: "17px",
                              fontWeight: 800,
                              lineHeight: 1.15,
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              color: item.color,
                              whiteSpace: "pre-line",
                              margin: "0 0 6px 0",
                            }}
                          >
                            {item.title}
                          </h3>
                          <span
                            style={{
                              fontFamily: "var(--font-geist-mono), monospace",
                              fontSize: "9px",
                              fontWeight: 700,
                              letterSpacing: "0.15em",
                              color: "rgba(245,240,250,0.6)",
                              textTransform: "uppercase",
                            }}
                          >
                            {item.subtitle}
                          </span>
                        </div>

                        {/* Geometric Synapse Pattern */}
                        <div
                          style={{
                            width: "100%",
                            height: "120px",
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 0.85,
                          }}
                        >
                          {[...Array(8)].map((_, i) => (
                            <div
                              key={i}
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: i % 2 === 0 ? "50%" : "8px",
                                backgroundColor:
                                  i % 2 === 0
                                    ? "rgba(168,60,255,0.7)"
                                    : "rgba(245,240,250,0.85)",
                                border: "1px solid rgba(255,255,255,0.2)",
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CARD TYPE 4: PHOTO CARD WITH BADGE */}
                    {item.type === "photo-card" && (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "relative",
                        }}
                      >
                        <img
                          src={item.image}
                          alt="AI Matrix Visual"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background:
                              "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 40%, rgba(0,0,0,0.75) 100%)",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: "20px",
                            left: "20px",
                            padding: "4px 10px",
                            borderRadius: "100px",
                            backgroundColor: "rgba(168,60,255,0.3)",
                            border: "1px solid rgba(168,60,255,0.5)",
                            backdropFilter: "blur(8px)",
                            fontSize: "10px",
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                          }}
                        >
                          {item.badge}
                        </div>
                        <div
                          style={{
                            position: "absolute",
                            bottom: "20px",
                            left: "20px",
                            fontSize: "11px",
                            fontWeight: 700,
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                          }}
                        >
                          {item.subtitle}
                        </div>
                      </div>
                    )}

                    {/* CARD TYPE 5: OVAL EDITORIAL */}
                    {item.type === "oval-editorial" && (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          padding: "24px 20px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "space-between",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "105px",
                            height: "130px",
                            borderRadius: "52px",
                            overflow: "hidden",
                            boxShadow: "0 10px 24px rgba(0,0,0,0.4)",
                            border: "1px solid rgba(255,255,255,0.1)",
                          }}
                        >
                          <img
                            src={item.image}
                            alt="Latent space bloom"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                        <p
                          style={{
                            fontSize: "11px",
                            lineHeight: 1.45,
                            fontWeight: 500,
                            letterSpacing: "0.02em",
                            color: item.color,
                            fontStyle: "italic",
                          }}
                        >
                          {item.quote}
                        </p>
                        <div
                          style={{
                            width: "24px",
                            height: "2px",
                            backgroundColor: "#a83cff",
                            opacity: 0.8,
                          }}
                        />
                      </div>
                    )}

                    {/* CARD TYPE 6: EMBODIED ANDROID */}
                    {item.type === "botanical" && (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "relative",
                        }}
                      >
                        <img
                          src={item.image}
                          alt="Embodied AI Robot"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: "20px",
                            right: "20px",
                            fontSize: "10px",
                            fontWeight: 800,
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            color: "#d4a4ff",
                            backgroundColor: "rgba(0,0,0,0.4)",
                            padding: "3px 8px",
                            borderRadius: "4px",
                          }}
                        >
                          {item.tag}
                        </div>
                        <div
                          style={{
                            position: "absolute",
                            bottom: "20px",
                            left: "20px",
                            fontFamily: "var(--font-geist-mono), monospace",
                            fontSize: "11px",
                            fontWeight: 700,
                            letterSpacing: "0.15em",
                            color: "#ffffff",
                          }}
                        >
                          {item.code}
                        </div>
                      </div>
                    )}

                    {/* CARD TYPE 7: CYBERNETIC PORTRAIT */}
                    {item.type === "portrait" && (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "relative",
                        }}
                      >
                        <img
                          src={item.image}
                          alt="Neural Model Portrait"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: "20px",
                            left: "20px",
                            right: "20px",
                          }}
                        >
                          <span
                            style={{
                              display: "inline-block",
                              padding: "3px 8px",
                              backgroundColor: "rgba(168,60,255,0.35)",
                              backdropFilter: "blur(6px)",
                              borderRadius: "4px",
                              fontSize: "9px",
                              fontWeight: 800,
                              letterSpacing: "0.15em",
                              marginBottom: "6px",
                              color: "#ffffff",
                            }}
                          >
                            {item.badge}
                          </span>
                          <div
                            style={{
                              fontSize: "12px",
                              fontWeight: 700,
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                            }}
                          >
                            {item.subtitle}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Interactive Control Pill */}
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            zIndex: 40,
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "8px 20px",
            borderRadius: "100px",
            backgroundColor: "rgba(20, 16, 28, 0.75)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 12px 30px rgba(0,0,0,0.6)",
            cursor: "pointer",
          }}
          onClick={() => {
            targetDragAngleRef.current += 72;
            requestRender();
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#e8d5ff",
            }}
          >
            ROTATE HELIX
          </span>
          <span
            style={{
              fontSize: "12px",
              color: "#a83cff",
              transition: "transform 0.2s ease",
            }}
          >
            ↻
          </span>
        </div>
      </div>
      )}
    </section>
  );
}
