"use client";

import { useEffect, useState } from "react";
import styles from "./generative-ai.module.css";

const tokens = [
  "TOKEN",
  "PROMPT",
  "VECTOR",
  "CONTEXT",
  "MODEL",
  "OUTPUT",
];

const nodes = [
  { x: 18, y: 24 },
  { x: 30, y: 14 },
  { x: 43, y: 22 },
  { x: 57, y: 14 },
  { x: 70, y: 24 },
  { x: 82, y: 38 },

  { x: 20, y: 48 },
  { x: 35, y: 42 },
  { x: 50, y: 48 },
  { x: 65, y: 42 },
  { x: 80, y: 52 },

  { x: 27, y: 68 },
  { x: 42, y: 76 },
  { x: 58, y: 68 },
  { x: 73, y: 76 },
];

export default function GenerativeAIVisual() {
  const [activeToken, setActiveToken] = useState(0);
  const [activeNode, setActiveNode] = useState(4);

  useEffect(() => {
    const tokenTimer = window.setInterval(() => {
      setActiveToken((value) => (value + 1) % tokens.length);
    }, 1000);

    const nodeTimer = window.setInterval(() => {
      setActiveNode((value) => (value + 1) % nodes.length);
    }, 700);

    return () => {
      window.clearInterval(tokenTimer);
      window.clearInterval(nodeTimer);
    };
  }, []);

  return (
    <div
      className={styles.aiVisual}
      aria-hidden="true"
    >
      {/* =====================================================
          ATMOSPHERE
      ===================================================== */}

      <div className={styles.aiGlow} />

      <div className={styles.aiGlowSecondary} />

      <div className={styles.aiGrid} />


      {/* =====================================================
          PARTICLES
      ===================================================== */}

      <div className={styles.aiParticles}>
        {Array.from({ length: 18 }).map((_, index) => (
          <span
            key={index}
            className={styles.particle}
          />
        ))}
      </div>


      {/* =====================================================
          LARGE NEURAL RINGS
      ===================================================== */}

      <div className={styles.neuralRingOne} />

      <div className={styles.neuralRingTwo} />

      <div className={styles.neuralRingThree} />


      {/* =====================================================
          NEURAL NETWORK
      ===================================================== */}

      <svg
        className={styles.network}
        viewBox="0 0 800 620"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>

          <linearGradient
            id="aiGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor="#a83cff"
              stopOpacity="0.2"
            />

            <stop
              offset="50%"
              stopColor="#557cff"
              stopOpacity="0.85"
            />

            <stop
              offset="100%"
              stopColor="#2bd9ff"
              stopOpacity="0.65"
            />
          </linearGradient>

          <filter id="aiGlow">
            <feGaussianBlur
              stdDeviation="3"
              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

        </defs>


        {/* Neural pathways */}

        <g className={styles.neuralPaths}>

          <path d="M145 150 C240 190 290 225 400 285" />

          <path d="M240 100 C300 170 350 220 400 285" />

          <path d="M350 145 C370 205 390 245 400 285" />

          <path d="M455 100 C440 180 420 235 400 285" />

          <path d="M560 150 C500 190 455 230 400 285" />

          <path d="M650 220 C560 245 480 270 400 285" />

          <path d="M160 310 C260 300 325 290 400 285" />

          <path d="M640 310 C540 300 475 290 400 285" />

          <path d="M220 430 C300 370 355 330 400 285" />

          <path d="M580 430 C500 370 445 330 400 285" />

          <path d="M310 500 C345 410 375 340 400 285" />

          <path d="M490 500 C455 410 425 340 400 285" />

        </g>


        {/* Secondary pathways */}

        <g className={styles.secondaryPaths}>

          <path d="M145 150 L240 100" />

          <path d="M240 100 L350 145" />

          <path d="M350 145 L455 100" />

          <path d="M455 100 L560 150" />

          <path d="M560 150 L650 220" />

          <path d="M160 310 L220 430" />

          <path d="M220 430 L310 500" />

          <path d="M640 310 L580 430" />

          <path d="M580 430 L490 500" />

        </g>


        {/* Data pulses */}

        <circle
          className={styles.dataPulse}
          cx="145"
          cy="150"
          r="4"
        />

        <circle
          className={`${styles.dataPulse} ${styles.dataPulseTwo}`}
          cx="560"
          cy="150"
          r="4"
        />

        <circle
          className={`${styles.dataPulse} ${styles.dataPulseThree}`}
          cx="220"
          cy="430"
          r="4"
        />

      </svg>


      {/* =====================================================
          NEURAL NODES
      ===================================================== */}

      <div className={styles.nodes}>

        {nodes.map((node, index) => (

          <div
            key={index}
            className={`${styles.node} ${
              activeNode === index
                ? styles.nodeActive
                : ""
            }`}
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
            }}
          >

            <span className={styles.nodeRing} />

            <span className={styles.nodeCore} />

          </div>

        ))}

      </div>


      {/* =====================================================
          CENTRAL MODEL CORE
      ===================================================== */}

      <div className={styles.modelCore}>

        <div className={styles.coreHalo} />

        <div className={styles.coreRingOuter} />

        <div className={styles.coreRingInner} />


        <div className={styles.coreHexagon}>

          <span />

          <span />

          <span />

          <span />

          <span />

          <span />

        </div>


        <div className={styles.coreCenter}>

          <span />

        </div>

      </div>


      {/* =====================================================
          TOKEN STREAM
      ===================================================== */}

      <div className={styles.tokenStream}>

        <div className={styles.tokenHeader}>
          <span>INPUT STREAM</span>
          <i />
          <strong>LIVE</strong>
        </div>


        <div className={styles.tokenBox}>

          <span className={styles.tokenPrompt}>
            &gt;
          </span>

          <span className={styles.tokenText}>
            {tokens[activeToken]}
          </span>

          <span className={styles.tokenCursor} />

        </div>

      </div>


      {/* =====================================================
          OUTPUT STREAM
      ===================================================== */}

      <div className={styles.outputStream}>

        <span>GENERATED OUTPUT</span>

        <div>

          <i />

          <i />

          <i />

          <i />

          <i />

          <i />

        </div>

      </div>


      {/* =====================================================
          MODEL STATUS
      ===================================================== */}

      <div className={styles.modelStatus}>

        <span className={styles.statusDot} />

        <span>MODEL</span>

        <strong>INFERENCE ACTIVE</strong>

      </div>


      {/* =====================================================
          SYSTEM READOUT
      ===================================================== */}

      <div className={styles.aiReadout}>

        <span>NEURAL CORE // 02</span>

        <span>PARAMETERS 01.2B</span>

        <span>LATENCY 12ms</span>

      </div>


      {/* =====================================================
          MODEL LABEL
      ===================================================== */}

      <div className={styles.modelLabel}>

        <span>GENERATIVE</span>

        <strong>AI</strong>

      </div>


      {/* =====================================================
          SIDE SIGNAL
      ===================================================== */}

      <div className={styles.signalBars}>

        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />

      </div>

    </div>
  );
}