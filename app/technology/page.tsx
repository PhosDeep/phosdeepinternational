"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

import CustomCursor from "@/components/CustomCursor";
import HudFrame from "@/components/HudFrame";
import SiteNav from "@/components/SiteNav";

const PhosdeepScene = dynamic(
  () => import("@/components/PhosdeepScene"),
  {
    ssr: false,
  }
);

type Technology = {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  hex: string;
  symbol: string;
  href: string;
};

const technologies: Technology[] = [
  {
    number: "01",
    title: "CYBERSECURITY",
    subtitle: "DEFEND",
    description:
      "Offensive security, threat intelligence, security engineering and adversarial testing.",
    color: "red",
    hex: "#ff405a",
    symbol: "◈",
    href: "/technology/cybersecurity",
  },
  {
    number: "02",
    title: "GENERATIVE AI",
    subtitle: "CREATE",
    description:
      "LLMs, intelligent agents, AI systems and next-generation applications.",
    color: "purple",
    hex: "#a83cff",
    symbol: "✦",
    href: "/technology/generative-ai",
  },
  {
    number: "03",
    title: "QUANTUM",
    subtitle: "COMPUTE",
    description:
      "Exploring computation beyond classical architectures through quantum systems.",
    color: "blue",
    hex: "#557cff",
    symbol: "◎",
    href: "/technology/quantum",
  },
  {
    number: "04",
    title: "CLOUD",
    subtitle: "SCALE",
    description:
      "Modern infrastructure engineered for scale, resilience and intelligence.",
    color: "cyan",
    hex: "#2bd9ff",
    symbol: "⌁",
    href: "/technology/cloud",
  },
  {
    number: "05",
    title: "BLOCKCHAIN",
    subtitle: "DECENTRALIZE",
    description:
      "Distributed systems, smart contracts, Web3 infrastructure and digital trust.",
    color: "orange",
    hex: "#ff8b37",
    symbol: "⬡",
    href: "/technology/blockchain",
  },
  {
    number: "06",
    title: "RESEARCH",
    subtitle: "DISCOVER",
    description:
      "Turning frontier science and technology into practical knowledge.",
    color: "green",
    hex: "#37e69c",
    symbol: "◉",
    href: "/technology/research",
  },
];

function TechnologyCard({
  technology,
}: {
  technology: Technology;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={technology.href}
      className={`technology-directory-card ${technology.color}`}
      style={
        {
          "--tech-color": technology.hex,
        } as React.CSSProperties
      }
      data-cursor="tech"
      data-cursor-color={technology.hex}
      data-cursor-symbol={technology.symbol}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="directory-card-top">
        <span>{technology.number}</span>
        <span>{hovered ? "↗" : "↗"}</span>
      </div>

      <div
        className="directory-symbol"
        aria-hidden="true"
      >
        {technology.symbol}
      </div>

      <div className="directory-card-content">
        <span>{technology.subtitle}</span>

        <h2>{technology.title}</h2>

        <p>{technology.description}</p>
      </div>

      <div className="directory-card-line" />
    </Link>
  );
}

export default function TechnologyPage() {
  useEffect(() => {
    const elements =
      document.querySelectorAll<HTMLElement>("[data-reveal]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    elements.forEach((element) =>
      observer.observe(element)
    );

    return () => observer.disconnect();
  }, []);

  return (
    <main className="site technology-page" id="main-content">

      {/* =====================================================
          3D BACKGROUND
      ===================================================== */}

      <div
        className="scene-fixed"
        aria-hidden="true"
      >
        <PhosdeepScene />
      </div>

      <CustomCursor />

      <HudFrame />

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <SiteNav />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="inner-hero">

        <div className="inner-hero-meta">
          <span>
            PHOSDEEP / 01
          </span>

          <span>
            EMERGING TECHNOLOGY
          </span>
        </div>

        <div
          className="inner-hero-grid"
          aria-hidden="true"
        />

        <div
          className="inner-hero-glow"
          aria-hidden="true"
        />

        <div
          className="inner-hero-content"
          data-reveal
        >
          <div className="eyebrow">
            <span className="status-dot" />
            THE FRONTIER
          </div>

          <h1>
            TECHNOLOGY
            <br />
            <span>WITHOUT LIMITS.</span>
          </h1>

          <p>
            We work across the technologies shaping the
            next decade — building systems, solving
            problems and developing the people capable
            of working with them.
          </p>
        </div>

        <div
          className="inner-hero-index"
          aria-hidden="true"
        >
          <strong>06</strong>
          <span>DOMAINS</span>
        </div>

        <div className="inner-hero-scroll">
          <span>SCROLL TO EXPLORE</span>
          <div />
        </div>

      </section>

      {/* =====================================================
          DIRECTORY
      ===================================================== */}

      <section className="technology-directory">

        <div
          className="directory-intro"
          data-reveal
        >
          <div className="directory-header">
            <span>
              01 / TECHNOLOGY SYSTEMS
            </span>

            <span>
              SELECT A DOMAIN
            </span>
          </div>

          <div className="directory-heading">
            <span>THE PHOSDEEP ECOSYSTEM</span>

            <h2>
              SELECT
              <br />
              <span>A DOMAIN.</span>
            </h2>

            <p>
              Explore the technologies, capabilities and
              systems we work with across the Phosdeep
              ecosystem.
            </p>
          </div>
        </div>

        <div className="technology-directory-grid">
          {technologies.map((technology) => (
            <TechnologyCard
              key={technology.number}
              technology={technology}
            />
          ))}
        </div>

      </section>

      {/* =====================================================
          PHILOSOPHY
      ===================================================== */}

      <section
        className="technology-philosophy"
        data-reveal
      >
        <div className="philosophy-orbit" />

        <span className="philosophy-label">
          THE PHOSDEEP APPROACH
        </span>

        <h2>
          TECHNOLOGY
          <br />
          ISN&apos;T THE
          <br />
          <span>DESTINATION.</span>
        </h2>

        <p>
          We explore emerging technology not simply to
          understand what is possible, but to build what
          becomes possible next.
        </p>
      </section>

      {/* =====================================================
          CAPABILITY STRIP
      ===================================================== */}

      <section className="technology-capabilities">

        <div className="technology-capabilities-header">
          <span>02 / CAPABILITIES</span>

          <span>
            PHOSDEEP / SYSTEMS
          </span>
        </div>

        <div className="technology-capabilities-grid">

          <div
            className="technology-capability"
            data-reveal
          >
            <span>01</span>

            <h3>
              BUILD
            </h3>

            <p>
              From intelligent systems to secure
              infrastructure, we turn emerging
              technology into practical solutions.
            </p>
          </div>

          <div
            className="technology-capability"
            data-reveal
          >
            <span>02</span>

            <h3>
              SECURE
            </h3>

            <p>
              Security is engineered into the systems
              we design, test and deploy.
            </p>
          </div>

          <div
            className="technology-capability"
            data-reveal
          >
            <span>03</span>

            <h3>
              RESEARCH
            </h3>

            <p>
              We investigate emerging technologies and
              translate frontier research into usable
              knowledge.
            </p>
          </div>

          <div
            className="technology-capability"
            data-reveal
          >
            <span>04</span>

            <h3>
              TRAIN
            </h3>

            <p>
              We develop the people capable of working
              with the technologies shaping tomorrow.
            </p>
          </div>

        </div>

      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="technology-cta">

        <div
          className="technology-cta-grid"
          aria-hidden="true"
        />

        <span
          className="technology-cta-label"
          data-reveal
        >
          HAVE A TECHNOLOGY CHALLENGE?
        </span>

        <h2 data-reveal>
          LET&apos;S BUILD
          <br />
          <span>WHAT&apos;S NEXT.</span>
        </h2>

        <a
          href="mailto:phosdeepinternational@gmail.com"
          className="technology-cta-button"
          data-cursor="magnetic"
          data-cursor-label="EMAIL"
          data-cursor-color="#2bd9ff"
        >
          START A CONVERSATION
          <span>↗</span>
        </a>

      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer>

        <Link
          href="/"
          className="logo"
        >
          PHOS<span>DEEP</span>
        </Link>

        <div>
          © 2026 PHOSDEEP INTERNATIONAL
        </div>

        <div>
          DELHI · INDIA
        </div>

      </footer>

    </main>
  );
}