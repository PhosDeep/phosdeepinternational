"use client";

import styles from "./blockchain-playground.module.css";

interface CompletionSummaryProps {
  progress: {
    hashing: boolean;
    transactions: boolean;
    blocks: boolean;
    mining: boolean;
    blockchain: boolean;
    tamper: boolean;
  };
  onReplay: () => void;
}

const CHECKLIST = [
  { key: "hashing", label: "Generated hashes" },
  { key: "transactions", label: "Created transactions" },
  { key: "blocks", label: "Built blocks" },
  { key: "mining", label: "Simulated mining" },
  { key: "blockchain", label: "Linked blocks into a chain" },
  { key: "tamper", label: "Detected & restored tampering" },
] as const;

export default function CompletionSummary({
  progress,
  onReplay,
}: CompletionSummaryProps) {
  const allDone = Object.values(progress).every(Boolean);

  return (
    <div className={styles.completion}>
      {/* Wow headline */}
      <p className={styles.completionWow} aria-label="You built it. You broke it. You understood it.">
        <span className={styles.completionWowLine}>You Built It.</span>
        <span className={styles.completionWowLine}>You Broke It.</span>
        <span className={styles.completionWowLine}>You Understood It.</span>
      </p>

      {/* Checklist */}
      <div className={styles.completionChecklist}>
        {CHECKLIST.map(({ key, label }, i) => (
          <div
            key={key}
            className={styles.completionItem}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <span className={styles.completionItemIcon}>✓</span>
            <span className={styles.completionItemText}>{label}</span>
          </div>
        ))}
      </div>

      {/* Tagline */}
      <p className={styles.completionTagline}>
        Blockchain isn&apos;t magic.{" "}
        <span className={styles.completionTaglineAccent}>
          It&apos;s a chain of verifiable data.
        </span>{" "}
        Change one link, and the whole chain knows.
      </p>

      {/* Replay */}
      <button
        className={styles.btnPrimary}
        onClick={onReplay}
        id="replay-playground-btn"
      >
        ↺ Replay Playground
      </button>
    </div>
  );
}
