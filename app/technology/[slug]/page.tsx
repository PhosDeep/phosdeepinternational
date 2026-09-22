import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import PageShell from "@/components/PageShell";
import SiteFooter from "@/components/SiteFooter";
import DomainInteractiveConsole from "@/components/DomainInteractiveConsole";

import CyberSecurityVisual from "../CyberSecurityVisual";
import GenerativeAIVisual from "../GenerativeAIVisual";
import QuantumVisual from "../QuantumVisual";
import VectorWordmark from "../VectorWordmark";
import CloudVisual from "../CloudVisual";
import BlockchainVisual from "../BlockchainVisual";
import EnergyStream from "../EnergyStream";
import FormulaStream from "../FormulaStream";
import FlowRibbons from "../FlowRibbons";
import BreakTheChain from "../BreakTheChain";
import BlockchainPlayground from "../blockchain/BlockchainPlayground";
import { getRobotFramesData } from "@/components/robot-sequence/getRobotFrames";
import RobotScrollSequence from "@/components/robot-sequence/RobotScrollSequence";
import ParallaxUnfurlingGallery from "@/components/ui/3d-parallax-unfurling-gallery";

const technologyData = {
  cybersecurity: {
    number: "01",
    title: "CYBERSECURITY",
    subtitle: "DEFEND",
    color: "#ff405a",
    intro:
      "Security is no longer a perimeter. We help organizations understand, test and strengthen the systems they depend on.",
    capabilities: [
      "Vulnerability Assessment & Penetration Testing",
      "Security Architecture",
      "Threat Intelligence",
      "Application & API Security",
      "Cloud Security",
      "Security Awareness & Training",
    ],
  },

  "generative-ai": {
    number: "02",
    title: "GENERATIVE AI",
    subtitle: "CREATE",
    color: "#a83cff",
    intro:
      "We build intelligent systems that move beyond experimentation into practical applications, workflows and products.",
    capabilities: [
      "Generative AI Applications",
      "LLM Systems",
      "AI Agents",
      "RAG Architectures",
      "AI Automation",
      "Model Integration",
    ],
  },

  quantum: {
    number: "03",
    title: "QUANTUM",
    subtitle: "COMPUTE",
    color: "#557cff",
    intro:
      "Quantum computing represents a fundamentally different approach to computation. We explore its technologies, applications and future possibilities.",
    capabilities: [
      "Quantum Computing Fundamentals",
      "Quantum Algorithms",
      "Quantum Machine Learning",
      "Quantum Cryptography",
      "Research & Prototyping",
      "Quantum Technology Education",
    ],
  },

  cloud: {
    number: "04",
    title: "CLOUD",
    subtitle: "SCALE",
    color: "#2bd9ff",
    intro:
      "Modern technology needs infrastructure that is scalable, resilient and intelligent. We help organizations build for that reality.",
    capabilities: [
      "Cloud Architecture",
      "Cloud Security",
      "DevOps",
      "Infrastructure Automation",
      "Containerization",
      "Cloud Migration",
    ],
  },

  blockchain: {
    number: "05",
    title: "BLOCKCHAIN",
    subtitle: "DECENTRALIZE",
    color: "#ff8b37",
    intro:
      "Distributed systems are changing how trust, ownership and digital transactions are designed.",
    capabilities: [
      "Blockchain Architecture",
      "Smart Contracts",
      "Web3 Applications",
      "DeFi Systems",
      "Digital Assets",
      "Blockchain Security",
    ],
  },

  research: {
    number: "06",
    title: "RESEARCH",
    subtitle: "DISCOVER",
    color: "#37e69c",
    intro:
      "We explore emerging technologies and translate frontier ideas into practical knowledge, experiments and real-world applications.",
    capabilities: [
      "Emerging Technology Research",
      "Applied AI Research",
      "Technology Prototyping",
      "Academic-Industry Collaboration",
      "Experimental Systems",
      "Technical Research Projects",
    ],
  },
} as const;

type TechnologySlug = keyof typeof technologyData;

const researchSignalBars = [42, 68, 51, 82, 63, 91, 74, 56, 88, 70, 96, 79];

function ResearchSignal() {
  return (
    <div className="research-signal" aria-hidden="true">
      <div className="research-signal-header"><span>RESEARCH SIGNAL</span><span>LIVE</span></div>
      <div className="research-signal-graph">
        {researchSignalBars.map((height, index) => (
          <span key={index} style={{ height: `${height}%`, animationDelay: `${index * 0.08}s` }} />
        ))}
      </div>
      <div className="research-signal-axis"><span>01</span><span>05</span><span>10</span><span>12</span></div>
    </div>
  );
}

export function generateStaticParams() {
  return Object.keys(technologyData).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const technology = technologyData[slug as TechnologySlug];

  if (!technology) {
    return { title: "Technology | Phosdeep International" };
  }

  return {
    title: `${technology.title} | Phosdeep International`,
    description: technology.intro,
  };
}


/* =========================================================
   VISUAL SELECTOR
========================================================= */

function TechnologyVisual({
  slug,
}: {
  slug: TechnologySlug;
}) {
  switch (slug) {
    case "cybersecurity":
      return <CyberSecurityVisual />;

    case "generative-ai":
      return <GenerativeAIVisual />;

    case "quantum":
      return <QuantumVisual />;

    case "cloud":
      return <CloudVisual />;

    case "blockchain":
      return <BlockchainVisual />;

    case "research":
      return (
        <EnergyStream
          className="research-energy-stream"
          colors={["#0BAF96", "#00D9A1", "#37E69C", "#42E6FF", "#D0FFF5"]}
          background="transparent"
          particles={150000}
          shape={{ height: 7, waist: 1.6, flare: 4, twist: 0.7 }}
          size={5}
          glow={1}
          repel={4}
          flow={1.2}
          spin={0.45}
          core={{ show: true, diameter: 1.8, color: "#37E69C", spin: 1 }}
        />
      );

    default:
      return null;
  }
}


/* =========================================================
   TECHNOLOGY DETAIL PAGE
========================================================= */

export default async function TechnologyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!(slug in technologyData)) {
    notFound();
  }

  const technology =
    technologyData[slug as TechnologySlug];

  const technologySlug =
    slug as TechnologySlug;

  const robotFramesData =
    technologySlug === "generative-ai" ? getRobotFramesData() : null;

  return (
    <PageShell
      className={`technology-detail-page technology-${technologySlug}`}
    >

      {/* =====================================================
          CINEMATIC HERO: ROBOT SCROLL SEQUENCE (GENERATIVE AI)
          OR STANDARD HERO (OTHER DOMAINS)
      ===================================================== */}
      {technologySlug === "generative-ai" &&
        robotFramesData &&
        robotFramesData.frameCount > 0 ? (
        <>
          <RobotScrollSequence
            frameUrls={robotFramesData.frameUrls}
            frameCount={robotFramesData.frameCount}
            naturalWidth={robotFramesData.naturalWidth}
            naturalHeight={robotFramesData.naturalHeight}
            scrollHeightVh={1000}
          />
          <ParallaxUnfurlingGallery />
        </>
      ) : (
        <section className="detail-hero" data-reveal>

          {/* -----------------------------------------------------
              BACKGROUND VISUAL
          ----------------------------------------------------- */}

          <div
            className="technology-detail-visual"
            aria-hidden="true"
          >
            <TechnologyVisual
              slug={technologySlug}
            />
          </div>

        {technologySlug === "research" && <ResearchSignal />}

        {technologySlug === "research" && <FormulaStream className="research-formula-stream" />}


          {/* -----------------------------------------------------
              HERO OVERLAY
          ----------------------------------------------------- */}

          <div
            className="technology-detail-overlay"
            aria-hidden="true"
          />


          {/* -----------------------------------------------------
              META
          ----------------------------------------------------- */}

          <div className="detail-meta">

            <span>
              PHOSDEEP / TECHNOLOGY /{" "}
              {technology.number}
            </span>

            <span>
              {technology.subtitle}
            </span>

          </div>


          {/* -----------------------------------------------------
              HERO CONTENT
          ----------------------------------------------------- */}

          <div className="detail-title">

            <span
              className="detail-eyebrow"
              style={{
                color: technology.color,
              }}
            >
              {technology.subtitle}
            </span>


            {technologySlug === "quantum" ? (
              <div className="detail-wordmark" aria-label={technology.title}>
                <VectorWordmark
                  background="transparent"
                  textColor="#ffffff"
                  shade="#557cff"
                  accent="#2bd9ff"
                  font={{
                    fontFamily: "Space Grotesk",
                    fontWeight: 600,
                    fontSize: "250px",
                    lineHeight: "1em",
                    letterSpacing: "-0.04em",
                  }}
                />
              </div>
            ) : (
              <h1>
                {technology.title}
              </h1>
            )}


            <p>
              {technology.intro}
            </p>

          </div>


          {/* -----------------------------------------------------
              DOMAIN INDICATOR
          ----------------------------------------------------- */}

          <div
            className="detail-domain-indicator"
            style={{
              color: technology.color,
            }}
            aria-hidden="true"
          >

            <span className="detail-domain-number">
              {technology.number}
            </span>

            <span className="detail-domain-label">
              DOMAIN
            </span>

          </div>

        </section>
      )}


      {/* =====================================================
          INTERACTIVE DOMAIN SECTION

          Blockchain: Break the Chain game + Blockchain Playground.
          All other technology pages: DomainInteractiveConsole.
      ===================================================== */}
      {technologySlug === "blockchain" ? (
        <>
          <BreakTheChain />
          <BlockchainPlayground />
        </>
      ) : technologySlug === "generative-ai" ? null : (
        <section className="detail-console-section" data-reveal>
          <div className="detail-console-container">
            <DomainInteractiveConsole slug={technologySlug} color={technology.color} />
          </div>
        </section>
      )}


      {/* =====================================================
          CAPABILITIES
      ===================================================== */}

      <section className="capabilities-section" data-reveal>

        <FlowRibbons
          className="capabilities-flow-ribbons"
          colorA={technology.color}
          colorB="#2BD9FF"
          count={220}
          speed={0.7}
          strength={13}
        />

        <div className="capabilities-heading">

          <span>
            CAPABILITIES
          </span>

          <h2>
            WHAT
            <br />
            WE DO.
          </h2>

        </div>


        <div className="capabilities-list">

          {technology.capabilities.map(
            (capability, index) => (

              <div
                className="capability-item"
                key={capability}
              >

                <span>
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </span>


                <h3>
                  {capability}
                </h3>


                <span
                  className="capability-arrow"
                  style={{
                    color:
                      technology.color,
                  }}
                >
                  ↗
                </span>

              </div>

            )
          )}

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="detail-cta" data-reveal>

        <FlowRibbons
          className="cta-flow-ribbons"
          colorA={technology.color}
          colorB="#2BD9FF"
          count={180}
          speed={0.5}
          strength={9}
        />

        <span>
          PHOSDEEP INTERNATIONAL
        </span>


        <h2>
          BUILD WITH
          <br />

          <span
            style={{
              color:
                technology.color,
            }}
          >
            {technology.title}.
          </span>

        </h2>


        <Link
          href="/contact"
          className="contact-button"
          data-cursor="magnetic"
          data-cursor-label="CONTACT"
          data-cursor-color={
            technology.color
          }
        >

          DISCUSS A PROJECT

          <span>
            ↗
          </span>

        </Link>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <SiteFooter />

    </PageShell>
  );
}