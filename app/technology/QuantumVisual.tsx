"use client";

import { useEffect, useState } from "react";
import styles from "./quantum.module.css";

const qubits = [
  { x: 50, y: 20 },
  { x: 77, y: 35 },
  { x: 77, y: 65 },
  { x: 50, y: 80 },
  { x: 23, y: 65 },
  { x: 23, y: 35 },
];

export default function QuantumVisual() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((current) => (current + 1) % qubits.length);
    }, 900);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className={styles.quantumVisual}
      aria-hidden="true"
    >
      {/* =====================================================
          AMBIENT QUANTUM FIELD
      ===================================================== */}

      <div className={styles.quantumGlow} />

      <div className={styles.quantumField} />


      {/* =====================================================
          ORBITAL SYSTEM
      ===================================================== */}

      <div
        className={`${styles.quantumOrbit} ${styles.quantumOrbitA}`}
      />

      <div
        className={`${styles.quantumOrbit} ${styles.quantumOrbitB}`}
      />

      <div
        className={`${styles.quantumOrbit} ${styles.quantumOrbitC}`}
      />


      {/* =====================================================
          QUANTUM CORE
      ===================================================== */}

      <div className={styles.quantumCore}>

        <div className={styles.coreRing} />

        <div className={styles.coreRingInner} />

        <div className={styles.corePoint} />

      </div>


      {/* =====================================================
          ENTANGLEMENT NETWORK
      ===================================================== */}

      <svg
        className={styles.quantumConnections}
        viewBox="0 0 600 600"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>

          <linearGradient
            id="quantumGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor="#557cff"
            />

            <stop
              offset="50%"
              stopColor="#a83cff"
            />

            <stop
              offset="100%"
              stopColor="#2bd9ff"
            />
          </linearGradient>

        </defs>


        <g className={styles.entanglement}>

          <path
            d="
              M300 120
              C430 170 430 430 300 480
            "
          />

          <path
            d="
              M300 120
              C170 170 170 430 300 480
            "
          />

          <path
            d="
              M140 210
              C240 310 360 310 460 390
            "
          />

          <path
            d="
              M460 210
              C360 310 240 310 140 390
            "
          />

          <path
            d="
              M140 210
              C260 150 340 150 460 210
            "
          />

          <path
            d="
              M140 390
              C260 450 340 450 460 390
            "
          />

        </g>

      </svg>


      {/* =====================================================
          QUBIT FIELD
      ===================================================== */}

      <div className={styles.qubitField}>

        {qubits.map((qubit, index) => (

          <div
            key={index}
            className={`${styles.qubit} ${
              active === index
                ? styles.activeQubit
                : ""
            }`}
            style={{
              left: `${qubit.x}%`,
              top: `${qubit.y}%`,
            }}
          >

            <span />

            <small>
              Q{index}
            </small>

          </div>

        ))}

      </div>


      {/* =====================================================
          PROBABILITY GRAPH
      ===================================================== */}

      <div className={styles.quantumProbability}>

        <span />
        <span />
        <span />
        <span />
        <span />

      </div>


      {/* =====================================================
          QUANTUM STATUS
      ===================================================== */}

      <div className={styles.quantumStatus}>

        <span className={styles.quantumDot} />

        <span>
          QUANTUM STATE
        </span>

        <strong>
          SUPERPOSITION
        </strong>

      </div>


      {/* =====================================================
          SYSTEM READOUT
      ===================================================== */}

      <div className={styles.quantumReadout}>

        <span>
          Q-CORE // 03
        </span>

        <span>
          ENTANGLEMENT: 99.7%
        </span>

        <span>
          COHERENCE: STABLE
        </span>

      </div>

    </div>
  );
}