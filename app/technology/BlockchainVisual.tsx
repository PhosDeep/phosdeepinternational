import styles from "./blockchain.module.css";

const blocks = Array.from(
  { length: 7 },
  (_, index) => index
);

export default function BlockchainVisual() {
  return (
    <div
      className={styles.blockchainVisual}
      aria-hidden="true"
    >
      <div className={styles.blockchainGlow} />

      <div className={styles.chainOrbit} />

      <div className={styles.chainOrbitTwo} />

      <div className={styles.chainNetwork}>

        {blocks.map((block) => (
          <div
            key={block}
            className={styles.block}
            style={{
              "--index": block,
            } as React.CSSProperties}
          >
            <div className={styles.blockInner}>
              <span>
                {String(block + 1).padStart(
                  2,
                  "0"
                )}
              </span>

              <strong>
                ⬡
              </strong>

              <small>
                VERIFIED
              </small>
            </div>
          </div>
        ))}

      </div>

      <svg
        className={styles.chainLines}
        viewBox="0 0 700 600"
      >
        <defs>
          <linearGradient
            id="chainGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor="#ff8b37"
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

        <path d="M100 320 C180 120 300 100 350 200 C400 300 520 280 600 100" />

        <path d="M100 500 C200 380 300 420 350 300 C400 180 520 250 600 400" />

        <path d="M160 180 C270 300 400 300 540 500" />
      </svg>

      <div className={styles.transactionStream}>
        <span>0x8A3F</span>
        <span>→</span>
        <span>0xC921</span>
        <span>VERIFIED</span>
      </div>

      <div className={styles.blockchainStatus}>
        <span className={styles.statusDot} />
        <span>NETWORK</span>
        <strong>CONSENSUS</strong>
      </div>

      <div className={styles.blockchainReadout}>
        <span>CHAIN // 05</span>
        <span>BLOCK HEIGHT 842,913</span>
        <span>TRUST: DISTRIBUTED</span>
      </div>
    </div>
  );
}