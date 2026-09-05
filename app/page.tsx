"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

import CustomCursor from "@/components/CustomCursor";
import HudFrame from "@/components/HudFrame";
import SiteNav from "@/components/SiteNav";

const PhosdeepScene = dynamic(
  () => import("@/components/PhosdeepScene"),
  {
    ssr: false,
  }
);

const technologies = [
  {
    number: "01",
    title: "CYBERSECURITY",
    slug: "cybersecurity",
    subtitle: "DEFEND",
    description:
      "Offensive security, threat intelligence, security engineering and adversarial testing.",
    color: "red",
    hex: "#ff405a",
    symbol: "◈",
  },
  {
    number: "02",
    title: "GENERATIVE AI",
    slug: "generative-ai",
    subtitle: "CREATE",
    description:
      "LLMs, intelligent agents, AI systems and next-generation applications.",
    color: "purple",
    hex: "#a83cff",
    symbol: "✦",
  },
  {
    number: "03",
    title: "QUANTUM",
    slug: "quantum",
    subtitle: "COMPUTE",
    description:
      "Exploring computation beyond classical architectures through quantum systems.",
    color: "blue",
    hex: "#557cff",
    symbol: "◎",
  },
  {
    number: "04",
    title: "CLOUD",
    slug: "cloud",
    subtitle: "SCALE",
    description:
      "Modern infrastructure engineered for scale, resilience and intelligence.",
    color: "cyan",
    hex: "#2bd9ff",
    symbol: "⌁",
  },
  {
    number: "05",
    title: "BLOCKCHAIN",
    slug: "blockchain",
    subtitle: "DECENTRALIZE",
    description:
      "Distributed systems, smart contracts, Web3 infrastructure and digital trust.",
    color: "orange",
    hex: "#ff8b37",
    symbol: "⬡",
  },
  {
    number: "06",
    title: "RESEARCH",
    slug: "research",
    subtitle: "DISCOVER",
    description:
      "Turning frontier science and technology into practical knowledge.",
    color: "green",
    hex: "#37e69c",
    symbol: "◉",
  },
];

/* =====================================================
   MAGNETIC PULL
===================================================== */

function magneticMove(
  event: React.MouseEvent<HTMLElement>,
  strength = 0.35
) {
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();

  const x =
    event.clientX -
    (rect.left + rect.width / 2);

  const y =
    event.clientY -
    (rect.top + rect.height / 2);

  el.style.transform =
    `translate(${x * strength}px, ${y * strength}px)`;
}

function magneticReset(
  event: React.MouseEvent<HTMLElement>
) {
  event.currentTarget.style.transform = "";
}


/* =====================================================
   TECHNOLOGY CARD
===================================================== */

function TechCard({
  technology,
}: {
  technology: (typeof technologies)[number];
}) {
  const cardRef =
    useRef<HTMLAnchorElement>(null);

  const handleMove = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    const el = cardRef.current;

    if (!el) return;

    const rect =
      el.getBoundingClientRect();

    const px =
      (event.clientX - rect.left) /
      rect.width;

    const py =
      (event.clientY - rect.top) /
      rect.height;

    const ry =
      (px - 0.5) * 14;

    const rx =
      (0.5 - py) * 14;

    el.style.setProperty(
      "--rx",
      `${rx}deg`
    );

    el.style.setProperty(
      "--ry",
      `${ry}deg`
    );
  };

  const handleLeave = () => {
    const el = cardRef.current;

    if (!el) return;

    el.style.setProperty(
      "--rx",
      "0deg"
    );

    el.style.setProperty(
      "--ry",
      "0deg"
    );
  };

  return (
    <Link
      href={`/technology/${technology.slug}`}
      className={`tech-card ${technology.color}`}
      data-reveal
      data-cursor="tech"
      data-cursor-color={technology.hex}
      data-cursor-symbol={technology.symbol}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      ref={cardRef}
    >

      <div className="tech-card-top">
        <span>
          {technology.number}
        </span>

        <span className="tech-arrow">
          ↗
        </span>
      </div>


      <div className="tech-symbol">
        {technology.symbol}
      </div>


      <div className="tech-content">

        <span className="tech-subtitle">
          {technology.subtitle}
        </span>

        <h3>
          {technology.title}
        </h3>

        <p>
          {technology.description}
        </p>

      </div>


      <div className="tech-line" />

    </Link>
  );
}


/* =====================================================
   HOME
===================================================== */

export default function Home() {

  /* =====================================================
     SCROLL REVEALS
  ===================================================== */

  useEffect(() => {

    const targets =
      document.querySelectorAll<HTMLElement>(
        "[data-reveal]"
      );

    const observer =
      new IntersectionObserver(
        (entries) => {

          entries.forEach(
            (entry) => {

              if (
                entry.isIntersecting
              ) {

                entry.target.classList.add(
                  "in-view"
                );

              }

            }
          );

        },
        {
          threshold: 0.2,
          rootMargin:
            "0px 0px -8% 0px",
        }
      );


    targets.forEach(
      (element) =>
        observer.observe(element)
    );


    return () =>
      observer.disconnect();

  }, []);


  return (
    <main className="site">


      {/* =====================================================
          FIXED 3D BACKDROP
      ===================================================== */}

      <div
        className="scene-fixed"
        aria-hidden="true"
      >
        <PhosdeepScene />
      </div>


      <CustomCursor />

      <HudFrame />

      <SiteNav />


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="hero">

        <div className="hero-grid" />

        <div className="hero-glow hero-glow-purple" />

        <div className="hero-glow hero-glow-blue" />


        <div className="hero-content">

          <div className="eyebrow">

            <span className="status-dot" />

            PHOSDEEP INTERNATIONAL

          </div>


          <h1>

            <span className="white-text">
              WE BUILD
            </span>

            <span className="gradient-text">
              THE FUTURE
              <span className="dot">
                .
              </span>
            </span>

          </h1>


          <p className="hero-description">
            Technology is moving faster
            than the world is learning.
            We build the people and
            technology to keep up.
          </p>


          <a
            href="#technology"
            className="hero-button"
            data-cursor="magnetic"
            data-cursor-label="GO"
            data-cursor-color="#2bd9ff"
            onMouseMove={(e) =>
              magneticMove(
                e,
                0.3
              )
            }
            onMouseLeave={
              magneticReset
            }
          >

            <span>
              EXPLORE THE SYSTEM
            </span>

            <span className="arrow">
              ↓
            </span>

          </a>

        </div>


        {/* =====================================================
            HERO 3D LABELS
        ===================================================== */}

        <div className="hero-3d">

          <div className="scene-label scene-label-top">
            QUANTUM SYSTEM

            <span>
              Q-01
            </span>
          </div>


          <div className="scene-data scene-data-left">

            <span>
              QUBIT STATES
            </span>

            <strong>
              010101
            </strong>

          </div>


          <div className="scene-data scene-data-right">

            <span>
              PROCESSING
            </span>

            <strong>
              10¹⁸ OPS
            </strong>

          </div>

        </div>


        <div className="scroll-indicator">

          <span>
            SCROLL TO ENTER
          </span>

          <div className="scroll-line" />

        </div>

      </section>


      {/* =====================================================
          TECHNOLOGY
      ===================================================== */}

      <section
        id="technology"
        className="technology"
      >

        <div
          className="technology-header"
          data-reveal
        >

          <div className="section-number">
          </div>


          <div className="tech-live-tag">

            <span className="hud-blink">
              ●
            </span>

            LIVE QUANTUM FIELD

          </div>


          <div className="section-heading">

            <span>
              THE FRONTIER
            </span>

            <h2>

              TECHNOLOGY

              <br />

              <span>
                WITHOUT LIMITS.
              </span>

            </h2>

          </div>


          <p className="section-description">
            We operate where emerging
            technology meets real-world
            problems — building, teaching
            and transforming what comes
            next.
          </p>


          <Link
            href="/technology"
            className="section-explore-link"
            data-cursor="link"
            data-cursor-label="EXPLORE"
            data-cursor-color="#a83cff"
          >

            EXPLORE ALL TECHNOLOGIES

            <span>
              ↗
            </span>

          </Link>

        </div>


        <div className="technology-grid">

          {technologies.map(
            (technology) => (
              <TechCard
                technology={
                  technology
                }
                key={
                  technology.number
                }
              />
            )
          )}

        </div>

      </section>


      {/* =====================================================
          ABOUT PREVIEW
      ===================================================== */}

      <section
        id="about"
        className="statement"
      >

        <div className="statement-orbit" />


        <div
          className="statement-small"
          data-reveal
        >
          THE PHOSDEEP MINDSET
        </div>


        <h2 data-reveal>

          DON&apos;T JUST

          <br />

          <span>
            LEARN
          </span>{" "}
          TECHNOLOGY.

          <br />

          BUILD

          <br />

          <span>
            WITH IT.
          </span>

        </h2>


        <div className="statement-gradient" />


        <Link
          href="/about"
          className="statement-link"
          data-cursor="magnetic"
          data-cursor-label="EXPLORE"
          data-cursor-color="#2bd9ff"
          onMouseMove={(e) =>
            magneticMove(
              e,
              0.25
            )
          }
          onMouseLeave={
            magneticReset
          }
        >

          DISCOVER PHOSDEEP

          <span>
            ↗
          </span>

        </Link>

      </section>


      {/* =====================================================
          TRAINING PREVIEW
      ===================================================== */}

      <section
        id="training"
        className="training"
      >

        <div className="section-number">
        </div>


        <div
          className="training-heading"
          data-reveal
        >

          <span className="section-label">
            PEOPLE × TECHNOLOGY
          </span>

          <h2>

            WE TRAIN

            <br />

            THE

            <br />

            <span>
              NEXT GENERATION.
            </span>

          </h2>

        </div>


        <div
          className="training-text"
          data-reveal
        >

          <div className="training-index">

            <span>
              PHOSDEEP / 2026
            </span>

            <span>
              INDIA → WORLD
            </span>

          </div>


          <p>
            From students discovering
            their first programming
            language to professionals
            entering offensive
            cybersecurity and artificial
            intelligence — we bridge
            the gap between education
            and industry.
          </p>


          <Link
            href="/training"
            className="text-link"
            data-cursor="link"
            data-cursor-label="EXPLORE"
            data-cursor-color="#557cff"
          >

            EXPLORE TRAINING

            <span>
              ↗
            </span>

          </Link>

        </div>

      </section>


      {/* =====================================================
          CONTACT PREVIEW
      ===================================================== */}

      <section
        id="contact"
        className="contact"
      >

        <div className="contact-grid" />

        <div className="contact-glow" />

        <div className="contact-background">
          PHOSDEEP
        </div>


        <span
          className="contact-label"
          data-reveal
        >
          HAVE A PROBLEM WORTH
          SOLVING?
        </span>


        <h2 data-reveal>

          LET&apos;S BUILD

          <br />

          SOMETHING

          <br />

          <span>
            IMPOSSIBLE.
          </span>

        </h2>


        <Link
          href="/contact"
          className="contact-button"
          data-reveal
          data-cursor="magnetic"
          data-cursor-label="CONTACT"
          data-cursor-color="#2bd9ff"
          onMouseMove={(e) =>
            magneticMove(
              e,
              0.3
            )
          }
          onMouseLeave={
            magneticReset
          }
        >

          START A CONVERSATION

          <span>
            ↗
          </span>

        </Link>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer>

        <Link
          href="/"
          className="logo"
          data-cursor="link"
          data-cursor-label="HOME"
          data-cursor-color="#38d9ff"
        >
          PHOS<span>DEEP</span>
        </Link>


        <div>
          © 2026 PHOSDEEP
          INTERNATIONAL
        </div>


        <div>
          DELHI · INDIA
        </div>

      </footer>

    </main>
  );
}