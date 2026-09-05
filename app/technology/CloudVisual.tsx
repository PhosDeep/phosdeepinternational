"use client";

import { useEffect, useState } from "react";
import styles from "./cloud.module.css";

const nodes = [
  { x: 18, y: 35, label: "EDGE" },
  { x: 38, y: 18, label: "API" },
  { x: 62, y: 18, label: "CORE" },
  { x: 82, y: 35, label: "EDGE" },
  { x: 50, y: 78, label: "DATA" },
];

export default function CloudVisual() {
  const [activeNode, setActiveNode] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveNode((current) => (current + 1) % nodes.length);
    }, 1200);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div
      className={styles.cloudVisual}
      aria-hidden="true"
    >
      {/* =====================================================
          ATMOSPHERIC BACKGROUND
      ===================================================== */}

      <div className={styles.cloudGlow} />

      <div className={styles.cloudGlowSecondary} />

      <div className={styles.cloudGrid} />

      <div className={styles.cloudParticles}>
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>


      {/* =====================================================
          LARGE CLOUD ORBITS
      ===================================================== */}

      <div
        className={`${styles.cloudOrbit} ${styles.cloudOrbitOne}`}
      />

      <div
        className={`${styles.cloudOrbit} ${styles.cloudOrbitTwo}`}
      />

      <div
        className={`${styles.cloudOrbit} ${styles.cloudOrbitThree}`}
      />


      {/* =====================================================
          CONNECTION NETWORK
      ===================================================== */}

      <svg
        className={styles.cloudConnections}
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>

          <linearGradient
            id="cloudLineGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor="#2bd9ff"
              stopOpacity="0.15"
            />

            <stop
              offset="50%"
              stopColor="#557cff"
              stopOpacity="0.85"
            />

            <stop
              offset="100%"
              stopColor="#a83cff"
              stopOpacity="0.3"
            />
          </linearGradient>

          <filter id="cloudGlowFilter">
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


        {/* Main infrastructure links */}

        <g className={styles.networkLines}>

          <path
            d="M145 220 C220 180 270 160 400 160"
          />

          <path
            d="M400 160 C530 160 580 180 655 220"
          />

          <path
            d="M145 220 C205 330 270 390 400 455"
          />

          <path
            d="M655 220 C595 330 530 390 400 455"
          />

          <path
            d="M400 160 C400 250 400 350 400 455"
          />

          <path
            d="M145 220 C250 270 550 270 655 220"
          />

          <path
            d="M210 335 C300 300 500 300 590 335"
          />

        </g>


        {/* Secondary network links */}

        <g className={styles.secondaryLines}>

          <path d="M145 220 L210 335" />

          <path d="M655 220 L590 335" />

          <path d="M210 335 L400 455" />

          <path d="M590 335 L400 455" />

        </g>


        {/* Moving data packets */}

        <circle
          className={styles.dataPacket}
          cx="145"
          cy="220"
          r="4"
        />

        <circle
          className={`${styles.dataPacket} ${styles.packetDelay}`}
          cx="655"
          cy="220"
          r="4"
        />

        <circle
          className={`${styles.dataPacket} ${styles.packetDelayTwo}`}
          cx="400"
          cy="160"
          r="4"
        />

      </svg>


      {/* =====================================================
          CENTRAL CLOUD
      ===================================================== */}

      <div className={styles.cloudCore}>

        <div className={styles.coreOuterRing} />

        <div className={styles.coreMiddleRing} />

        <div className={styles.coreGlow} />


        <div className={styles.cloudIcon}>

          <span className={styles.cloudBubbleOne} />

          <span className={styles.cloudBubbleTwo} />

          <span className={styles.cloudBubbleThree} />

          <span className={styles.cloudBase} />

        </div>


        <div className={styles.corePulse} />

      </div>


      {/* =====================================================
          INFRASTRUCTURE NODES
      ===================================================== */}

      <div className={styles.cloudNodes}>

        {nodes.map((node, index) => (

          <div
            key={`${node.label}-${index}`}
            className={`${styles.cloudNode} ${
              activeNode === index
                ? styles.activeNode
                : ""
            }`}
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
            }}
          >

            <div className={styles.nodeVisual}>

              <span className={styles.nodeOuter} />

              <span className={styles.nodeInner} />

              <span className={styles.nodePoint} />

            </div>


            <div className={styles.nodeInfo}>

              <span>
                N{String(index + 1).padStart(2, "0")}
              </span>

              <strong>
                {node.label}
              </strong>

            </div>

          </div>

        ))}

      </div>


      {/* =====================================================
          FLOATING DATA STREAMS
      ===================================================== */}

      <div className={styles.dataStreams}>

        <span className={styles.streamOne} />

        <span className={styles.streamTwo} />

        <span className={styles.streamThree} />

        <span className={styles.streamFour} />

      </div>


      {/* =====================================================
          SYSTEM STATUS
      ===================================================== */}

      <div className={styles.cloudStatus}>

        <span className={styles.statusIndicator} />

        <span>
          CLOUD NETWORK
        </span>

        <strong>
          OPERATIONAL
        </strong>

      </div>


      {/* =====================================================
          SYSTEM READOUT
      ===================================================== */}

      <div className={styles.cloudReadout}>

        <span>
          CLOUD // 04
        </span>

        <span>
          NODES 05
        </span>

        <span>
          NETWORK STABLE
        </span>

      </div>


      {/* =====================================================
          SCALE INDICATOR
      ===================================================== */}

      <div className={styles.scaleIndicator}>

        <span>
          SCALABILITY
        </span>

        <div className={styles.scaleBars}>

          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />

        </div>

        <strong>
          ∞
        </strong>

      </div>

    </div>
  );
}