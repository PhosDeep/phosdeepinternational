"use client";

import { useRef, useState } from "react";
import { type Block, generateMiningSteps } from "./blockchain-utils";
import styles from "./blockchain-playground.module.css";

interface MiningSimulationProps {
  block: Block;
  beginnerMode: boolean;
  onMined: (nonce: number, hash: string) => void;
  onAddToChain: () => void;
}

type MineState = "idle" | "mining" | "mined";

export default function MiningSimulation({
  block,
  beginnerMode,
  onMined,
  onAddToChain,
}: MiningSimulationProps) {
  const [mineState, setMineState] = useState<MineState>("idle");
  const [winnerNonce, setWinnerNonce] = useState<number | null>(null);
  const [addedToChain, setAddedToChain] = useState(false);
  // Separate: hint shown when idle, hidden once mining starts (React-owned)
  const [showHint, setShowHint] = useState(true);

  // logRef is a PURE DOM target — React renders NO children inside it
  const logRef = useRef<HTMLDivElement | null>(null);
  const statusRef = useRef<HTMLDivElement | null>(null);

  const startMining = async () => {
    if (mineState !== "idle") return;
    setMineState("mining");
    // Hide the React-owned hint before we touch the DOM log container
    setShowHint(false);

    const steps = generateMiningSteps(12);
    const INTERVAL = 110; // ms between lines

    // The logRef div has NO React children — safe to manipulate directly
    const container = logRef.current;
    if (container) container.innerHTML = "";

    // Add lines directly to the DOM — zero React re-renders
    for (let i = 0; i < steps.length; i++) {
      await new Promise<void>((r) => setTimeout(r, INTERVAL));

      if (!logRef.current) break; // component unmounted

      const step = steps[i];
      const isWinner = i === steps.length - 1;

      const line = document.createElement("div");
      line.className = styles.miningLogLine;
      if (isWinner) line.dataset.success = "true";

      const nonceSpan = document.createElement("span");
      nonceSpan.className = styles.miningLogNonce;
      nonceSpan.textContent = `Nonce: ${step.nonce.toLocaleString()}`;

      const hashSpan = document.createElement("span");
      hashSpan.className = styles.miningLogHash;
      hashSpan.textContent = `→  ${step.hashPreview}`;

      line.appendChild(nonceSpan);
      line.appendChild(hashSpan);
      logRef.current.appendChild(line);

      // Scroll the *parent* miningLog container (logRef itself has no overflow)
      const scrollContainer = logRef.current.parentElement;
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }

      // Show the success banner via the status ref (no React state)
      if (isWinner && statusRef.current) {
        statusRef.current.style.display = "flex";
        const nonceText = statusRef.current.querySelector("[data-nonce]");
        if (nonceText) nonceText.textContent = step.nonce.toLocaleString();
      }

      if (isWinner) {
        const finalHash = `0000${step.hashPreview
          .replace("...", "")
          .slice(4)}${Math.random().toString(16).slice(2, 18)}`;

        // Short pause before marking mined
        await new Promise<void>((r) => setTimeout(r, 500));
        setWinnerNonce(step.nonce);
        onMined(step.nonce, finalHash);
        setMineState("mined");
      }
    }
  };

  const handleAddToChain = () => {
    setAddedToChain(true);
    onAddToChain();
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <p className={styles.sectionTag}>04 — Mining</p>
        <h2 className={styles.sectionTitle}>Mine the Block</h2>
        <p className={styles.sectionDesc}>
          Mining finds a nonce that makes the block hash start with
          &quot;0000&quot;. This is an educational simulation — real Bitcoin
          requires millions more attempts.
        </p>
      </div>

      {beginnerMode && (
        <div className={styles.beginnerTip}>
          <span className={styles.beginnerTipIcon}>💡</span>
          <span>
            <strong>Nonce</strong> — a number miners keep changing to find a
            valid hash. <strong>Mining</strong> — the process of finding that
            hash. This simulation shows the concept only.
          </span>
        </div>
      )}

      {/* Terminal window */}
      <div className={styles.miningTerminal} style={{ marginTop: 20 }}>
        <div className={styles.miningTerminalBar}>
          <span className={styles.miningTerminalDot} />
          <span className={styles.miningTerminalDot} />
          <span className={styles.miningTerminalDot} />
          <span className={styles.miningTerminalTitle}>
            MINING SIMULATION — EDUCATIONAL ONLY
          </span>
        </div>

        {/* The styled scroll container is React-owned */}
        <div className={styles.miningLog}>
          {/* Hint: React-managed, removed before DOM writes begin */}
          {showHint && (
            <span
              style={{
                fontFamily: "var(--pg-mono)",
                fontSize: 11,
                color: "var(--pg-text-dim)",
                letterSpacing: "0.18em",
              }}
            >
              Press mine to begin...
            </span>
          )}

          {/* Empty DOM target — React NEVER puts children here.
              All appendChild/innerHTML calls are safe. */}
          <div ref={logRef} />
        </div>
      </div>

      {/* Success banner — hidden via inline style, revealed via ref without setState */}
      <div
        ref={statusRef}
        className={styles.miningSuccess}
        style={{ display: "none", marginTop: 16 }}
      >
        <span className={styles.miningSuccessIcon}>✓</span>
        <div>
          <div className={styles.miningSuccessText}>BLOCK MINED</div>
          <div className={styles.miningSuccessSub}>
            Nonce: <span data-nonce="">{winnerNonce?.toLocaleString()}</span>
            {" · "}Hash starts with 0000
          </div>
        </div>
      </div>

      {/* Block summary after mining */}
      {mineState === "mined" && (
        <div
          className={`${styles.card} ${styles.cardRelative}`}
          style={{ marginTop: 16 }}
        >
          <div className={styles.blockField}>
            <span className={styles.blockFieldKey}>Block</span>
            <span className={styles.blockFieldVal} data-accent="orange">
              #{block.index + 1}
            </span>
          </div>
          <div className={styles.blockField}>
            <span className={styles.blockFieldKey}>Transactions</span>
            <span className={styles.blockFieldVal}>
              {block.transactions.length} transaction
              {block.transactions.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className={styles.blockField}>
            <span className={styles.blockFieldKey}>Previous Hash</span>
            <span className={styles.blockFieldVal} data-accent="violet">
              {block.previousHash.slice(0, 20)}…
            </span>
          </div>
          <div className={styles.blockField}>
            <span className={styles.blockFieldKey}>Nonce</span>
            <span className={styles.blockFieldVal} data-accent="orange">
              {winnerNonce?.toLocaleString()}
            </span>
          </div>
          <div className={styles.blockField} style={{ borderBottom: "none" }}>
            <span className={styles.blockFieldKey}>Block Hash</span>
            <span className={styles.blockFieldVal} data-accent="green">
              {block.hash ? `${block.hash.slice(0, 32)}…` : "Computed ✓"}
            </span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 16, marginTop: 20, flexWrap: "wrap", alignItems: "center" }}>
        {mineState === "idle" && (
          <button className={styles.btnPrimary} onClick={startMining} id="mine-block-btn">
            ⛏️ Mine Block
          </button>
        )}

        {mineState === "mining" && (
          <button className={styles.btnPrimary} disabled>
            <span
              className={styles.spinner}
              style={{
                borderTopColor: "#0a0510",
                borderColor: "rgba(10,5,16,0.3)",
              }}
            />
            Mining...
          </button>
        )}

        {mineState === "mined" && !addedToChain && (
          <button
            className={styles.btnPrimary}
            onClick={handleAddToChain}
            id="add-to-chain-btn"
            style={{ background: "var(--pg-green)", color: "#0a0510" }}
          >
            ⛓️ Add to Blockchain →
          </button>
        )}

        {addedToChain && (
          <span
            style={{
              fontFamily: "var(--pg-mono)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.26em",
              color: "var(--pg-green)",
            }}
          >
            ✓ Added to chain
          </span>
        )}
      </div>

      {beginnerMode && mineState === "mined" && (
        <div className={styles.educNote} style={{ marginTop: 20 }}>
          Mining found a nonce producing a hash starting with &quot;0000&quot;.
          Real Bitcoin requires many more leading zeros — demanding enormous
          computation. This educational simulation shows <em>the concept</em>,
          not real mining.
        </div>
      )}
    </div>
  );
}
