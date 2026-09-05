import styles from "./research.module.css";

const bars = [
  42,
  68,
  51,
  82,
  63,
  91,
  74,
  56,
  88,
  70,
  96,
  79,
];

export default function ResearchVisual() {
  return (
    <div
      className={styles.researchVisual}
      aria-hidden="true"
    >
      <div className={styles.researchGlow} />

      <div className={styles.researchOrb}>
        <div className={styles.orbCore} />
        <div className={styles.orbRingOne} />
        <div className={styles.orbRingTwo} />
      </div>

      <div className={styles.dataPanel}>

        <div className={styles.panelHeader}>
          <span>
            RESEARCH SIGNAL
          </span>

          <span>
            LIVE
          </span>
        </div>

        <div className={styles.graph}>
          {bars.map((height, index) => (
            <span
              key={index}
              style={{
                height: `${height}%`,
                animationDelay:
                  `${index * 0.08}s`,
              }}
            />
          ))}
        </div>

        <div className={styles.axis}>
          <span>01</span>
          <span>05</span>
          <span>10</span>
          <span>12</span>
        </div>

      </div>

      <div className={styles.researchEquations}>
        <span>
          ∑ P(x|θ)
        </span>

        <span>
          ∂L / ∂θ
        </span>

        <span>
          E = mc²
        </span>

        <span>
          ΔT → 0
        </span>
      </div>

      <div className={styles.researchParticles}>
        {Array.from(
          { length: 20 },
          (_, index) => (
            <i
              key={index}
              style={{
                "--i": index,
              } as React.CSSProperties}
            />
          )
        )}
      </div>

      <div className={styles.researchStatus}>
        <span className={styles.statusDot} />

        <span>
          FRONTIER RESEARCH
        </span>

        <strong>
          ACTIVE
        </strong>
      </div>

      <div className={styles.researchReadout}>
        <span>RESEARCH // 06</span>
        <span>DATASET: FRONTIER</span>
        <span>MODE: EXPERIMENTAL</span>
      </div>
    </div>
  );
}