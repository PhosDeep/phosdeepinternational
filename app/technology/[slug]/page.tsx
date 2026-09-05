import Link from "next/link";
import { notFound } from "next/navigation";

import PageShell from "@/components/PageShell";

import CyberSecurityVisual from "../CyberSecurityVisual";
import GenerativeAIVisual from "../GenerativeAIVisual";
import QuantumVisual from "../QuantumVisual";
import CloudVisual from "../CloudVisual";
import BlockchainVisual from "../BlockchainVisual";
import ResearchVisual from "../ResearchVisual";

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
      return <ResearchVisual />;

    default:
      return null;
  }
}


/* =========================================================
   STATIC PARAMS
========================================================= */

export function generateStaticParams() {
  return Object.keys(technologyData).map((slug) => ({
    slug,
  }));
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


  return (
    <PageShell
      className={`technology-detail-page technology-${technologySlug}`}
    >

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="detail-hero">

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


          <h1>
            {technology.title}
          </h1>


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


      {/* =====================================================
          CAPABILITIES
      ===================================================== */}

      <section className="capabilities-section">

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

      <section className="detail-cta">

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

    </PageShell>
  );
}