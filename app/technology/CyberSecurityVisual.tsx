import styles from "./cybersecurity.module.css";

const nodes = [
  ["50%", "8%"],
  ["77%", "25%"],
  ["88%", "52%"],
  ["73%", "78%"],
  ["50%", "91%"],
  ["27%", "78%"],
  ["12%", "52%"],
  ["23%", "25%"],
];

export default function CyberSecurityVisual() {
  return (
    <div
      className={styles.cyberVisual}
      aria-hidden="true"
    >
      <div className={styles.cyberGlow} />

      <div className={styles.cyberGrid} />

      <div className={styles.outerRing} />
      <div className={styles.middleRing} />
      <div className={styles.innerRing} />

      <div className={styles.scanBeam} />

      <svg
        className={styles.network}
        viewBox="0 0 600 600"
      >
        <defs>
          <linearGradient
            id="cyberLine"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor="#ff405a"
              stopOpacity="0.05"
            />

            <stop
              offset="50%"
              stopColor="#ff405a"
              stopOpacity="0.8"
            />

            <stop
              offset="100%"
              stopColor="#a83cff"
              stopOpacity="0.05"
            />
          </linearGradient>
        </defs>

        <g
          className={styles.networkLines}
        >
          <line x1="300" y1="55" x2="462" y2="150" />
          <line x1="462" y1="150" x2="525" y2="312" />
          <line x1="525" y1="312" x2="438" y2="468" />
          <line x1="438" y1="468" x2="300" y2="545" />
          <line x1="300" y1="545" x2="162" y2="468" />
          <line x1="162" y1="468" x2="75" y2="312" />
          <line x1="75" y1="312" x2="138" y2="150" />
          <line x1="138" y1="150" x2="300" y2="55" />

          <line x1="300" y1="55" x2="300" y2="545" />
          <line x1="75" y1="312" x2="525" y2="312" />

          <line x1="138" y1="150" x2="438" y2="468" />
          <line x1="462" y1="150" x2="162" y2="468" />
        </g>

        <g className={styles.shield}>
          <path d="M300 125 L410 165 L398 315 C390 405 340 455 300 480 C260 455 210 405 202 315 L190 165 Z" />

          <path d="M300 158 L380 188 L371 308 C365 372 332 412 300 435 C268 412 235 372 229 308 L220 188 Z" />
        </g>

        <g className={styles.lock}>
          <rect
            x="260"
            y="275"
            width="80"
            height="68"
            rx="8"
          />

          <path d="M275 275 V250 C275 215 325 215 325 250 V275" />

          <circle
            cx="300"
            cy="307"
            r="7"
          />

          <line
            x1="300"
            y1="314"
            x2="300"
            y2="327"
          />
        </g>
      </svg>

      <div className={styles.nodes}>
        {nodes.map(
          ([left, top], index) => (
            <span
              key={index}
              className={styles.node}
              style={{
                left,
                top,
                animationDelay:
                  `${index * 0.35}s`,
              }}
            />
          )
        )}
      </div>

      <span
        className={`${styles.packet} ${styles.packetOne}`}
      />

      <span
        className={`${styles.packet} ${styles.packetTwo}`}
      />

      <span
        className={`${styles.packet} ${styles.packetThree}`}
      />

      <div className={styles.threatIndicator}>
        <span className={styles.threatDot} />
        <span>THREAT MONITOR</span>
        <strong>ACTIVE</strong>
      </div>

      <div className={styles.coordinates}>
        <span>SEC // 01</span>
        <span>NODE: PHX-7</span>
        <span>ENCRYPTED</span>
      </div>
    </div>
  );
}