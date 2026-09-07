"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import CustomCursor from "@/components/CustomCursor";
import HudFrame from "@/components/HudFrame";
import SiteNav from "@/components/SiteNav";

const PhosdeepScene = dynamic(
  () => import("@/components/PhosdeepScene"),
  {
    ssr: false,
  }
);

/* =========================================================
   DATA
========================================================= */

const technologies = [
  {
    number: "01",
    title: "ARTIFICIAL",
    accent: "INTELLIGENCE",
    description:
      "Building intelligent systems that turn data, models and automation into useful products.",
    color: "#a83cff",
  },
  {
    number: "02",
    title: "CYBER",
    accent: "SECURITY",
    description:
      "Protecting systems, infrastructure and digital assets through offensive and defensive security.",
    color: "#2bd9ff",
  },
  {
    number: "03",
    title: "QUANTUM",
    accent: "COMPUTING",
    description:
      "Exploring computation beyond classical architectures and preparing for the next generation of technology.",
    color: "#557cff",
  },
  {
    number: "04",
    title: "BLOCKCHAIN",
    accent: "& WEB3",
    description:
      "Engineering decentralized systems, smart contracts and trustworthy digital infrastructure.",
    color: "#37e69c",
  },
  {
    number: "05",
    title: "CLOUD",
    accent: "& DEVOPS",
    description:
      "Designing scalable infrastructure that moves ideas from prototype to production.",
    color: "#ff7ad9",
  },
  {
    number: "06",
    title: "DATA",
    accent: "SCIENCE",
    description:
      "Turning complex datasets into insights, predictions and intelligent decision systems.",
    color: "#ffb347",
  },
];

const principles = [
  {
    number: "01",
    title: "BUILD",
    text: "We believe emerging technology is best understood by actually building with it.",
  },
  {
    number: "02",
    title: "EXPLORE",
    text: "We continuously investigate what is changing, what is possible and what comes next.",
  },
  {
    number: "03",
    title: "ENABLE",
    text: "We transfer technology knowledge to the people and organizations who need it.",
  },
];

const audiences = [
  "ENTERPRISES",
  "STARTUPS",
  "UNIVERSITIES",
  "GOVERNMENT",
  "RESEARCHERS",
  "TECHNOLOGY PROFESSIONALS",
];

/* =========================================================
   MAGNETIC BUTTON
========================================================= */

function magneticMove(
  event: React.MouseEvent<HTMLElement>,
  strength = 0.25
) {
  const element = event.currentTarget;
  const rect = element.getBoundingClientRect();

  const x =
    event.clientX -
    (rect.left + rect.width / 2);

  const y =
    event.clientY -
    (rect.top + rect.height / 2);

  element.style.transform =
    `translate(${x * strength}px, ${y * strength}px)`;
}

function magneticReset(
  event: React.MouseEvent<HTMLElement>
) {
  event.currentTarget.style.transform = "";
}

/* =========================================================
   ABOUT PAGE
========================================================= */

export default function AboutPage() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const documentHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

      if (documentHeight <= 0) {
        setScrollProgress(0);
        return;
      }

      setScrollProgress(
        Math.min(100, Math.max(0, (scrollTop / documentHeight) * 100))
      );
    };

    updateProgress();

    window.addEventListener(
      "scroll",
      updateProgress,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        updateProgress
      );
    };
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="site about-v2" id="main-content">

      {/* =====================================================
          GLOBAL 3D SCENE
      ===================================================== */}

      <div
        className="about-v2-scene"
        aria-hidden="true"
      >
        <PhosdeepScene />
      </div>

      <div className="about-v2-noise" />

      <CustomCursor />

      <HudFrame />


      {/* =====================================================
          SCROLL INDICATOR
      ===================================================== */}

      <div className="about-v2-scrollbar">
        <span>
          00
        </span>

        <div>
          <i
            style={{
              height: `${scrollProgress}%`,
            }}
          />
        </div>

        <span>
          07
        </span>
      </div>


      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <SiteNav />


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="about-v2-hero" data-reveal>

        <div className="about-v2-grid" />

        <div className="about-v2-hero-top">

          <span>
            PHOSDEEP INTERNATIONAL
          </span>

          <span>
            ABOUT / 03
          </span>

          <span>
            28°37&apos;N / 77°13&apos;E
          </span>

        </div>

        <div className="about-v2-hero-main">

          <div className="about-v2-kicker">

            <span className="about-v2-live-dot" />

            TECHNOLOGY × PEOPLE × IMPACT

          </div>

          <h1>

            WE

            <br />

            <span>
              BUILD
            </span>

            <br />

            WHAT&apos;S

            <br />

            <em>
              NEXT.
            </em>

          </h1>

          <p className="about-v2-hero-description">
            Phosdeep operates at the frontier of
            emerging technology — building systems,
            developing people and exploring what
            becomes possible next.
          </p>

        </div>

        <div className="about-v2-hero-bottom">

          <span>
            SCROLL TO EXPLORE
          </span>

          <div className="about-v2-arrow">
            ↓
          </div>

          <span>
            2026
          </span>

        </div>

        <div className="about-v2-hero-orbit">

          <div className="about-v2-orbit-ring ring-one" />
          <div className="about-v2-orbit-ring ring-two" />
          <div className="about-v2-orbit-ring ring-three" />

          <div className="about-v2-orbit-core">

            <span>
              P
            </span>

          </div>

          <span className="orbit-label orbit-label-one">
            AI
          </span>

          <span className="orbit-label orbit-label-two">
            CYBER
          </span>

          <span className="orbit-label orbit-label-three">
            QC
          </span>

          <span className="orbit-label orbit-label-four">
            WEB3
          </span>

        </div>

      </section>


      {/* =====================================================
          INTRODUCTION
      ===================================================== */}

      <section className="about-v2-intro" data-reveal>

        <div className="about-v2-section-meta">

          <span>
            01
          </span>

          <span>
            THE GAP
          </span>

        </div>

        <div className="about-v2-intro-content">

          <div className="about-v2-intro-statement">

            Technology is moving
            <span>
              faster
            </span>
            than the world is learning.

          </div>

          <div className="about-v2-intro-copy">

            <p className="large">
              We exist in that gap.
            </p>

            <p>
              Phosdeep International is a
              technology company focused on
              emerging technologies and the
              people who build them.
            </p>

            <p>
              We work across Artificial Intelligence,
              Generative AI, Cybersecurity, Quantum
              Computing, Blockchain, Cloud Computing,
              Data Science and other rapidly evolving
              fields.
            </p>

            <p>
              Our work sits between exploration
              and execution — taking ideas from
              research and experimentation into
              practical systems, products and
              capabilities.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          WHAT WE DO
      ===================================================== */}

      <section className="about-v2-capabilities" data-reveal>

        <div className="about-v2-section-heading">

          <div className="about-v2-section-number">
            02
          </div>

          <div>

            <span>
              WHAT WE DO
            </span>

            <h2>
              FROM
              <br />
              <strong>
                POSSIBILITY
              </strong>
              <br />
              TO IMPACT.
            </h2>

          </div>

          <p>
            We don&apos;t separate technology,
            education and innovation.
            We connect them.
          </p>

        </div>

        <div className="about-v2-capability-layout">

          <div className="about-v2-capability-intro">

            <div className="about-v2-big-number">
              03
            </div>

            <p>
              Three connected ways we create
              value.
            </p>

          </div>

          <div className="about-v2-capability-list">

            <div className="about-v2-capability-row">

              <span>
                01
              </span>

              <div>

                <h3>
                  TECHNOLOGY
                </h3>

                <p>
                  We design and build technology
                  solutions around emerging
                  technologies and real-world
                  problems.
                </p>

              </div>

              <span className="row-arrow">
                ↗
              </span>

            </div>

            <div className="about-v2-capability-row">

              <span>
                02
              </span>

              <div>

                <h3>
                  TRAINING
                </h3>

                <p>
                  We create practical, industry-led
                  learning experiences that turn
                  knowledge into capability.
                </p>

              </div>

              <span className="row-arrow">
                ↗
              </span>

            </div>

            <div className="about-v2-capability-row">

              <span>
                03
              </span>

              <div>

                <h3>
                  CONSULTING
                </h3>

                <p>
                  We help organizations understand,
                  adopt and apply technologies that
                  can change the way they operate.
                </p>

              </div>

              <span className="row-arrow">
                ↗
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          TECHNOLOGY FRONTIER
      ===================================================== */}

      <section className="about-v2-tech" data-reveal>

        <div className="about-v2-tech-header">

          <div>

            <span>
              03 — TECHNOLOGY FRONTIER
            </span>

            <h2>
              OUR DOMAINS
              <br />
              <span>
                STACK.
              </span>
            </h2>

          </div>

          <p>
            A constantly evolving technology
            landscape. We move with it.
          </p>

        </div>

        <div className="about-v2-tech-grid">

          {technologies.map(
            (technology) => (

              <article
                className="about-v2-tech-card"
                key={technology.number}
                style={
                  {
                    "--tech-color":
                      technology.color,
                  } as React.CSSProperties
                }
              >

                <div className="tech-card-top">

                  <span>
                    {technology.number}
                  </span>

                  <span>
                    ↗
                  </span>

                </div>

                <div className="tech-card-line" />

                <div className="tech-card-content">

                  <h3>
                    {technology.title}
                  </h3>

                  <h4>
                    {technology.accent}
                  </h4>

                  <p>
                    {technology.description}
                  </p>

                </div>

                <div className="tech-card-glow" />

              </article>

            )
          )}

        </div>

      </section>


      {/* =====================================================
          MISSION
      ===================================================== */}

      <section className="about-v2-mission" data-reveal>

        <div className="mission-grid" />

        <div className="mission-label">
          04 — OUR MISSION
        </div>

        <div className="mission-content">

          <div className="mission-small">
            THE FUTURE IS NOT
            SOMETHING WE WAIT FOR.
          </div>

          <h2>

            WE

            <span>
              PREPARE
            </span>

            <br />

            PEOPLE

            <br />

            TO BUILD IT.

          </h2>

          <p>
            Our mission is to make emerging
            technology understandable,
            accessible and actionable —
            for individuals, organizations
            and the industries of tomorrow.
          </p>

        </div>

        <div className="mission-side-data">

          <span>
            PEOPLE
          </span>

          <span>
            TECHNOLOGY
          </span>

          <span>
            IMPACT
          </span>

        </div>

      </section>


      {/* =====================================================
          PHILOSOPHY
      ===================================================== */}

      <section className="about-v2-philosophy" data-reveal>

        <div className="about-v2-section-meta">

          <span>
            05
          </span>

          <span>
            THE PHOSDEEP MINDSET
          </span>

        </div>

        <div className="philosophy-heading">

          <h2>
            HOW
            <br />
            WE
            <br />
            <span>
              THINK.
            </span>
          </h2>

          <p>
            Technology changes.
            Curiosity doesn&apos;t.
          </p>

        </div>

        <div className="philosophy-list">

          {principles.map(
            (principle) => (

              <div
                className="philosophy-row"
                key={principle.number}
              >

                <span>
                  {principle.number}
                </span>

                <h3>
                  {principle.title}
                </h3>

                <p>
                  {principle.text}
                </p>

                <span className="philosophy-arrow">
                  →
                </span>

              </div>

            )
          )}

        </div>

      </section>


      {/* =====================================================
          WHO WE WORK WITH
      ===================================================== */}

      <section className="about-v2-audience" data-reveal>

        <div className="audience-left">

          <span>
            06 — WHO WE WORK WITH
          </span>

          <h2>
            BUILT
            <br />
            FOR
            <br />
            <span>
              PEOPLE
            </span>
            <br />
            MOVING
            <br />
            FORWARD.
          </h2>

        </div>

        <div className="audience-right">

          <p>
            From organizations adopting new
            technology to individuals building
            the next generation of systems,
            we work with people who refuse
            to stand still.
          </p>

          <div className="audience-tags">

            {audiences.map(
              (audience, index) => (

                <div
                  key={audience}
                  className="audience-tag"
                >

                  <span>
                    0{index + 1}
                  </span>

                  {audience}

                </div>

              )
            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="about-v2-final" data-reveal>

        <div className="final-radial" />

        <span>
          PHOSDEEP INTERNATIONAL
        </span>

        <h2>

          LEARN.

          <br />

          BUILD.

          <br />

          <em>
            TRANSFORM.
          </em>

        </h2>

        <p>
          Technology is only as powerful
          as the people who know how to
          use it.
        </p>

        <Link
          href="/contact"
          className="about-v2-cta"
          data-cursor="magnetic"
          data-cursor-label="TALK"
          data-cursor-color="#2bd9ff"
          onMouseMove={(e) =>
            magneticMove(e, 0.3)
          }
          onMouseLeave={magneticReset}
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

      <footer className="about-v2-footer">

        <Link
          href="/"
          className="logo"
        >
          PHOS<span>DEEP</span>
        </Link>

        <span>
          © 2026 PHOSDEEP INTERNATIONAL
        </span>

        <span>
          DELHI · INDIA
        </span>

      </footer>


      {/* =====================================================
          ABOUT V2 STYLES
      ===================================================== */}

      <style jsx global>{`

        /* =====================================================
           ROOT
        ===================================================== */

        .about-v2 {
          --purple: #a83cff;
          --blue: #557cff;
          --cyan: #2bd9ff;
          --green: #37e69c;

          position: relative;
          min-height: 100vh;
          overflow-x: hidden;
          background:
            radial-gradient(
              circle at 75% 8%,
              rgba(168,60,255,.08),
              transparent 28%
            ),
            radial-gradient(
              circle at 15% 45%,
              rgba(43,217,255,.035),
              transparent 30%
            ),
            #05030b;

          color: #f7f5fb;
        }

        .about-v2 * {
          box-sizing: border-box;
        }


        /* =====================================================
           BACKGROUND
        ===================================================== */

        .about-v2-scene {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: .24;
          overflow: hidden;
        }

        .about-v2-scene canvas {
          width: 100% !important;
          height: 100% !important;
          display: block !important;
          background: transparent !important;
        }

        .about-v2-noise {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          opacity: .025;

          background-image:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E");
        }


        /* =====================================================
           NAV
        ===================================================== */

        .about-v2-nav {
          position: fixed !important;
          z-index: 1000 !important;
        }


        /* =====================================================
           SCROLL INDICATOR
        ===================================================== */

        .about-v2-scrollbar {
          position: fixed;
          right: 24px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 20;

          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;

          font-family: var(--font-geist-mono), monospace;
          font-size: 7px;
          letter-spacing: .12em;

          color: rgba(255,255,255,.28);
        }

        .about-v2-scrollbar > div {
          width: 1px;
          height: 100px;
          background: rgba(255,255,255,.1);
          position: relative;
        }

        .about-v2-scrollbar i {
          position: absolute;
          left: 0;
          top: 0;
          width: 1px;
          background: #2bd9ff;
          transition: height .15s linear;
        }


        /* =====================================================
           HERO
        ===================================================== */

        .about-v2-hero {
          min-height: 100svh;
          position: relative;
          z-index: 2;
          overflow: hidden;

          display: flex;
          align-items: center;

          padding:
            150px
            8vw
            100px;

          border-bottom:
            1px solid rgba(255,255,255,.07);
        }

        .about-v2-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;

          opacity: .055;

          background-image:
            linear-gradient(
              rgba(168,60,255,.35) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(168,60,255,.35) 1px,
              transparent 1px
            );

          background-size: 80px 80px;

          mask-image:
            linear-gradient(
              to bottom,
              black,
              rgba(0,0,0,.6) 60%,
              transparent
            );
        }

        .about-v2-hero-top {
          position: absolute;
          left: 8vw;
          right: 8vw;
          top: 112px;

          display: flex;
          justify-content: space-between;

          font-family:
            var(--font-geist-mono),
            monospace;

          font-size: 8px;
          letter-spacing: .18em;
          text-transform: uppercase;

          color: rgba(255,255,255,.27);
        }

        .about-v2-hero-main {
          position: relative;
          z-index: 4;
          max-width: 950px;
        }

        .about-v2-kicker {
          display: flex;
          align-items: center;
          gap: 10px;

          margin-bottom: 32px;

          font-family:
            var(--font-geist-mono),
            monospace;

          font-size: 9px;
          letter-spacing: .18em;
          text-transform: uppercase;

          color: rgba(255,255,255,.42);
        }

        .about-v2-live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;

          background: #37e69c;

          box-shadow:
            0 0 14px
            rgba(55,230,156,.8);

          animation:
            aboutPulse 2s ease-in-out infinite;
        }

        @keyframes aboutPulse {

          0%,
          100% {
            opacity: .4;
            transform: scale(.8);
          }

          50% {
            opacity: 1;
            transform: scale(1);
          }

        }

        .about-v2-hero h1 {
          margin: 0;

          font-family:
            "Space Grotesk",
            sans-serif;

          font-size:
            clamp(
              72px,
              9.5vw,
              145px
            );

          font-weight: 600;

          line-height: .76;

          letter-spacing: -.095em;

          text-transform: uppercase;
        }

        .about-v2-hero h1 span {
          color: transparent;

          background:
            linear-gradient(
              100deg,
              #a83cff,
              #557cff 45%,
              #2bd9ff
            );

          -webkit-background-clip: text;
          background-clip: text;
        }

        .about-v2-hero h1 em {
          font-style: normal;
          color: transparent;

          background:
            linear-gradient(
              100deg,
              #2bd9ff,
              #37e69c
            );

          -webkit-background-clip: text;
          background-clip: text;
        }

        .about-v2-hero-description {
          max-width: 480px;

          margin:
            45px 0 0 7px;

          font-size: 15px;
          line-height: 1.8;

          color:
            rgba(255,255,255,.43);
        }


        /* =====================================================
           HERO ORBIT
        ===================================================== */

        .about-v2-hero-orbit {
          position: absolute;

          right: -30px;
          top: 50%;

          width: min(43vw, 650px);
          aspect-ratio: 1;

          transform:
            translateY(-50%);

          z-index: 2;

          opacity: .72;
        }

        .about-v2-orbit-ring {
          position: absolute;

          left: 50%;
          top: 50%;

          border:
            1px solid
            rgba(168,60,255,.22);

          border-radius: 50%;

          transform:
            translate(-50%,-50%);

          animation:
            orbitSpin
            24s
            linear
            infinite;
        }

        .ring-one {
          width: 42%;
          height: 42%;
        }

        .ring-two {
          width: 67%;
          height: 67%;

          border-color:
            rgba(43,217,255,.16);

          animation-direction:
            reverse;

          animation-duration:
            30s;
        }

        .ring-three {
          width: 91%;
          height: 91%;

          border-color:
            rgba(85,124,255,.11);

          animation-duration:
            42s;
        }

        @keyframes orbitSpin {
          from {
            transform:
              translate(-50%,-50%)
              rotate(0deg);
          }

          to {
            transform:
              translate(-50%,-50%)
              rotate(360deg);
          }
        }

        .about-v2-orbit-core {
          position: absolute;

          left: 50%;
          top: 50%;

          width: 92px;
          height: 92px;

          transform:
            translate(-50%,-50%);

          border-radius: 50%;

          display: grid;
          place-items: center;

          background:
            radial-gradient(
              circle,
              rgba(168,60,255,.35),
              rgba(85,124,255,.08) 45%,
              transparent 72%
            );

          border:
            1px solid
            rgba(255,255,255,.15);

          box-shadow:
            0 0 80px
            rgba(168,60,255,.2);
        }

        .about-v2-orbit-core span {
          font-family:
            "Space Grotesk",
            sans-serif;

          font-size: 35px;
          font-weight: 600;

          color: #fff;
        }

        .orbit-label {
          position: absolute;

          font-family:
            var(--font-geist-mono),
            monospace;

          font-size: 8px;
          letter-spacing: .15em;

          color:
            rgba(255,255,255,.4);
        }

        .orbit-label-one {
          top: 9%;
          left: 52%;
        }

        .orbit-label-two {
          top: 51%;
          left: 3%;
        }

        .orbit-label-three {
          bottom: 8%;
          left: 50%;
        }

        .orbit-label-four {
          top: 49%;
          right: 2%;
        }

        .about-v2-hero-bottom {
          position: absolute;
          left: 8vw;
          right: 8vw;
          bottom: 30px;

          display: flex;
          justify-content: space-between;
          align-items: center;

          font-family:
            var(--font-geist-mono),
            monospace;

          font-size: 8px;
          letter-spacing: .18em;

          color:
            rgba(255,255,255,.25);
        }

        .about-v2-arrow {
          position: absolute;
          left: 50%;

          transform:
            translateX(-50%);

          font-size: 18px;

          color:
            rgba(255,255,255,.45);
        }


        /* =====================================================
           SHARED
        ===================================================== */

        .about-v2-intro,
        .about-v2-capabilities,
        .about-v2-tech,
        .about-v2-philosophy,
        .about-v2-audience {
          position: relative;
          z-index: 2;

          border-bottom:
            1px solid rgba(255,255,255,.07);
        }

        .about-v2-section-meta {
          display: flex;
          justify-content: space-between;

          font-family:
            var(--font-geist-mono),
            monospace;

          font-size: 8px;
          letter-spacing: .18em;
          text-transform: uppercase;

          color:
            rgba(255,255,255,.25);
        }


        /* =====================================================
           INTRO
        ===================================================== */

        .about-v2-intro {
          padding:
            150px 8vw
            180px;
        }

        .about-v2-intro-content {
          display: grid;

          grid-template-columns:
            1.1fr
            .9fr;

          gap: 10vw;

          margin-top: 100px;
        }

        .about-v2-intro-statement {
          max-width: 850px;

          font-family:
            "Space Grotesk",
            sans-serif;

          font-size:
            clamp(50px,6.5vw,105px);

          font-weight: 500;

          line-height: .88;

          letter-spacing: -.075em;
        }

        .about-v2-intro-statement span {
          display: inline-block;
          margin-left: 12px;

          color: transparent;

          background:
            linear-gradient(
              100deg,
              #a83cff,
              #2bd9ff
            );

          -webkit-background-clip: text;
          background-clip: text;
        }

        .about-v2-intro-copy {
          padding-top: 12px;
          max-width: 560px;
        }

        .about-v2-intro-copy p {
          margin: 0 0 28px;

          font-size: 14px;
          line-height: 1.85;

          color:
            rgba(255,255,255,.4);
        }

        .about-v2-intro-copy .large {
          margin-bottom: 35px;

          font-family:
            "Space Grotesk",
            sans-serif;

          font-size: 26px;
          line-height: 1.2;

          color:
            rgba(255,255,255,.82);
        }


        /* =====================================================
           CAPABILITIES
        ===================================================== */

        .about-v2-capabilities {
          padding:
            160px 8vw
            180px;
        }

        .about-v2-section-heading {
          display: grid;

          grid-template-columns:
            70px
            1fr
            280px;

          gap: 45px;

          align-items: end;

          margin-bottom: 110px;
        }

        .about-v2-section-number {
          font-family:
            var(--font-geist-mono),
            monospace;

          font-size: 9px;
          color:
            rgba(255,255,255,.25);
        }

        .about-v2-section-heading > div:nth-child(2) > span,
        .about-v2-tech-header span,
        .about-v2-tech-header + p {
          font-family:
            var(--font-geist-mono),
            monospace;

          font-size: 8px;
          letter-spacing: .18em;

          color:
            rgba(255,255,255,.27);
        }

        .about-v2-section-heading h2,
        .about-v2-tech-header h2,
        .philosophy-heading h2 {
          margin: 28px 0 0;

          font-family:
            "Space Grotesk",
            sans-serif;

          font-size:
            clamp(55px,7vw,110px);

          font-weight: 600;

          line-height: .82;

          letter-spacing: -.085em;
        }

        .about-v2-section-heading h2 strong {
          font-weight: inherit;

          color: transparent;

          background:
            linear-gradient(
              100deg,
              #a83cff,
              #557cff,
              #2bd9ff
            );

          -webkit-background-clip: text;
          background-clip: text;
        }

        .about-v2-section-heading > p {
          margin: 0;

          font-size: 13px;
          line-height: 1.8;

          color:
            rgba(255,255,255,.35);
        }

        .about-v2-capability-layout {
          display: grid;

          grid-template-columns:
            .7fr
            1.3fr;

          gap: 10vw;
        }

        .about-v2-capability-intro {
          border-top:
            1px solid rgba(255,255,255,.1);

          padding-top: 20px;
        }

        .about-v2-big-number {
          font-family:
            "Space Grotesk",
            sans-serif;

          font-size:
            clamp(110px,15vw,230px);

          line-height: .7;

          letter-spacing: -.1em;

          color:
            rgba(255,255,255,.035);
        }

        .about-v2-capability-intro p {
          max-width: 180px;

          margin-top: 35px;

          font-family:
            var(--font-geist-mono),
            monospace;

          font-size: 8px;
          line-height: 1.8;
          letter-spacing: .12em;

          color:
            rgba(255,255,255,.28);
        }

        .about-v2-capability-list {
          border-top:
            1px solid rgba(255,255,255,.1);
        }

        .about-v2-capability-row {
          min-height: 175px;

          display: grid;

          grid-template-columns:
            55px
            1fr
            30px;

          gap: 20px;

          align-items: center;

          border-bottom:
            1px solid rgba(255,255,255,.1);

          transition:
            padding .4s ease,
            background .4s ease;
        }

        .about-v2-capability-row:hover {
          padding-left: 16px;

          background:
            rgba(255,255,255,.018);
        }

        .about-v2-capability-row > span:first-child,
        .row-arrow {
          font-family:
            var(--font-geist-mono),
            monospace;

          font-size: 8px;

          color:
            rgba(255,255,255,.25);
        }

        .about-v2-capability-row h3 {
          margin: 0;

          font-family:
            "Space Grotesk",
            sans-serif;

          font-size: 31px;
          font-weight: 500;

          letter-spacing: -.045em;
        }

        .about-v2-capability-row p {
          max-width: 510px;

          margin: 12px 0 0;

          font-size: 12px;
          line-height: 1.7;

          color:
            rgba(255,255,255,.32);
        }

        .row-arrow {
          transition:
            transform .3s ease,
            color .3s ease;
        }

        .about-v2-capability-row:hover .row-arrow {
          transform:
            translate(4px,-4px);

          color:
            #2bd9ff;
        }


        /* =====================================================
           TECHNOLOGY
        ===================================================== */

        .about-v2-tech {
          padding:
            160px 8vw
            190px;
        }

        .about-v2-tech-header {
          display: grid;

          grid-template-columns:
            1fr
            280px;

          gap: 80px;

          align-items: end;

          margin-bottom: 90px;
        }

        .about-v2-tech-header h2 span {
          color: transparent;

          background:
            linear-gradient(
              100deg,
              #557cff,
              #2bd9ff
            );

          -webkit-background-clip: text;
          background-clip: text;
        }

        .about-v2-tech-grid {
          display: grid;

          grid-template-columns:
            repeat(3,1fr);

          border-top:
            1px solid rgba(255,255,255,.1);

          border-left:
            1px solid rgba(255,255,255,.1);
        }

        .about-v2-tech-card {
          position: relative;

          min-height: 390px;

          padding: 30px;

          overflow: hidden;

          border-right:
            1px solid rgba(255,255,255,.1);

          border-bottom:
            1px solid rgba(255,255,255,.1);

          transition:
            transform .45s cubic-bezier(.16,1,.3,1),
            background .4s ease;
        }

        .about-v2-tech-card:hover {
          transform:
            translateY(-8px);

          background:
            rgba(255,255,255,.018);
        }

        .tech-card-top {
          display: flex;
          justify-content: space-between;

          font-family:
            var(--font-geist-mono),
            monospace;

          font-size: 8px;
          letter-spacing: .12em;

          color:
            rgba(255,255,255,.25);
        }

        .tech-card-line {
          width: 0;
          height: 2px;

          margin-top: 28px;

          background:
            var(--tech-color);

          box-shadow:
            0 0 20px
            color-mix(
              in srgb,
              var(--tech-color),
              transparent 45%
            );

          transition:
            width .6s
            cubic-bezier(.16,1,.3,1);
        }

        .about-v2-tech-card:hover
        .tech-card-line {
          width: 100%;
        }

        .tech-card-content {
          position: absolute;

          left: 30px;
          right: 30px;
          bottom: 30px;
        }

        .tech-card-content h3 {
          margin: 0;

          font-family:
            "Space Grotesk",
            sans-serif;

          font-size: 32px;
          font-weight: 500;

          line-height: .9;

          letter-spacing: -.06em;
        }

        .tech-card-content h4 {
          margin: 5px 0 0;

          font-family:
            "Space Grotesk",
            sans-serif;

          font-size: 32px;
          font-weight: 500;

          line-height: .9;

          letter-spacing: -.06em;

          color:
            var(--tech-color);
        }

        .tech-card-content p {
          max-width: 330px;

          margin: 22px 0 0;

          font-size: 11px;
          line-height: 1.8;

          color:
            rgba(255,255,255,.32);
        }

        .tech-card-glow {
          position: absolute;

          width: 250px;
          height: 250px;

          right: -140px;
          top: -140px;

          border-radius: 50%;

          background:
            var(--tech-color);

          opacity: 0;

          filter:
            blur(90px);

          transition:
            opacity .5s ease;
        }

        .about-v2-tech-card:hover
        .tech-card-glow {
          opacity: .11;
        }


        /* =====================================================
           MISSION
        ===================================================== */

        .about-v2-mission {
          position: relative;

          min-height: 100svh;

          display: flex;
          align-items: center;

          padding:
            160px 8vw;

          overflow: hidden;

          border-bottom:
            1px solid rgba(255,255,255,.07);

          background:
            radial-gradient(
              circle at 75% 50%,
              rgba(43,217,255,.055),
              transparent 40%
            );
        }

        .mission-grid {
          position: absolute;
          inset: 0;

          opacity: .045;

          background-image:
            linear-gradient(
              rgba(43,217,255,.3) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(43,217,255,.3) 1px,
              transparent 1px
            );

          background-size: 100px 100px;

          mask-image:
            radial-gradient(
              circle at 70% 50%,
              black,
              transparent 65%
            );
        }

        .mission-label {
          position: absolute;

          left: 8vw;
          top: 80px;

          font-family:
            var(--font-geist-mono),
            monospace;

          font-size: 8px;
          letter-spacing: .18em;

          color:
            rgba(255,255,255,.25);
        }

        .mission-content {
          position: relative;
          z-index: 2;

          max-width: 1100px;
        }

        .mission-small {
          margin-bottom: 35px;

          font-family:
            var(--font-geist-mono),
            monospace;

          font-size: 8px;
          letter-spacing: .18em;

          color:
            rgba(255,255,255,.27);
        }

        .mission-content h2 {
          margin: 0;

          font-family:
            "Space Grotesk",
            sans-serif;

          font-size:
            clamp(60px,9vw,145px);

          font-weight: 600;

          line-height: .76;

          letter-spacing: -.095em;
        }

        .mission-content h2 span {
          color: transparent;

          background:
            linear-gradient(
              100deg,
              #37e69c,
              #2bd9ff
            );

          -webkit-background-clip: text;
          background-clip: text;
        }

        .mission-content p {
          max-width: 580px;

          margin:
            55px 0 0 5px;

          font-size: 14px;
          line-height: 1.85;

          color:
            rgba(255,255,255,.4);
        }

        .mission-side-data {
          position: absolute;

          right: 8vw;
          bottom: 80px;

          display: flex;
          flex-direction: column;

          align-items: flex-end;

          gap: 8px;

          font-family:
            var(--font-geist-mono),
            monospace;

          font-size: 8px;
          letter-spacing: .18em;

          color:
            rgba(255,255,255,.2);
        }

        .mission-side-data span:nth-child(2) {
          color: #2bd9ff;
        }


        /* =====================================================
           PHILOSOPHY
        ===================================================== */

        .about-v2-philosophy {
          padding:
            160px 8vw
            180px;
        }

        .philosophy-heading {
          display: grid;

          grid-template-columns:
            1fr
            300px;

          gap: 80px;

          align-items: end;

          margin:
            90px 0 100px;
        }

        .philosophy-heading h2 span {
          color: transparent;

          background:
            linear-gradient(
              100deg,
              #a83cff,
              #557cff,
              #2bd9ff
            );

          -webkit-background-clip: text;
          background-clip: text;
        }

        .philosophy-heading p {
          margin: 0;

          font-size: 14px;
          line-height: 1.8;

          color:
            rgba(255,255,255,.35);
        }

        .philosophy-list {
          border-top:
            1px solid rgba(255,255,255,.1);
        }

        .philosophy-row {
          min-height: 145px;

          display: grid;

          grid-template-columns:
            70px
            .6fr
            1fr
            30px;

          gap: 30px;

          align-items: center;

          border-bottom:
            1px solid rgba(255,255,255,.1);

          transition:
            padding .4s ease,
            background .4s ease;
        }

        .philosophy-row:hover {
          padding-left: 15px;

          background:
            rgba(255,255,255,.015);
        }

        .philosophy-row > span:first-child,
        .philosophy-arrow {
          font-family:
            var(--font-geist-mono),
            monospace;

          font-size: 8px;

          color:
            rgba(255,255,255,.25);
        }

        .philosophy-row h3 {
          margin: 0;

          font-family:
            "Space Grotesk",
            sans-serif;

          font-size: 31px;
          font-weight: 500;

          letter-spacing: -.05em;
        }

        .philosophy-row p {
          max-width: 450px;

          margin: 0;

          font-size: 12px;
          line-height: 1.8;

          color:
            rgba(255,255,255,.35);
        }

        .philosophy-row:hover
        .philosophy-arrow {
          color: #2bd9ff;
        }


        /* =====================================================
           AUDIENCE
        ===================================================== */

        .about-v2-audience {
          display: grid;

          grid-template-columns:
            1fr
            1fr;

          gap: 10vw;

          padding:
            160px 8vw
            190px;
        }

        .audience-left > span {
          font-family:
            var(--font-geist-mono),
            monospace;

          font-size: 8px;
          letter-spacing: .18em;

          color:
            rgba(255,255,255,.25);
        }

        .audience-left h2 {
          margin: 65px 0 0;

          font-family:
            "Space Grotesk",
            sans-serif;

          font-size:
            clamp(55px,7vw,115px);

          font-weight: 600;

          line-height: .8;

          letter-spacing: -.09em;
        }

        .audience-left h2 span {
          color: transparent;

          background:
            linear-gradient(
              100deg,
              #557cff,
              #2bd9ff
            );

          -webkit-background-clip: text;
          background-clip: text;
        }

        .audience-right {
          padding-top: 80px;
        }

        .audience-right > p {
          max-width: 500px;

          margin: 0 0 65px;

          font-size: 16px;
          line-height: 1.8;

          color:
            rgba(255,255,255,.43);
        }

        .audience-tags {
          border-top:
            1px solid rgba(255,255,255,.1);
        }

        .audience-tag {
          min-height: 65px;

          display: grid;

          grid-template-columns:
            45px 1fr;

          align-items: center;

          border-bottom:
            1px solid rgba(255,255,255,.1);

          font-family:
            "Space Grotesk",
            sans-serif;

          font-size: 15px;
          letter-spacing: -.02em;

          transition:
            padding .3s ease,
            background .3s ease;
        }

        .audience-tag:hover {
          padding-left: 12px;

          background:
            rgba(255,255,255,.015);
        }

        .audience-tag span {
          font-family:
            var(--font-geist-mono),
            monospace;

          font-size: 8px;

          color:
            rgba(255,255,255,.23);
        }


        /* =====================================================
           FINAL
        ===================================================== */

        .about-v2-final {
          position: relative;
          z-index: 2;

          min-height: 90svh;

          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: center;

          padding:
            130px 8vw;

          text-align: center;

          overflow: hidden;

          border-bottom:
            1px solid rgba(255,255,255,.07);
        }

        .final-radial {
          position: absolute;

          width: 700px;
          height: 700px;

          left: 50%;
          top: 50%;

          transform:
            translate(-50%,-50%);

          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              rgba(168,60,255,.11),
              rgba(85,124,255,.04) 40%,
              transparent 70%
            );

          filter: blur(30px);

          pointer-events: none;
        }

        .about-v2-final > span {
          position: relative;
          z-index: 2;

          font-family:
            var(--font-geist-mono),
            monospace;

          font-size: 8px;
          letter-spacing: .2em;

          color:
            rgba(255,255,255,.27);
        }

        .about-v2-final h2 {
          position: relative;
          z-index: 2;

          margin:
            45px 0 45px;

          font-family:
            "Space Grotesk",
            sans-serif;

          font-size:
            clamp(70px,10vw,165px);

          font-weight: 600;

          line-height: .76;

          letter-spacing: -.1em;
        }

        .about-v2-final h2 em {
          font-style: normal;

          color: transparent;

          background:
            linear-gradient(
              100deg,
              #a83cff,
              #557cff,
              #2bd9ff
            );

          -webkit-background-clip: text;
          background-clip: text;
        }

        .about-v2-final p {
          position: relative;
          z-index: 2;

          max-width: 450px;

          margin: 0 0 40px;

          font-size: 13px;
          line-height: 1.8;

          color:
            rgba(255,255,255,.38);
        }

        .about-v2-cta {
          position: relative;
          z-index: 3;

          display: inline-flex;
          align-items: center;
          gap: 18px;

          min-height: 54px;

          padding:
            0 24px;

          border:
            1px solid rgba(255,255,255,.18);

          color: #fff;

          text-decoration: none;

          font-family:
            var(--font-geist-mono),
            monospace;

          font-size: 8px;
          letter-spacing: .14em;

          background:
            rgba(255,255,255,.025);

          backdrop-filter:
            blur(15px);

          transition:
            background .3s ease,
            border-color .3s ease;
        }

        .about-v2-cta:hover {
          background:
            rgba(255,255,255,.07);

          border-color:
            rgba(43,217,255,.45);
        }

        .about-v2-cta span {
          font-size: 15px;
        }


        /* =====================================================
           FOOTER
        ===================================================== */

        .about-v2-footer {
          position: relative;
          z-index: 3;

          min-height: 110px;

          display: grid;

          grid-template-columns:
            1fr
            1fr
            1fr;

          align-items: center;

          padding:
            0 8vw;

          font-family:
            var(--font-geist-mono),
            monospace;

          font-size: 8px;
          letter-spacing: .1em;

          color:
            rgba(255,255,255,.23);
        }

        .about-v2-footer > span:nth-child(2) {
          text-align: center;
        }

        .about-v2-footer > span:last-child {
          text-align: right;
        }


        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 1050px) {

          .about-v2-hero-orbit {
            opacity: .32;
            right: -150px;
          }

          .about-v2-section-heading {
            grid-template-columns:
              50px
              1fr;
          }

          .about-v2-section-heading > p {
            grid-column: 2;
            max-width: 500px;
          }

          .about-v2-capability-layout {
            grid-template-columns: 1fr;
          }

          .about-v2-capability-intro {
            display: none;
          }

          .about-v2-tech-grid {
            grid-template-columns:
              repeat(2,1fr);
          }

          .about-v2-audience {
            gap: 70px;
          }

        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 700px) {

          .about-v2-scrollbar {
            display: none;
          }

          .about-v2-hero {
            min-height: 100svh;

            align-items: flex-start;

            padding:
              145px 22px
              90px;
          }

          .about-v2-hero-top {
            left: 22px;
            right: 22px;
            top: 105px;

            font-size: 6px;
          }

          .about-v2-hero-top span:nth-child(3) {
            display: none;
          }

          .about-v2-hero-main {
            max-width: 100%;
          }

          .about-v2-kicker {
            font-size: 7px;
            margin-bottom: 28px;
          }

          .about-v2-hero h1 {
            font-size:
              clamp(66px,17vw,100px);

            line-height: .79;
          }

          .about-v2-hero-description {
            margin-top: 35px;
            margin-left: 0;

            max-width: 320px;

            font-size: 12px;
            line-height: 1.75;
          }

          .about-v2-hero-orbit {
            width: 370px;

            right: -175px;
            top: 58%;

            opacity: .22;
          }

          .about-v2-hero-bottom {
            left: 22px;
            right: 22px;
            bottom: 25px;

            font-size: 6px;
          }

          .about-v2-intro,
          .about-v2-capabilities,
          .about-v2-tech,
          .about-v2-philosophy,
          .about-v2-audience {
            padding:
              105px 22px
              120px;
          }

          .about-v2-intro-content {
            grid-template-columns: 1fr;

            gap: 55px;

            margin-top: 60px;
          }

          .about-v2-intro-statement {
            font-size:
              clamp(46px,13vw,75px);
          }

          .about-v2-intro-copy {
            padding: 0;
          }

          .about-v2-intro-copy p {
            font-size: 12px;
          }

          .about-v2-intro-copy .large {
            font-size: 21px;
          }

          .about-v2-section-heading,
          .about-v2-tech-header,
          .philosophy-heading {
            grid-template-columns: 1fr;

            gap: 35px;

            margin-bottom: 65px;
          }

          .about-v2-section-heading > p {
            grid-column: auto;
          }

          .about-v2-section-heading h2,
          .about-v2-tech-header h2,
          .philosophy-heading h2 {
            font-size:
              clamp(48px,13vw,80px);
          }

          .about-v2-capability-row {
            min-height: 180px;

            grid-template-columns:
              35px
              1fr
              20px;

            gap: 10px;
          }

          .about-v2-capability-row h3 {
            font-size: 24px;
          }

          .about-v2-capability-row p {
            font-size: 11px;
          }

          .about-v2-tech-grid {
            grid-template-columns: 1fr;
          }

          .about-v2-tech-card {
            min-height: 320px;
          }

          .about-v2-mission {
            min-height: 85svh;

            padding:
              130px 22px
              100px;
          }

          .mission-label {
            left: 22px;
            top: 80px;
          }

          .mission-content h2 {
            font-size:
              clamp(50px,14vw,85px);
          }

          .mission-content p {
            margin-top: 40px;
            font-size: 12px;
          }

          .mission-side-data {
            display: none;
          }

          .philosophy-heading {
            margin-top: 60px;
          }

          .philosophy-row {
            min-height: auto;

            grid-template-columns:
              35px
              1fr
              20px;

            gap: 10px;

            padding:
              28px 0;
          }

          .philosophy-row p {
            grid-column: 2 / 4;

            font-size: 11px;
          }

          .philosophy-row h3 {
            font-size: 25px;
          }

          .about-v2-audience {
            grid-template-columns: 1fr;

            gap: 60px;
          }

          .audience-left h2 {
            margin-top: 50px;

            font-size:
              clamp(50px,14vw,90px);
          }

          .audience-right {
            padding-top: 0;
          }

          .audience-right > p {
            font-size: 13px;
          }

          .about-v2-final {
            min-height: 80svh;

            padding:
              100px 22px;
          }

          .about-v2-final h2 {
            font-size:
              clamp(58px,16vw,100px);

            margin:
              35px 0;
          }

          .about-v2-final p {
            font-size: 12px;
          }

          .about-v2-footer {
            min-height: 150px;

            grid-template-columns: 1fr;

            gap: 15px;

            padding:
              30px 22px;

            text-align: left;
          }

          .about-v2-footer > span:nth-child(2),
          .about-v2-footer > span:last-child {
            text-align: left;
          }

        }


        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {

          .about-v2 * {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }

        }

      `}</style>

    </main>
  );
}